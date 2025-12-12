import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../store/api/productApi";

interface Props {
  open: boolean;
  onCancel: () => void;
  initialValues?: any;
}

const AddProductModal: React.FC<Props> = ({
  open,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const categories = [
    { label: "Category A", value: "Category A" },
    { label: "Category B", value: "Category B" },
  ];

  const oems = [
    { label: "OEM 1", value: "OEM 1" },
    { label: "OEM 2", value: "OEM 2" },
  ];

  useEffect(() => {
    initialValues ? form.setFieldsValue(initialValues) : form.resetFields();
  }, [initialValues, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (initialValues) {
      await updateProduct({
        id: initialValues.productId,
        data: values,
      });
    } else {
      await createProduct(values);
    }

    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? "Edit Product" : "Add Product"}
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
      width={520}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Select Category"
          name="category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select category" options={categories} />
        </Form.Item>

        <Form.Item label="Select OEM" name="oem" rules={[{ required: true }]}>
          <Select placeholder="Select OEM" options={oems} />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
