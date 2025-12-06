import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  permissionToEdit?: any;
}

const AddPermissionModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  permissionToEdit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (permissionToEdit) {
      form.setFieldsValue(permissionToEdit);
    } else {
      form.resetFields();
    }
  }, [permissionToEdit, form]);

  return (
    <Modal
      open={open}
      title={permissionToEdit ? "Edit Permission" : "Add New Permission"}
      onCancel={onClose}
      footer={null}
      width={550}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ marginTop: 10 }}
      >
        {/* Permission Name */}
        <Form.Item
          label="Permission Name"
          name="name"
          rules={[{ required: true, message: "Permission name is required" }]}
        >
          <Input placeholder="e.g., Create Users" />
        </Form.Item>

        {/* Permission Code */}
        <Form.Item
          label="Permission Code"
          name="code"
          rules={[{ required: true, message: "Permission code is required" }]}
        >
          <Input placeholder="e.g., user.create" />
        </Form.Item>

        {/* Module Dropdown */}
        <Form.Item
          label="Module"
          name="module"
          rules={[{ required: true, message: "Module is required" }]}
        >
          <Select
            placeholder="Select a module"
            options={[
              { label: "users", value: "users" },
              { label: "roles", value: "roles" },
              { label: "permissions", value: "permissions" },
            ]}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Description is required" },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Describe what this permission allows"
          />
        </Form.Item>

        {/* Footer Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {permissionToEdit ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPermissionModal;
