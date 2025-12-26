import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../store/api/categoryApi";
import type { CategoryResponse } from "@OrianaTypes";
import AddCategoryModal from "./AddCategoryModal";

const CategoryManagement: React.FC = () => {
  const { data: categoriesResponse, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  
  const categories = categoriesResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleEdit = (record: CategoryResponse) => {
    setEditingCategory(record);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<CategoryResponse> = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (_: unknown, record: CategoryResponse) =>
        record.isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_: unknown, record: CategoryResponse) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteCategory(record.categoryId)}
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
        <Breadcrumb.Item>Category Management</Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header - Bottom Accent Bar Style */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(37, 99, 235, 0.1)",
          borderBottom: "4px solid #3b82f6",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 24 }}>📂</span>
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.35rem", color: "#1e40af" }}>
                Category Management
              </h2>
              <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                Organize and manage product categories
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              background: isButtonHovered ? "#2563eb" : "#3b82f6",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 40,
              padding: "0 20px",
              boxShadow: isButtonHovered
                ? "0 6px 20px rgba(59, 130, 246, 0.45)"
                : "0 2px 8px rgba(59, 130, 246, 0.25)",
              transform: isButtonHovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.3s ease",
            }}
          >
            Add Category
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="categoryId"
        loading={isLoading}
      />

      <AddCategoryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialValues={editingCategory ?? undefined}
      />
    </div>
  );
};

export default CategoryManagement;
