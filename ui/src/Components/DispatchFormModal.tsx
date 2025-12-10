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
} from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addDispatchDetail,
  updateDispatchDetail,
  DispatchDetail,
  DispatchedItem,
  POItem,
} from "../store/poSlice";
import dayjs from "dayjs";

const { Text } = Typography;

interface DispatchFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  poItems: POItem[];
  editData?: DispatchDetail | null;
}

interface ProductQuantityInfo {
  product: string;
  category: string;
  quantity: number; // Actual quantity (excluding spare)
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
  const dispatch = useAppDispatch();
  const dispatchDetails = useAppSelector((state) => state.po.dispatchDetails);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const isEditMode = !!editData;

  // Get existing dispatches for current PO (excluding current edit record)
  const currentPODispatches = dispatchDetails.filter(
    (d) => d.poId === poId && d.id !== editData?.id
  );

  // Calculate available quantities for all products (based on quantity, not totalQuantity)
  const productQuantityInfo = useMemo((): Record<string, ProductQuantityInfo> => {
    const info: Record<string, ProductQuantityInfo> = {};
    poItems.forEach((item) => {
      // Sum dispatched quantity from all dispatch entries' dispatchedItems
      const dispatchedQty = currentPODispatches.reduce((sum, d) => {
        const itemQty = d.dispatchedItems?.find((di) => di.product === item.product)?.quantity || 0;
        return sum + itemQty;
      }, 0);
      // Use quantity (actual items) not totalQuantity (which includes spare)
      const availableQty = item.quantity - dispatchedQty;

      info[item.product] = {
        product: item.product,
        category: item.category,
        quantity: item.quantity, // Actual quantity (excluding spare)
        dispatchedQuantity: dispatchedQty,
        availableQuantity: availableQty > 0 ? availableQty : 0,
      };
    });
    return info;
  }, [poItems, currentPODispatches]);

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      const products = editData.dispatchedItems?.map((item) => item.product) || [];
      setSelectedProducts(products);
      const productQuantities: Record<string, number> = {};
      editData.dispatchedItems?.forEach((item) => {
        productQuantities[item.product] = item.quantity;
      });
      form.setFieldsValue({
        products: products,
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
      const info = productQuantityInfo[item.product];
      const remainingQty = info?.availableQuantity || 0;
      const isEditProduct = editData?.dispatchedItems?.some((di) => di.product === item.product);

      return {
        value: item.product,
        label: `${item.product.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} - ${item.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} (Available: ${remainingQty}/${item.quantity})`,
        disabled: remainingQty <= 0 && !isEditProduct,
      };
    });
  };

  const formatLabel = (value: string) => {
    if (!value) return "";
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleProductChange = (values: string[]) => {
    setSelectedProducts(values);
    // Reset quantities for products that are deselected
    const currentQuantities = form.getFieldValue("productQuantities") || {};
    const newQuantities: Record<string, number | undefined> = {};
    values.forEach((product) => {
      newQuantities[product] = currentQuantities[product];
    });
    form.setFieldValue("productQuantities", newQuantities);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Build dispatchedItems array from selected products and their quantities
      const dispatchedItems: DispatchedItem[] = selectedProducts
        .map((product) => ({
          product: product,
          quantity: values.productQuantities?.[product] || 0,
        }))
        .filter((item) => item.quantity > 0);

      if (isEditMode && editData) {
        // Update existing dispatch
        const updatedDispatch: DispatchDetail = {
          ...editData,
          dispatchedItems: dispatchedItems,
          projectName: values.projectName,
          projectLocation: values.projectLocation,
          deliveryLocation: values.deliveryLocation,
          deliveryAddress: values.deliveryAddress,
          googleMapLink: values.googleMapLink || "",
          confirmDispatchDate: values.confirmDispatchDate
            ? dayjs(values.confirmDispatchDate).format("YYYY-MM-DD")
            : "",
          deliveryContact: values.deliveryContact,
          remarks: values.remarks || "",
        };

        dispatch(updateDispatchDetail(updatedDispatch));
      } else {
        // Create a single dispatch entry with all selected products
        const timestamp = Date.now();
        const dispatchData: DispatchDetail = {
          id: `DISPATCH-${timestamp.toString().slice(-8)}`,
          poId: poId,
          dispatchedItems: dispatchedItems,
          projectName: values.projectName,
          projectLocation: values.projectLocation,
          deliveryLocation: values.deliveryLocation,
          deliveryAddress: values.deliveryAddress,
          googleMapLink: values.googleMapLink || "",
          confirmDispatchDate: values.confirmDispatchDate
            ? dayjs(values.confirmDispatchDate).format("YYYY-MM-DD")
            : "",
          deliveryContact: values.deliveryContact,
          remarks: values.remarks || "",
          createdAt: new Date().toISOString(),
        };

        dispatch(addDispatchDetail(dispatchData));
      }

      form.resetFields();
      setSelectedProducts([]);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedProducts([]);
    onClose();
  };

  const textFieldRules = [
    { required: true, message: "This field is required" },
    { min: 3, message: "Minimum 3 characters required" },
  ];

  const dateFieldRules = [{ required: true, message: "Please select a date" }];

  // Quantity validation rule for each product
  const getQuantityValidator = (product: string) => {
    const info = productQuantityInfo[product];
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
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={selectedProducts.length === 0}
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
                    isEditMode ? [value as string] : (value as string[])
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
              rules={textFieldRules}
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
              {selectedProducts.map((product) => {
                const info = productQuantityInfo[product];
                return (
                  <Col span={isEditMode ? 24 : 12} key={product}>
                    <div
                      style={{
                        padding: "12px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <Text strong>{formatLabel(product)}</Text>
                        <Tag
                          color={info?.availableQuantity > 0 ? "blue" : "red"}
                          style={{ marginLeft: "8px" }}
                        >
                          Available: {info?.availableQuantity || 0}/
                          {info?.quantity || 0}
                        </Tag>
                      </div>
                      <Form.Item
                        name={["productQuantities", product]}
                        rules={[{ validator: getQuantityValidator(product) }]}
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
              rules={textFieldRules}
            >
              <Input placeholder="Enter project location" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deliveryLocation"
              label="Delivery Location"
              rules={textFieldRules}
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
              rules={textFieldRules}
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
              rules={textFieldRules}
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

