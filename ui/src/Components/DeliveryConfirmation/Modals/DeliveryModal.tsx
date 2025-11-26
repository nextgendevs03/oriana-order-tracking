import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import { Dayjs } from "dayjs";

const { Option } = Select;

export interface DeliveryFormData {
  deliveryDate: Dayjs;
  deliveryStatus: string;
  proofOfDelivery: string;
}

interface DeliveryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryFormData) => void;
  initialValues: DeliveryFormData | null;
}

const ModalDelivery: React.FC<DeliveryModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: DeliveryFormData) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? "Edit Delivery" : "Add Delivery Confirmation"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="deliveryDate"
          label="Date of Delivery"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="deliveryStatus"
          label="Delivery Status"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select status">
            <Option value="Pending">Pending</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Partially Delivered">Partially Delivered</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="proofOfDelivery"
          label="Proof of Delivery"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {initialValues ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDelivery;
