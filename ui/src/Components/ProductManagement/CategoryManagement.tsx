import React, { useState } from "react";
import { Table, Button, Tag, Space, Breadcrumb, message } from "antd";
import { PlusOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectCategories,
  addCategory,
  updateCategory,
  Category,
} from "../../store/productManagementSlice";
import CategoryModal from "./CategoryModal";

const CategoryManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setOpenModal(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = (values: Omit<Category, "id">) => {
    if (editingCategory) {
      dispatch(
        updateCategory({
          ...values,
          id: editingCategory.id,
        })
      );
      message.success("Category updated successfully");
    } else {
      const newCategory: Category = {
        ...values,
        id: `CAT-${Date.now()}`,
      };
      dispatch(addCategory(newCategory));
      message.success("Category added successfully");
    }
    handleCloseModal();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
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
      render: (_: any, record: Category) => (
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
            title: "Category Management",
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
        <h2 style={{ margin: 0 }}>Category Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        footer={() => `Total ${categories.length} categories`}
      />

      {/* Modal */}
      <CategoryModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;

