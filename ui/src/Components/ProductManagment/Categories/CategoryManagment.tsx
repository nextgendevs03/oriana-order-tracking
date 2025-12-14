import { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../store/api/categoryApi";
import AddCategoryModal from "./AddCategoryModal";

const CategoryManagement = () => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { title: "Category Name", dataIndex: "categoryName" },

    {
      title: "Status",
      dataIndex: "isActive",
      render: (val: boolean) =>
        val === true ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },

    {
      title: "Actions",
      render: (_: unknown, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
              setIsModalOpen(true);
            }}
          />

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
