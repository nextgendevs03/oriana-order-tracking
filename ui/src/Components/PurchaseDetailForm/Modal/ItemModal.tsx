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
  warranty: string;
  remarks?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => void;
}

const ItemModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
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
      title="Add Item Details"
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
          const { quantity = 0, spareQty = 0 } = allValues;
          form.setFieldsValue({
            totalQty: quantity + spareQty,
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
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input placeholder="Enter category" />
          </Form.Item>

          <Form.Item name="oemName" label="OEM Name" rules={[{ required: true }]}>
            <Select placeholder="Select OEM">
              <Option value="Sieneng">Sieneng</Option>
              <Option value="Solis">Solis</Option>
              <Option value="Jio">Jio</Option>
            </Select>
          </Form.Item>

          <Form.Item name="productModel" label="Product Model" rules={[{ required: true }]}>
            <Input placeholder="Enter product model" />
          </Form.Item>

          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="spareQty" label="Spare Quantity" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="totalQty" label="Total Quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>

          <Form.Item name="paymentStatus" label="Payment Status" rules={[{ required: true }]}>
            <Select placeholder="Select payment status">
              <Option value="Advance">Advance</Option>
              <Option value="Received">Received</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>

          <Form.Item name="warranty" label="Warranty" rules={[{ required: true }]}>
            <Select placeholder="Select warranty">
              <Option value="1 Year">1 Year</Option>
              <Option value="2 Years">2 Years</Option>
              <Option value="3 Years">3 Years</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="remarks" label="Remarks" style={{ marginTop: 10 }}>
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ItemModal;
 