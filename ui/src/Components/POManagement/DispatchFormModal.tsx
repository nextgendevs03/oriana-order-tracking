import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Button,
  Card,
  Typography,
  Tag,
  message,
} from "antd";
import {
  useCreateDispatchMutation,
  useUpdateDispatchDetailsMutation,
  useGetDispatchesByPoIdQuery,
} from "../../store/api/dispatchApi";
import type { DispatchResponse, DispatchedItemRequest } from "@OrianaTypes";
import type { POItem } from "../../store/poSlice";
import dayjs from "dayjs";
import {
  formatLabel,
  textFieldRulesWithMinLength,
  dateFieldRules,
} from "../../utils";

const { Text } = Typography;

interface DispatchFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  poItems: POItem[];
  editData?: DispatchResponse | null;
}

interface ProductQuantityInfo {
  productId: number;
  productName: string;
  category: string;
  quantity: number;
  dispatchedQuantity: number;
  availableQuantity: number;
}

const DispatchFormModal: React.FC<DispatchFormModalProps> = ({
  visible,
  onClose,
  poId,
  poItems,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // API mutations
  const [createDispatch, { isLoading: isCreating }] = useCreateDispatchMutation();
  const [updateDispatchDetails, { isLoading: isUpdating }] = useUpdateDispatchDetailsMutation();

  // Fetch existing dispatches for current PO
  const { data: existingDispatches = [] } = useGetDispatchesByPoIdQuery(poId, {
    skip: !poId || !visible,
  });

  const isEditMode = !!editData;
  const isSubmitting = isCreating || isUpdating;

  // Get existing dispatches for current PO (excluding current edit record)
  const currentPODispatches = useMemo(() => {
    return existingDispatches.filter(
      (d) => d.dispatchId !== editData?.dispatchId
    );
  }, [existingDispatches, editData?.dispatchId]);

  // Calculate available quantities for all products
  const productQuantityInfo = useMemo((): Record<number, ProductQuantityInfo> => {
    const info: Record<number, ProductQuantityInfo> = {};
    poItems.forEach((item) => {
      const productId = item.productId;
      
      // Sum dispatched quantity from all dispatch entries' dispatchedItems
      const dispatchedQty = currentPODispatches.reduce((sum, d) => {
        const matchingItem = d.dispatchedItems?.find(
          (di) => di.productId === productId
        );
        return sum + (matchingItem?.quantity || 0);
      }, 0);

      const availableQty = item.quantity - dispatchedQty;

      info[productId] = {
        productId,
        productName: item.product,
        category: item.category,
        quantity: item.quantity,
        dispatchedQuantity: dispatchedQty,
        availableQuantity: availableQty > 0 ? availableQty : 0,
      };
    });
    return info;
  }, [poItems, currentPODispatches]);

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      const productIds = editData.dispatchedItems?.map((item) => item.productId) || [];
      setSelectedProducts(productIds);
      const productQuantities: Record<number, number> = {};
      editData.dispatchedItems?.forEach((item) => {
        productQuantities[item.productId] = item.quantity;
      });
      form.setFieldsValue({
        products: productIds,
        projectName: editData.projectName,
        projectLocation: editData.projectLocation,
        deliveryLocation: editData.deliveryLocation,
        deliveryAddress: editData.deliveryAddress,
        googleMapLink: editData.googleMapLink || undefined,
        confirmDispatchDate: editData.confirmDispatchDate
          ? dayjs(editData.confirmDispatchDate)
          : undefined,
        deliveryContact: editData.deliveryContact,
        remarks: editData.remarks || undefined,
        productQuantities: productQuantities,
      });
    } else if (visible && !editData) {
      form.resetFields();
      setSelectedProducts([]);
    }
  }, [visible, editData, form]);

  // Generate product options from PO items with remaining quantity info
  const getProductOptions = () => {
    return poItems.map((item) => {
      const productId = item.productId;
      const info = productQuantityInfo[productId];
      const remainingQty = info?.availableQuantity || 0;
      const isEditProduct = editData?.dispatchedItems?.some(
        (di) => di.productId === productId
      );

      return {
        value: productId,
        label: `${formatLabel(item.product)} - ${formatLabel(item.category)} (Available: ${remainingQty}/${item.quantity})`,
        disabled: remainingQty <= 0 && !isEditProduct,
      };
    });
  };

  const handleProductChange = (values: number[]) => {
    setSelectedProducts(values);
    const currentQuantities = form.getFieldValue("productQuantities") || {};
    const newQuantities: Record<number, number | undefined> = {};
    values.forEach((productId) => {
      newQuantities[productId] = currentQuantities[productId];
    });
    form.setFieldValue("productQuantities", newQuantities);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Build dispatchedItems array from selected products and their quantities
      const dispatchedItems: DispatchedItemRequest[] = selectedProducts
        .map((productId) => ({
          productId: productId,
          quantity: values.productQuantities?.[productId] || 0,
        }))
        .filter((item) => item.quantity > 0);

      if (isEditMode && editData) {
        // Update existing dispatch
        await updateDispatchDetails({
          id: editData.dispatchId,
          data: {
            dispatchedItems: dispatchedItems,
            projectName: values.projectName,
            projectLocation: values.projectLocation,
            deliveryLocation: values.deliveryLocation,
            deliveryAddress: values.deliveryAddress,
            googleMapLink: values.googleMapLink || undefined,
            confirmDispatchDate: values.confirmDispatchDate
              ? dayjs(values.confirmDispatchDate).format("YYYY-MM-DD")
              : undefined,
            deliveryContact: values.deliveryContact,
            remarks: values.remarks || undefined,
          },
        }).unwrap();
        message.success("Dispatch updated successfully");
      } else {
        // Create a new dispatch
        await createDispatch({
          poId: poId,
          dispatchedItems: dispatchedItems,
          projectName: values.projectName,
          projectLocation: values.projectLocation,
          deliveryLocation: values.deliveryLocation,
          deliveryAddress: values.deliveryAddress,
          googleMapLink: values.googleMapLink || undefined,
          confirmDispatchDate: values.confirmDispatchDate
            ? dayjs(values.confirmDispatchDate).format("YYYY-MM-DD")
            : "",
          deliveryContact: values.deliveryContact,
          remarks: values.remarks || undefined,
        }).unwrap();
        message.success("Dispatch created successfully");
      }

      form.resetFields();
      setSelectedProducts([]);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
      message.error("Failed to save dispatch. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedProducts([]);
    onClose();
  };

  // Quantity validation rule for each product
  const getQuantityValidator = (productId: number) => {
    const info = productQuantityInfo[productId];
    const availableQty = info?.availableQuantity || 0;

    return async (_: unknown, value: number) => {
      if (!value && value !== 0) {
        return Promise.reject(new Error("This field is required"));
      }
      if (value < 1) {
        return Promise.reject(new Error("Minimum quantity is 1"));
      }
      if (value > availableQty) {
        return Promise.reject(
          new Error(`Cannot exceed available quantity (${availableQty})`)
        );
      }
      return Promise.resolve();
    };
  };

  return (
    <Modal
      title={isEditMode ? "Edit Dispatch Details" : "Add Dispatch Details"}
      open={visible}
      onCancel={handleCancel}
      width={900}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={selectedProducts.length === 0}
          loading={isSubmitting}
          style={{
            backgroundColor: "#4b6cb7",
          }}
        >
          {isEditMode ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: "1rem" }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="products"
              label="Select Products"
              rules={[
                {
                  required: true,
                  message: "Please select at least one product",
                },
              ]}
            >
              <Select
                mode={isEditMode ? undefined : "multiple"}
                placeholder="Select products from PO"
                options={getProductOptions()}
                onChange={(value) =>
                  handleProductChange(
                    isEditMode ? [value as number] : (value as number[])
                  )
                }
                maxTagCount="responsive"
                disabled={isEditMode}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Product Quantity Fields */}
        {selectedProducts.length > 0 && (
          <Card
            title="Product Quantities"
            size="small"
            style={{ marginBottom: "1rem" }}
          >
            <Row gutter={[16, 8]}>
              {selectedProducts.map((productId) => {
                const info = productQuantityInfo[productId];
                return (
                  <Col span={isEditMode ? 24 : 12} key={productId}>
                    <div
                      style={{
                        padding: "12px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <Text strong>{formatLabel(info?.productName || "")}</Text>
                        <Tag
                          color={info?.availableQuantity > 0 ? "blue" : "red"}
                          style={{ marginLeft: "8px" }}
                        >
                          Available: {info?.availableQuantity || 0}/
                          {info?.quantity || 0}
                        </Tag>
                      </div>
                      <Form.Item
                        name={["productQuantities", productId]}
                        rules={[{ validator: getQuantityValidator(productId) }]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          min={1}
                          max={info?.availableQuantity || 0}
                          placeholder={`Enter quantity (max: ${info?.availableQuantity || 0})`}
                          disabled={!info || info.availableQuantity <= 0}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        )}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="projectLocation"
              label="Project Location"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter project location" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deliveryLocation"
              label="Delivery Location"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter delivery location" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="deliveryAddress"
              label="Delivery Address"
              rules={textFieldRulesWithMinLength}
            >
              <Input.TextArea placeholder="Enter delivery address" rows={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="googleMapLink"
              label="Google Map Link (Optional)"
              rules={[{ type: "url", message: "Please enter a valid URL" }]}
            >
              <Input placeholder="Enter Google Map link" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="confirmDispatchDate"
              label="Confirm Dispatch Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deliveryContact"
              label="Delivery Contact"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter delivery contact" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="remarks" label="Remarks (Optional)">
              <Input.TextArea placeholder="Enter remarks" rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DispatchFormModal;
