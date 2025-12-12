import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../store/api/productApi";

import AddProductModal from "./AddProductModal";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const ProductManagementProducts: React.FC = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const columns = [
    { title: "Product Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "OEM", dataIndex: "oem" },

    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) =>
        text === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },

    {
      title: "Actions",
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setIsModalOpen(true);
            }}
          />

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
        columns={columns}
        dataSource={products}
        rowKey="productId"
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
