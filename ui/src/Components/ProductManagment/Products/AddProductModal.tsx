import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../store/api/productApi";
import { useGetCategoriesQuery } from "../../../store/api/categoryApi";
import { useGetOEMsQuery } from "../../../store/api/oemApi";

interface Props {
  open: boolean;
  onCancel: () => void;
  initialValues?: any; // backend se aaya ProductResponse
}

const AddProductModal: React.FC<Props> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const { data: categories } = useGetCategoriesQuery();
  const { data: oems } = useGetOEMsQuery();
  console.log( oems);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        productName: initialValues.productName,
        categoryId: initialValues.category?.categoryId, // ✅ object se ID
        oemId: initialValues.oem?.oemId,               // ✅ object se ID
        isActive: initialValues.status ?? initialValues.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    try {
      if (initialValues) {
        await updateProduct({
          id: initialValues.productId,
          data: values,
        }).unwrap();
      } else {
        await createProduct(values).unwrap();
      }
      form.resetFields();
      onCancel();
    } catch (err) {
      console.error("Error submitting product:", err);
    }
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
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select
            placeholder="Select Category"
            options={categories?.map((c: any) => ({
              value: c.categoryId,
              label: c.categoryName, // ✅ Name show hoga
            }))}
          />
        </Form.Item>

        <Form.Item
          label="OEM"
          name="oemId"
          rules={[{ required: true, message: "Please select OEM" }]}
        >
          <Select
            placeholder="Select OEM"
            options={oems?.map((o: any) => ({
              value: o.oemId,   // ✅ backend se ID
              label: o.name, // ✅ Name show hoga
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
