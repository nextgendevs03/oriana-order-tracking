import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../store/api/productApi";
import type { ProductResponse } from "@OrianaTypes";
import AddProductModal from "./AddProductModal";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const ProductManagementProducts: React.FC = () => {
  const { data, isLoading } = useGetProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  interface EditingProduct {
    productId: string;
    productName: string;
    category?: { categoryId: string };
    oem?: { oemId: string };
    isActive: boolean;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleEdit = (record: ProductResponse) => {
    setEditingProduct({
      productId: record.productId,
      productName: record.productName,
      category: record.category
        ? { categoryId: record.category.categoryId }
        : undefined,
      oem: record.oem ? { oemId: record.oem.oemId } : undefined,
      isActive: record.isActive,
    });
    setIsModalOpen(true);
  };

  const columns: ColumnsType<ProductResponse> = [
    {
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      render: (_: string, record: ProductResponse) =>
        record.category?.categoryName,
    },
    {
      title: "OEM",
      dataIndex: "oemName",
      render: (_: string, record: ProductResponse) => record.oem?.oemName,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (_: unknown, record: ProductResponse) =>
        record.isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_: unknown, record: ProductResponse) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => deleteProduct(record.productId)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <Breadcrumb style={{ marginBottom: "1rem" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Product Management</Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header - Dark Elegant Style with Glow */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "1.5rem 2rem",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: 100,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192, 132, 252, 0.3), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 26 }}>📦</span>
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.4rem", color: "#fff" }}>
              Products Catalog
            </h2>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)" }}>
              Manage your complete product inventory
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{
            background: isButtonHovered
              ? "linear-gradient(135deg, #9333ea, #a855f7)"
              : "linear-gradient(135deg, #a855f7, #c084fc)",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            height: 42,
            padding: "0 24px",
            boxShadow: isButtonHovered
              ? "0 8px 24px rgba(168, 85, 247, 0.55)"
              : "0 4px 16px rgba(168, 85, 247, 0.4)",
            transform: isButtonHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        rowKey="productId"
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading}
        style={{ marginTop: 20 }}
      />

      <AddProductModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialValues={editingProduct || undefined}
      />
    </div>
  );
};

export default ProductManagementProducts;
