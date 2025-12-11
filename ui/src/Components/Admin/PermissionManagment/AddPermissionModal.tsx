import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";

import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from "../../../store/api/permissionApi";

interface Props {
  open: boolean;
  onClose: () => void;
  permissionToEdit?: any;
}

const permissionNames = [
  { label: "Create Users", value: "create_users" },
  { label: "View Users", value: "view_users" },
  { label: "Edit Users", value: "edit_users" },
  { label: "Delete Users", value: "delete_users" },
];

const permissionCodes = [
  { label: "USR_CREATE", value: "USR_CREATE" },
  { label: "USR_VIEW", value: "USR_VIEW" },
  { label: "USR_EDIT", value: "USR_EDIT" },
  { label: "USR_DELETE", value: "USR_DELETE" },
];

const AddPermissionModal: React.FC<Props> = ({
  open,
  onClose,
  permissionToEdit,
}) => {
  const [form] = Form.useForm();

  const [createPermissionApi] = useCreatePermissionMutation();
  const [updatePermissionApi] = useUpdatePermissionMutation();

  useEffect(() => {
    if (permissionToEdit) {
      form.setFieldsValue({
        permissionName: permissionToEdit.permissionName,
        permissionCode: permissionToEdit.permissionCode,
        module: permissionToEdit.module,
        description: permissionToEdit.description,
      });
    } else {
      form.resetFields();
    }
  }, [permissionToEdit]);

  const handleFinish = async (values: any) => {
    try {
      if (permissionToEdit) {
        // UPDATE
        await updatePermissionApi({
          id: permissionToEdit.permissionId, // FIXED
          ...values,
        }).unwrap();

        message.success("Permission Updated Successfully!");
      } else {
        // CREATE
        await createPermissionApi(values).unwrap();
        message.success("Permission Created Successfully!");
      }

      onClose();
    } catch (e) {
      message.error("Error Saving Permission!");
    }
  };

  return (
    <Modal open={open} footer={null} onCancel={onClose} width={550}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Permission Name"
          name="permissionName"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select Permission Name"
            options={permissionNames}
          />
        </Form.Item>

        <Form.Item
          label="Code"
          name="permissionCode"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select Code" options={permissionCodes} />
        </Form.Item>

        <Form.Item label="Module" name="module" rules={[{ required: true }]}>
          <Select
            placeholder="Select Module"
            options={[
              { label: "users", value: "users" },
              { label: "roles", value: "roles" },
              { label: "permissions", value: "permissions" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

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
