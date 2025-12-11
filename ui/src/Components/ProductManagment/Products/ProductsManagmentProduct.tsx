import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddProductModal from "./AddProductModal";

interface Product {
  key: number;
  name: string;
  category: string;
  oem: string;
  status: "Active" | "Inactive";
}

const ProductManagementProducts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const columns = [
    { title: "Product Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "OEM", dataIndex: "oem" },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_: any, record: Product) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = (key: number) => {
    setProducts(products.filter((product) => product.key !== key));
  };

  const handleSuccess = (formData: Omit<Product, "key">) => {
    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.key === editingProduct.key
            ? { ...product, ...formData }
            : product
        )
      );
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...formData, key: Date.now() }]);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
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
        locale={{ emptyText: "No Data" }}
        style={{ marginTop: 20 }}
      />

      {/* Add/Edit Modal */}
      <AddProductModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={handleSuccess}
        initialValues={editingProduct || undefined}
      />
    </div>
  );
};

export default ProductManagementProducts;
