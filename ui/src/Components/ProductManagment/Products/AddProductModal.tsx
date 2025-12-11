import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: (newProduct: {
    name: string;
    category: string;
    oem: string;
    status: "Active" | "Inactive";
  }) => void;
  initialValues?: {
    name: string;
    category: string;
    oem: string;
    status: "Active" | "Inactive";
  };
}

const AddProductModal: React.FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const categories = [
    { label: "Category A", value: "Category A" },
    { label: "Category B", value: "Category B" },
  ];

  const oems = [
    { label: "OEM 1", value: "OEM 1" },
    { label: "OEM 2", value: "OEM 2" },
  ];

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = (values: any) => {
    onSuccess(values);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? "Edit Product" : "Add Product"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={520}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Enter product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Select Category"
          name="category"
          rules={[{ required: true, message: "Select category" }]}
        >
          <Select placeholder="Select category" options={categories} />
        </Form.Item>

        <Form.Item
          label="Select OEM"
          name="oem"
          rules={[{ required: true, message: "Select OEM" }]}
        >
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

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
