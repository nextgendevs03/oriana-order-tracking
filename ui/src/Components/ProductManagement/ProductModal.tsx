import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useAppSelector } from "../../store/hooks";
import {
  Product,
  selectCategories,
  selectOEMs,
} from "../../store/productManagementSlice";

const { Option } = Select;

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Product, "id">) => void;
  editingProduct?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSubmit,
  editingProduct,
}) => {
  const [form] = Form.useForm();
  const categories = useAppSelector(selectCategories);
  const oems = useAppSelector(selectOEMs);

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        name: editingProduct.name,
        categoryId: editingProduct.categoryId,
        oemId: editingProduct.oemId,
        status: editingProduct.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
    }
  }, [editingProduct, form, open]);

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

  // Filter active categories and OEMs for dropdown
  const activeCategories = categories.filter((cat) => cat.status === "active");
  const activeOEMs = oems.filter((oem) => oem.status === "active");

  return (
    <Modal
      title={editingProduct ? "Edit Product" : "Add Product"}
      open={open}
      okText="Submit"
      onCancel={handleCancel}
      onOk={handleSave}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Select Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category">
            {activeCategories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Select OEM"
          name="oemId"
          rules={[{ required: true, message: "Please select an OEM" }]}
        >
          <Select placeholder="Select OEM">
            {activeOEMs.map((oem) => (
              <Option key={oem.id} value={oem.id}>
                {oem.name}
              </Option>
            ))}
          </Select>
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

export default ProductModal;

