import React from "react";
import { Modal, Form, Input, Select, Switch } from "antd";
import { addUser, User } from "../../store/userSlice";
import { useAppDispatch } from "../../store/hook";

const { Option } = Select;

interface UserMnagmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UserManagementModal: React.FC<UserMnagmentModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const userId = `USER-${Date.now().toString().slice(-6)}`;

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // console.log(values);

      const userData: User = {
        id: userId,
        name: values.userName,
        email: values.email,
        role: values.role,
        status: values.status ? "Active" : "Inactive",
      };

      // console.log(userData);
      dispatch(addUser(userData));
      onSubmit(userData);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Add User"
      open={open}
      okText="Save"
      onCancel={() => onClose()}
      onOk={() => handleSave()}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="User Name"
          name="userName"
          rules={[{ required: true, message: "Please enter user name" }]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input placeholder="Enter email" />
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
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            defaultChecked
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserManagementModal;
