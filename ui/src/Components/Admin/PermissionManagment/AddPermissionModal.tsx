import React, { useEffect } from "react";
import { Modal, Form, Select, Input, Button } from "antd";

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

  const permissionNameOptions = [
    { label: "Create Users", value: "Create Users" },
    { label: "Edit Users", value: "Edit Users" },
    { label: "Delete Users", value: "Delete Users" },
    { label: "View users", value: "View users" },
  ];

  const permissionCodeOptions = [
    { label: "user.create", value: "user.create" },
    { label: "user.edit", value: "user.edit" },
    { label: "user.delete", value: "user.delete" },
    { label: "user.view", value: "user.view" },
  ];

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
        {/* Permission Name Dropdown */}
        <Form.Item
          label="Permission Name"
          name="name"
          rules={[{ required: true, message: "Permission name is required" }]}
        >
          <Select placeholder="Select Permission Name" options={permissionNameOptions} />
        </Form.Item>

        {/* Permission Code Dropdown */}
        <Form.Item
          label="Permission Code"
          name="code"
          rules={[{ required: true, message: "Permission code is required" }]}
        >
          <Select placeholder="Select Permission Code" options={permissionCodeOptions} />
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
          rules={[{ required: true, message: "Description is required" }]}
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