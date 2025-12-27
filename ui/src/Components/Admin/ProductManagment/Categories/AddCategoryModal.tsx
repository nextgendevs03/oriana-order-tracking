import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../../store/api/categoryApi";

interface AddCategoryModalProps {
  open: boolean;
  onCancel: () => void;
  initialValues?: any;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isLoading = isCreating || isUpdating;

  // --- Set initial values properly (boolean for isActive) ---
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        isActive: initialValues.isActive === true,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      // Validate form fields - this will show validation errors if form is invalid
      const values = await form.validateFields();

      // Ensure isActive is boolean
      const dataToSend = {
        ...values,
        isActive: Boolean(values.isActive),
      };

      if (initialValues?.categoryId) {
        await updateCategory({
          id: initialValues.categoryId,
          data: {
            ...dataToSend,
            updatedBy: "admin",
          },
        }).unwrap();
        message.success("Category updated successfully");
      } else {
        await createCategory({
          ...dataToSend,
          createdBy: "admin",
        }).unwrap();
        message.success("Category created successfully");
      }

      form.resetFields();
      onCancel();
    } catch (error: any) {
      // If validation fails, form.validateFields() will throw and show errors automatically
      // If API call fails, show error message
      if (error?.data?.message || error?.message) {
        message.error(
          error?.data?.message || error?.message || "Failed to save category"
        );
      }
      // Validation errors are automatically displayed by Ant Design Form
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Category" : "Add Category"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,

        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
        >
          {initialValues ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
