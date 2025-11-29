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
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  addDispatchDetail,
  updateDispatchDetail,
  DispatchDetail,
  POItem,
} from "../../../store/poSlice";
import dayjs from "dayjs";

const { Text } = Typography;

interface DispatchModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  poItems: POItem[];
  editData?: DispatchDetail | null;
}

interface ProductQuantityInfo {
  product: string;
  category: string;
  totalQuantity: number;
  dispatchedQuantity: number;
  availableQuantity: number;
}

const DispatchModal: React.FC<DispatchModalProps> = ({
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

  // Calculate available quantities for all products
  const productQuantityInfo = useMemo((): Record<string, ProductQuantityInfo> => {
    const info: Record<string, ProductQuantityInfo> = {};
    poItems.forEach((item) => {
      const dispatchedQty = currentPODispatches
        .filter((d) => d.product === item.product)
        .reduce((sum, d) => sum + d.deliveryQuantity, 0);
      const availableQty = item.totalQuantity - dispatchedQty;

      info[item.product] = {
        product: item.product,
        category: item.category,
        totalQuantity: item.totalQuantity,
        dispatchedQuantity: dispatchedQty,
        availableQuantity: availableQty > 0 ? availableQty : 0,
      };
    });
    return info;
  }, [poItems, currentPODispatches]);

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      setSelectedProducts([editData.product]);
      form.setFieldsValue({
        products: [editData.product],
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
        productQuantities: {
          [editData.product]: editData.deliveryQuantity,
        },
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

      return {
        value: item.product,
        label: `${item.product.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} - ${item.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} (Available: ${remainingQty}/${item.totalQuantity})`,
        disabled: remainingQty <= 0 && item.product !== editData?.product,
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

      if (isEditMode && editData) {
        // Update existing dispatch
        const product = selectedProducts[0];
        const quantity = values.productQuantities?.[product];

        const updatedDispatch: DispatchDetail = {
          ...editData,
          product: product,
          projectName: values.projectName,
          projectLocation: values.projectLocation,
          deliveryLocation: values.deliveryLocation,
          deliveryAddress: values.deliveryAddress,
          googleMapLink: values.googleMapLink || "",
          deliveryQuantity: quantity,
          confirmDispatchDate: values.confirmDispatchDate
            ? dayjs(values.confirmDispatchDate).format("YYYY-MM-DD")
            : "",
          deliveryContact: values.deliveryContact,
          remarks: values.remarks || "",
        };

        dispatch(updateDispatchDetail(updatedDispatch));
      } else {
        // Create new dispatch records for each selected product
        const timestamp = Date.now();
        selectedProducts.forEach((product, index) => {
          const quantity = values.productQuantities?.[product];
          if (quantity && quantity > 0) {
            const dispatchData: DispatchDetail = {
              id: `DISPATCH-${(timestamp + index).toString().slice(-8)}`,
              poId: poId,
              product: product,
              projectName: values.projectName,
              projectLocation: values.projectLocation,
              deliveryLocation: values.deliveryLocation,
              deliveryAddress: values.deliveryAddress,
              googleMapLink: values.googleMapLink || "",
              deliveryQuantity: quantity,
              confirmDispatchDate: values.confirmDispatchDate
                ? dayjs(values.confirmDispatchDate).format("YYYY-MM-DD")
                : "",
              deliveryContact: values.deliveryContact,
              remarks: values.remarks || "",
              createdAt: new Date().toISOString(),
            };

            dispatch(addDispatchDetail(dispatchData));
          }
        });
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
                          {info?.totalQuantity || 0}
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

export default DispatchModal;
