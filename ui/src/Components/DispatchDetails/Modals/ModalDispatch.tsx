import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

const { TextArea } = Input;

export interface DispatchFormData {
  product: string;
  projectName: string;
  projectLocation: string;
  deliveryAddress: string;
  googleMapLink?: string;
  deliveryQuantity: number;
  confirmDispatchDate: Dayjs;
  deliveryContact: string;
  remarks?: string;
}

interface ModalDispatchProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DispatchFormData) => void;
  products: string[];
  editData?: DispatchFormData | null; // for editing
}

const ModalDispatch: React.FC<ModalDispatchProps> = ({
  open,
  onClose,
  onSubmit,
  products,
  editData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        ...editData,
        confirmDispatchDate: dayjs(editData.confirmDispatchDate),
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={editData ? "Edit Dispatch" : "Add Dispatch"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="product"
          label="Select Product"
          rules={[{ required: false }]}
        >
          <Select placeholder="Select a product">
            {products.map((p, index) => (
              <Select.Option key={index} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="projectLocation"
          label="Project Location"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="deliveryAddress"
          label="Delivery Address"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="googleMapLink" label="Google Map Link">
          <Input />
        </Form.Item>

        <Form.Item
          name="deliveryQuantity"
          label="Delivery Quantity"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Form.Item
          name="confirmDispatchDate"
          label="Confirm Dispatch Date"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="deliveryContact"
          label="Delivery Contact"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="remarks" label="Remarks">
          <TextArea rows={3} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {editData ? "Update Dispatch" : "Add Dispatch"}
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalDispatch;
