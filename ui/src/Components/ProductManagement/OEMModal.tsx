import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { OEM } from "../../store/productManagementSlice";

const { Option } = Select;

interface OEMModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<OEM, "id">) => void;
  editingOEM?: OEM | null;
}

const OEMModal: React.FC<OEMModalProps> = ({
  open,
  onClose,
  onSubmit,
  editingOEM,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingOEM) {
      form.setFieldsValue({
        name: editingOEM.name,
        status: editingOEM.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
    }
  }, [editingOEM, form, open]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={editingOEM ? "Edit OEM" : "Add OEM"}
      open={open}
      okText="Submit"
      onCancel={handleCancel}
      onOk={handleSave}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="OEM Name"
          name="name"
          rules={[{ required: true, message: "Please enter OEM name" }]}
        >
          <Input placeholder="Enter OEM name" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OEMModal;

