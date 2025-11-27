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

interface DispatchModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DispatchFormData) => void;
  products: string[];
  editData?: DispatchFormData | null;
}

const ModalDispatch: React.FC<DispatchModalProps> = ({
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
      width={550} // smaller width
      title={editData ? "Edit Dispatch" : "Add Dispatch"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} size="small">
        {/* Compact 2-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px 2px", // smaller gap
          }}
        >
          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: false }]}
          >
            <Select placeholder="Select product">
              {products.map((p, idx) => (
                <Select.Option key={idx} value={p}>
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
            label="Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            name="confirmDispatchDate"
            label="Confirm Date"
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
        </div>

        {/* Remarks Full Width */}
        <Form.Item name="remarks" label="Remarks">
          <TextArea rows={2} />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "center", marginTop: 8 }}>
          <Button type="primary" htmlType="submit">
            {editData ? "Update Dispatch" : "Add Dispatch"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDispatch;
