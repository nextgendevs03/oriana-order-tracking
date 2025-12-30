import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddPermissionModal from "./AddPermissionModal";
import { useToast } from "../../../hooks/useToast";
import { useDebounce } from "../../../hooks/useDebounce";

// RTK Query
import {
  useGetPermissionsQuery,
  useDeletePermissionMutation,
} from "../../../store/api/permissionApi";
import { PermissionResponse } from "@OrianaTypes";

const PermissionsManagement: React.FC = () => {
  const toast = useToast();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search text
  const debouncedSearchText = useDebounce(searchText, 500);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText]);

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(debouncedSearchText && {
      searchKey: "permissionName",
      searchTerm: debouncedSearchText,
    }),
  };

  const { data, isLoading } = useGetPermissionsQuery(queryParams);
  const [deletePermissionApi] = useDeletePermissionMutation();

  const [openModal, setOpenModal] = useState(false);
  const [permissionToEdit, setPermissionToEdit] =
    useState<PermissionResponse>();

  const handleDelete = async (id: number) => {
    try {
      await deletePermissionApi(String(id)).unwrap();
      toast.success("Permission Deleted");
    } catch {
      toast.error("Delete Failed");
    }
  };

  const columns = [
    { title: "Permission Name", dataIndex: "permissionName" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Actions",
      render: (_: unknown, record: PermissionResponse) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setPermissionToEdit(record);
              setOpenModal(true);
            }}
          />

          <Popconfirm
            title="Confirm?"
            onConfirm={() => {
              if (typeof record.permissionId === "number") {
                handleDelete(record.permissionId);
              } else {
                handleDelete(Number(record.permissionId));
              }
            }}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      {/* Page Header - Two-Tone Split Design */}
      <div
        style={{
          display: "flex",
          marginBottom: "1.5rem",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(8, 145, 178, 0.15)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, #0891b2, #06b6d4)",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 28 }}>🔐</span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(90deg, #ecfeff, #fff)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#0e7490",
              }}
            >
              Permission Management
            </h2>
            <p
              style={{
                margin: "0.2rem 0 0 0",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              Configure and manage system permissions
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setPermissionToEdit(undefined);
              setOpenModal(true);
            }}
            style={{
              background: "linear-gradient(135deg, #0891b2, #06b6d4)",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 40,
              padding: "0 20px",
              boxShadow: "0 2px 8px rgba(8, 145, 178, 0.25)",
              transition: "all 0.3s ease",
            }}
          >
            Add Permission
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <Input
          placeholder="Search permissions..."
          style={{ width: 280, borderRadius: 8 }}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data}
        rowKey="permissionId"
        style={{ marginTop: 20 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.pagination?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          onShowSizeChange: (current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          },
        }}
      />

      <AddPermissionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        permissionToEdit={permissionToEdit}
      />
    </div>
  );
};

export default PermissionsManagement;
