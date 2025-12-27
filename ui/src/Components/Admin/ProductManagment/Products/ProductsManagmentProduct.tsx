import React, { useState, useEffect } from "react";
import { Button, Table, Tag, Popconfirm, message, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../../store/api/productApi";
import type { ProductResponse } from "@OrianaTypes";
import AddProductModal from "./AddProductModal";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDebounce } from "../../../../hooks";

const { Search } = Input;
const { Option } = Select;

const ProductManagementProducts: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchKey, setSearchKey] = useState<string>("productName");
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);
  
  const {
    data,
    isLoading,
    refetch,
  } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "DESC",
    searchTerm: debouncedSearchTerm || undefined,
    searchKey: debouncedSearchTerm ? searchKey : undefined,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

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

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Product deleted successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete product");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    refetch();
  };

  const columns: ColumnsType<ProductResponse> = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (_: string, record: ProductResponse) =>
        record.category?.categoryName || "-",
    },
    {
      title: "OEM",
      dataIndex: "oemName",
      key: "oemName",
      render: (_: string, record: ProductResponse) => record.oem?.oemName || "-",
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
      key: "actions",
      render: (_: unknown, record: ProductResponse) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this product?"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.productId)}
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
          style={{
            background: "linear-gradient(135deg, #a855f7, #c084fc)",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            height: 42,
            padding: "0 24px",
            boxShadow: "0 4px 16px rgba(168, 85, 247, 0.4)",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <Select
          value={searchKey}
          onChange={setSearchKey}
          style={{ width: 180, borderRadius: 8 }}
        >
          <Option value="productName">Product Name</Option>
          <Option value="categoryName">Category Name</Option>
          <Option value="oemName">OEM Name</Option>
        </Select>
        <Search
          placeholder={`Search by ${searchKey === "productName" ? "product name" : searchKey === "categoryName" ? "category name" : "OEM name"}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, borderRadius: 8 }}
          allowClear
        />
      </div>

      <Table
        rowKey="productId"
        columns={columns}
        dataSource={data?.data || []}
        loading={isLoading}
        style={{ marginTop: 20 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.pagination?.total || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} products`,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <AddProductModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        initialValues={editingProduct || undefined}
      />
    </div>
  );
};

export default ProductManagementProducts;
