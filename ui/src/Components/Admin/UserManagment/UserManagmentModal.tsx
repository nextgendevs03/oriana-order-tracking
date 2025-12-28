import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Switch } from "antd";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../store/api/userApi";
import { useGetAllRolesQuery } from "../../../store/api/roleApi";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "@OrianaTypes";
import { useToast } from "../../../hooks/useToast";

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
  const toast = useToast();
  const [form] = Form.useForm<CreateUserRequest>();
  const userId = `USER-${Date.now().toString().slice(-6)}`;

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Fetch roles from API
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRolesQuery({
    limit: 100, // Fetch all roles
  });

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
      // Set default value for isActive to true when creating new user
      form.setFieldsValue({
        isActive: true,
      });
    }
  }, [editingUser, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        const userIdForUpdate = editingUser.userId || editingUser.id;

        if (!userIdForUpdate) {
          toast.error("User ID not found. Cannot update user.");
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
        toast.success("User updated successfully");
      } else {
        const userData: CreateUserRequest = {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
          isActive: values.isActive ?? true,
          createdBy: userId,
          updatedBy: userId,
        };

        await createUser(userData).unwrap();
        toast.success("User created successfully");
      }

      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.data?.error?.message || "Operation failed.");
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
          <Select
            placeholder="Select role"
            loading={isLoadingRoles}
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {rolesData?.data
              ?.filter((role) => role.isActive) // Only show active roles
              .map((role) => (
                <Option key={role.roleId} value={role.roleName}>
                  {role.roleName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          initialValue={true}
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
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
