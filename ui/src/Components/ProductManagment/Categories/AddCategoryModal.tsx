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

  useEffect(() => {
    initialValues ? form.setFieldsValue(initialValues) : form.resetFields();
  });

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (initialValues) {
      await updateCategory({
        id: initialValues.categoryId,
        data: values,
      });
    } else {
      await createCategory(values);
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
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
