import React, { useState } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddPermissionModal from "./AddPermissionModal";
import { useToast } from "../../../hooks/useToast";

// RTK Query
import {
  useGetPermissionsQuery,
  useDeletePermissionMutation,
} from "../../../store/api/permissionApi";

const PermissionsManagement: React.FC = () => {
  const toast = useToast();
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useGetPermissionsQuery(
    searchText ? { searchTerm: searchText } : undefined
  );
  const [deletePermissionApi] = useDeletePermissionMutation();

  const [openModal, setOpenModal] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState<any>();

  const handleDelete = async (id: string) => {
    try {
      await deletePermissionApi(id).unwrap();
      toast.success("Permission Deleted");
    } catch {
      toast.error("Delete Failed");
    }
  };

  const columns = [
    { title: "Permission Name", dataIndex: "permissionName" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
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
            onConfirm={() => handleDelete(record.permissionId)}
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
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.4rem", color: "#0e7490" }}>
              Permission Management
            </h2>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
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
