import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../store/api/categoryApi";

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

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  // --- Set initial values properly (boolean for isActive) ---
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        isActive:
          initialValues.isActive === true ||
          initialValues.isActive === "true", // Convert string to boolean
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    // Ensure isActive is boolean
    const dataToSend = {
      ...values,
      isActive: Boolean(values.isActive),
    };

    if (initialValues) {
      await updateCategory({
        id: initialValues.categoryId,
        data: {
          ...dataToSend,
          updatedBy: "admin", 
        },
      });
    } else {
      await createCategory({
        ...dataToSend,
        createdBy: "admin", 
      });
    }

    form.resetFields();
    onCancel();
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

        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
