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
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

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
    <div style={{ padding: 24 }}>
      <Breadcrumb>
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
