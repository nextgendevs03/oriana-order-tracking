import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { Category } from "../../store/productManagementSlice";

const { Option } = Select;

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Category, "id">) => void;
  editingCategory?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  onSubmit,
  editingCategory,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingCategory) {
      form.setFieldsValue({
        name: editingCategory.name,
        status: editingCategory.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
    }
  }, [editingCategory, form, open]);

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
      title={editingCategory ? "Edit Category" : "Add Category"}
      open={open}
      okText="Submit"
      onCancel={handleCancel}
      onOk={handleSave}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Enter category name" />
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

export default CategoryModal;

