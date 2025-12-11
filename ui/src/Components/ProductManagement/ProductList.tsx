import React, { useState } from "react";
import { Table, Button, Tag, Space, Breadcrumb, message } from "antd";
import { PlusOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectProducts,
  selectCategories,
  selectOEMs,
  addProduct,
  updateProduct,
  Product,
} from "../../store/productManagementSlice";
import ProductModal from "./ProductModal";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const oems = useAppSelector(selectOEMs);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = (values: Omit<Product, "id">) => {
    if (editingProduct) {
      dispatch(
        updateProduct({
          ...values,
          id: editingProduct.id,
        })
      );
      message.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        ...values,
        id: `PROD-${Date.now()}`,
      };
      dispatch(addProduct(newProduct));
      message.success("Product added successfully");
    }
    handleCloseModal();
  };

  // Helper to get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "-";
  };

  // Helper to get OEM name by id
  const getOEMName = (oemId: string) => {
    const oem = oems.find((o) => o.id === oemId);
    return oem?.name || "-";
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: string) => getCategoryName(categoryId),
    },
    {
      title: "OEM",
      dataIndex: "oemId",
      key: "oemId",
      render: (oemId: string) => getOEMName(oemId),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ padding: 0 }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <Link to="/dashboard">
                <HomeOutlined /> Home
              </Link>
            ),
          },
          {
            title: <Link to="/product-management">Product Management</Link>,
          },
          {
            title: "Products",
          },
        ]}
      />

      {/* Title + Add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>Product Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        footer={() => `Total ${products.length} products`}
      />

      {/* Modal */}
      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default ProductList;

