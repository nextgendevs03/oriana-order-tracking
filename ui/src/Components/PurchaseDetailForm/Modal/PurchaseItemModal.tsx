import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

export interface ItemFormValues {
  category: string;
  oemName: string;
  productModel: string;
  quantity: number;
  spareQty: number;
  totalQty: number;
  paymentStatus: string;
  pricePerUnit: number;
  totalPrice: number; 
  warranty: string;
  remarks?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => void;
}

const PurchaseItemModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm<ItemFormValues>();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible, form]);

  return (
    <Modal
      title="Add Purchase Item"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
      width={520}
      centered
      style={{ marginTop: "-30px" }}
      getContainer={false}
      bodyStyle={{
        padding: "16px 20px",
        maxHeight: "65vh",
        overflowY: "auto",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changed, allValues) => {
          const { quantity = 0, spareQty = 0, pricePerUnit = 0 } = allValues;

          const totalQty = quantity + spareQty;
          const totalPrice = totalQty * pricePerUnit;

          form.setFieldsValue({
            totalQty,
            totalPrice,
          });
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {/* Category */}
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Category" showSearch>
              <Option value="Inverter">Inverter</Option>
              <Option value="Panel">Panel</Option>
              <Option value="DC Cable">DC Cable</Option>
              <Option value="AC Cable">AC Cable</Option>
              <Option value="MC4 Connector">MC4 Connector</Option>
              <Option value="SPD">SPD</Option>
              <Option value="Earthing Kit">Earthing Kit</Option>
              <Option value="Display Unit">Display Unit</Option>
              <Option value="WiFi Dongle">WiFi Dongle</Option>
            </Select>
          </Form.Item>

          {/* OEM Name */}
          <Form.Item
            name="oemName"
            label="OEM Name"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select OEM">
              <Option value="Sieneng">Sieneng</Option>
              <Option value="Solis">Solis</Option>
              <Option value="Jio">Jio</Option>
            </Select>
          </Form.Item>

          {/* Product Model */}
          <Form.Item
            name="productModel"
            label="Product Model"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Product Model" showSearch>
              <Option value="SPD Type 1">SPD Type 1</Option>
              <Option value="SPD Type 2">SPD Type 2</Option>
              <Option value="ACDB">ACDB</Option>
              <Option value="DCDB">DCDB</Option>
              <Option value="MC4 Connector">MC4 Connector</Option>
              <Option value="WiFi Dongle">WiFi Dongle</Option>
              <Option value="Display Unit">Display Unit</Option>
            </Select>
          </Form.Item>

          {/* Quantity */}
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          {/* Spare Qty */}
          <Form.Item
            name="spareQty"
            label="Spare Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* Total Qty */}
          <Form.Item
            name="totalQty"
            label="Total Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>

          {/* Payment Status */}
          <Form.Item
            name="paymentStatus"
            label="Payment Status"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select payment status">
              <Option value="Advance">Advance</Option>
              <Option value="Received">Received</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>

          {/* Price per Unit */}
          <Form.Item
            name="pricePerUnit"
            label="Price"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter price per unit"
            />
          </Form.Item>

          {/* TOTAL PRICE */}
          <Form.Item
            name="totalPrice"
            label="Total Price"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              disabled
              placeholder="Auto calculated"
            />
          </Form.Item>

          {/* Warranty */}
          <Form.Item
            name="warranty"
            label="Warranty"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select warranty">
              <Option value="1 Year">1 Year</Option>
              <Option value="2 Years">2 Years</Option>
              <Option value="3 Years">3 Years</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Remarks */}
        <Form.Item name="remarks" label="Remarks" style={{ marginTop: 10 }}>
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PurchaseItemModal;
