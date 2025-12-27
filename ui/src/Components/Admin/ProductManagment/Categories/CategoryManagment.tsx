import React, { useState, useEffect } from "react";
import { Button, Table, Popconfirm, message, Input, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../../store/api/categoryApi";
import type { CategoryResponse } from "@OrianaTypes";
import AddCategoryModal from "./AddCategoryModal";
import { useDebounce } from "../../../../hooks";

const { Search } = Input;

const CategoryManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: categoriesResponse,
    isLoading,
    refetch,
  } = useGetCategoriesQuery({
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "DESC",
    searchTerm: debouncedSearchTerm || undefined,
  });
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingStatus }] =
    useUpdateCategoryMutation();

  const categories = categoriesResponse?.data || [];

  const handleEdit = (record: CategoryResponse) => {
    setEditingCategory(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      message.success("Category deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete category");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    refetch();
  };

  const columns: ColumnsType<CategoryResponse> = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: unknown, record: CategoryResponse) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.isActive}
          loading={isUpdatingStatus}
          onChange={async (checked) => {
            try {
              await updateCategory({
                id: record.categoryId,
                data: {
                  isActive: checked,
                  updatedBy: "admin", // TODO: Get from auth context
                },
              }).unwrap();
              message.success(
                `Category status updated to ${checked ? "Active" : "Inactive"}`
              );
              refetch();
            } catch (error: any) {
              message.error(
                error?.data?.message || "Failed to update category status"
              );
            }
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: CategoryResponse) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this category?"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.categoryId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
              <h2
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  color: "#1e40af",
                }}
              >
                Category Management
              </h2>
              <p
                style={{
                  margin: "0.15rem 0 0 0",
                  fontSize: "0.85rem",
                  color: "#64748b",
                }}
              >
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
            style={{
              background: "#3b82f6",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 40,
              padding: "0 20px",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
              transition: "all 0.3s ease",
            }}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <Search
          placeholder="Search categories by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, borderRadius: 8 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="categoryId"
        loading={isLoading}
        style={{ marginTop: 20 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: categoriesResponse?.pagination?.total || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} categories`,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <AddCategoryModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        initialValues={editingCategory ?? undefined}
      />
    </div>
  );
};

export default CategoryManagement;
