import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddCategoryModal from "./AddCategoryModal";

interface Category {
  key: string;
  name: string;
  status: "Active" | "Inactive";
}

const CategoryManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const columns = [
    { title: "Name", dataIndex: "name" },
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
      render: (_: any, record: Category) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
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

  const handleDelete = (key: string) => {
    setCategories(categories.filter((category) => category.key !== key));
  };

  const handleSuccess = (newCategory: Omit<Category, "key">) => {
    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category.key === editingCategory.key
            ? { ...category, ...newCategory }
            : category
        )
      );
      setEditingCategory(null);
    } else {
      setCategories([
        ...categories,
        { ...newCategory, key: Date.now().toString() },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Product Management</Breadcrumb.Item>
        <Breadcrumb.Item>Category Management</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Category Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        locale={{ emptyText: "No Data" }}
        style={{ marginTop: 20 }}
      />

      {/* Modal */}
      <AddCategoryModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={handleSuccess}
        initialValues={editingCategory || undefined}
      />
    </div>
  );
};

export default CategoryManagement;
