import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";

const { Option } = Select;

const ModalDelivery = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Delivery Confirmation"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Date of Delivery"
          name="deliveryDate"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Delivery Status"
          name="deliveryStatus"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select status">
            <Option value="Pending">Pending</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Partially Delivered">Partially Delivered</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Proof of Delivery"
          name="proofOfDelivery"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter proof of delivery (e.g., receipt number)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDelivery;
