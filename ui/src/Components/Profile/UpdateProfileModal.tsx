import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Tooltip } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useUpdateUserMutation } from "../../store/api/userApi";
import { useToast } from "../../hooks/useToast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addAuth, selectAuth } from "../../store/authSlice";

interface UpdateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentUser: {
    userId?: number;
    username: string;
    email: string;
  };
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  visible,
  onClose,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const currentAuth = useAppSelector(selectAuth);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Set initial form values when modal opens
  useEffect(() => {
    if (visible && currentUser) {
      form.setFieldsValue({
        username: currentUser.username,
        email: currentUser.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [visible, currentUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!currentUser.userId) {
        toast.error("User ID not available", {
          description: "Cannot update profile without user ID",
        });
        return;
      }

      // Build update payload - only include fields that have changed
      const updatePayload: {
        username?: string;
        email?: string;
        password?: string;
      } = {};

      if (values.username && values.username !== currentUser.username) {
        updatePayload.username = values.username;
      }

      if (values.email && values.email !== currentUser.email) {
        updatePayload.email = values.email;
      }

      // Only include password if it's provided
      if (values.password && values.password.trim() !== "") {
        updatePayload.password = values.password;
      }

      // Check if there are any changes
      if (Object.keys(updatePayload).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await updateUser({
        userId: currentUser.userId,
        data: updatePayload,
      }).unwrap();

      // Update Redux auth state with new username/email if changed
      if (updatePayload.username || updatePayload.email) {
        dispatch(
          addAuth({
            ...currentAuth,
            username: updatePayload.username || currentUser.username,
            email: updatePayload.email || currentUser.email,
          })
        );
      }

      toast.success("Profile updated successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error("Failed to update profile", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Update Profile"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isUpdating}
        >
          Update
        </Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="username"
          label="User Name"
          rules={[
            { required: true, message: "Please enter username" },
            { min: 3, message: "Username must be at least 3 characters" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.trim() === "") {
                  return Promise.resolve(); // Password is optional
                }
                if (value.length < 5) {
                  return Promise.reject(
                    new Error("Password must be at least 5 characters")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          help="Leave blank to keep current password"
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter new password (optional)"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            {
              validator: (_, value) => {
                const password = form.getFieldValue("password");
                if (!password || password.trim() === "") {
                  return Promise.resolve(); // No password entered, so no need to confirm
                }
                if (!value) {
                  return Promise.reject(
                    new Error("Please confirm your password")
                  );
                }
                if (value !== password) {
                  return Promise.reject(new Error("Passwords do not match"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
