import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button, InputNumber } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const ModalDispatch = ({ open, onClose, onSubmit, products }) => {
  const [form] = Form.useForm();

  const disabledPastDate = (current) => {
    // Disable past dates
    return current && current < dayjs().startOf("day");
  };

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Dispatch Details"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Select Product"
          name="product"
          rules={[{ required: false, message: "Please select a product" }]}
        >
          <Select placeholder="Select product">
            {products.map((item, index) => (
              <Option key={index} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Project Location"
          name="projectLocation"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Delivery Address"
          name="deliveryAddress"
          rules={[{ required: true, message: "Required" }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Google Map Link" name="googleMapLink">
          <Input placeholder="Optional" />
        </Form.Item>

        <Form.Item
          label="Delivery Quantity"
          name="deliveryQuantity"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Confirm Dispatch Date"
          name="confirmDispatchDate"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledPastDate} />
        </Form.Item>

        <Form.Item
          label="Delivery Contact"
          name="deliveryContact"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Remarks" name="remarks">
          <TextArea rows={3} placeholder="Optional" />
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

export default ModalDispatch;
