import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

interface AddCategoryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (newCategory: {
    name: string;
    status: "Active" | "Inactive";
  }) => void;
  initialValues?: { name: string; status: "Active" | "Inactive" };
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onCancel,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Fill form when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSuccess(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={initialValues ? "Edit Category" : "Add Category"}
      visible={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
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
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
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
