import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";
import { useToast } from "../../../hooks/useToast";

import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from "../../../store/api/permissionApi";
import { PermissionResponse } from "@OrianaTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  permissionToEdit?: PermissionResponse;
}

const AddPermissionModal: React.FC<Props> = ({
  open,
  onClose,
  permissionToEdit,
}) => {
  const toast = useToast();
  const [form] = Form.useForm();

  const [createPermissionApi] = useCreatePermissionMutation();
  const [updatePermissionApi] = useUpdatePermissionMutation();

  useEffect(() => {
    if (permissionToEdit) {
      form.setFieldsValue({
        permissionName: permissionToEdit.permissionName,
        permissionCode: permissionToEdit.permissionCode,
        description: permissionToEdit.description,
        isActive: permissionToEdit.isActive ?? true,
      });
    } else {
      form.resetFields();
      // Set default value for isActive
      form.setFieldsValue({ isActive: true });
    }
  }, [permissionToEdit, form]);

  const handleFinish = async (values: {
    permissionCode: string;
    permissionName: string;
    description?: string;
    isActive?: boolean;
  }) => {
    try {
      if (permissionToEdit) {
        // UPDATE
        await updatePermissionApi({
          id: String(permissionToEdit.permissionId),
          ...values,
          updatedBy: "admin", // TODO: Get from auth context
        }).unwrap();

        toast.success("Permission Updated Successfully!");
      } else {
        // CREATE
        await createPermissionApi({
          ...values,
          createdBy: "admin", // TODO: Get from auth context
        }).unwrap();
        toast.success("Permission Created Successfully!");
      }

      onClose();
    } catch (e) {
      toast.error("Error Saving Permission!");
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={550}
      title={permissionToEdit ? "Edit Permission" : "Add Permission"}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Permission Name"
          name="permissionName"
          rules={[{ required: true, message: "Please enter permission name" }]}
        >
          <Input placeholder="Enter Permission Name" />
        </Form.Item>

        <Form.Item
          label="Permission Code"
          name="permissionCode"
          rules={[{ required: true, message: "Please enter permission code" }]}
        >
          <Input
            placeholder="Enter Permission Code (e.g., USR_CREATE)"
            disabled={!!permissionToEdit}
          />
        </Form.Item>

        <Form.Item label="Permission Description" name="description">
          <Input.TextArea rows={3} placeholder="Enter permission description" />
        </Form.Item>

        <Form.Item
          label="Active"
          name="isActive"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch defaultChecked />
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
