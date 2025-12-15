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
    <div style={{ padding: 24 }}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Product Management</Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Product Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
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
