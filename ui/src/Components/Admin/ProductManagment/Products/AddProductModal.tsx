import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../../store/api/productApi";
import { useGetCategoriesQuery } from "../../../../store/api/categoryApi";
import { useGetOEMsQuery } from "../../../../store/api/oemApi";
import { useToast } from "../../../../hooks/useToast";

interface Props {
  open: boolean;
  onCancel: () => void;
  initialValues?: any; // backend se aaya ProductResponse
}

const AddProductModal: React.FC<Props> = ({
  open,
  onCancel,
  initialValues,
}) => {
  const toast = useToast();
  const [form] = Form.useForm();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isLoading = isCreating || isUpdating;

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: oemsResponse } = useGetOEMsQuery();
  
  const categories = categoriesResponse?.data || [];
  const oems = oemsResponse?.data || [];

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        productName: initialValues.productName,
        categoryId: initialValues.category?.categoryId, // ✅ object se ID
        oemId: initialValues.oem?.oemId, // ✅ object se ID
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

      if (initialValues?.productId) {
        await updateProduct({
          id: initialValues.productId,
          data: dataToSend,
        }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(dataToSend).unwrap();
        toast.success("Product created successfully");
      }

      form.resetFields();
      onCancel();
    } catch (error: any) {
      // If validation fails, form.validateFields() will throw and show errors automatically
      // If API call fails, show error message
      if (error?.data?.message || error?.message) {
        toast.error(
          error?.data?.message || error?.message || "Failed to save product"
        );
      }
      // Validation errors are automatically displayed by Ant Design Form
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
          label="Product Name"
          name="productName"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="Enter product name" />
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
              value: o.oemId, // ✅ backend se ID
              label: o.name, // ✅ Name show hoga
            }))}
          />
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

export default AddProductModal;
