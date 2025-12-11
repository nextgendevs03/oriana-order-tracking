import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import { useAppDispatch } from "../../store/hooks";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../store/api/userApi";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "@OrianaTypes";

const { Option } = Select;

interface UserManagmentModalProps {
  open: boolean;
  onClose: () => void;
  editingUser?: (UserResponse & { id?: string }) | null;
}

const UserManagementModal: React.FC<UserManagmentModalProps> = ({
  open,
  onClose,
  editingUser,
}) => {
  const [form] = Form.useForm<CreateUserRequest>();
  const dispatch = useAppDispatch();
  const userId = `USER-${Date.now().toString().slice(-6)}`;

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue({
        username: editingUser.username,
        email: editingUser.email,
        password: editingUser.password,
        role: editingUser.role,
        isActive: editingUser.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [editingUser, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        const userIdForUpdate = editingUser.userId || editingUser.id;

        if (!userIdForUpdate) {
          message.error("User ID not found. Cannot update user.");
          return;
        }

        const updatePayload: UpdateUserRequest = {
          username: editingUser.username,
          email: values.email,
          password: values.password || undefined,
          isActive: values.isActive ?? false,
          updatedBy: userId,
        };

        await updateUser({
          userId: userIdForUpdate,
          data: updatePayload,
        }).unwrap();
        message.success("User updated successfully");
      } else {
        const userData: CreateUserRequest = {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
          isActive: values.isActive ? true : false,
          createdBy: userId,
          updatedBy: userId,
        };

        await createUser(userData).unwrap();
        message.success("User created successfully");
      }

      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      message.error(error?.data?.error?.message || "Operation failed.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      title={editingUser ? "Edit User" : "Add User"}
      open={open}
      okText="Save"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSave}
      okButtonProps={{ loading: isLoading }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="User Name"
          name="username"
          rules={[{ required: true, message: "Please enter user name" }]}
        >
          <Input placeholder="Enter user name" disabled={!!editingUser} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: !editingUser, message: "Please enter password" }]}
        >
          <Input.Password
            placeholder={
              editingUser
                ? "Leave blank to keep existing password"
                : "Enter password"
            }
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select role" }]}
        >
          <Select placeholder="Select role">
            <Option value="Super Admin">Super Admin</Option>
            <Option value="Manager">Manager</Option>
            <Option value="Viewer">Viewer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            defaultChecked
            onChange={(checked) => {
              form.setFieldsValue({
                isActive: checked ? true : false,
              });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserManagementModal;
