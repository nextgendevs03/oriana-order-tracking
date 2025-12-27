import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Tag,
  Switch,
  Space,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserManagmentModal from "./UserManagmentModal";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../../store/api/userApi";
import { UserResponse } from "@OrianaTypes";

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  const {
    data,
    isLoading: isGettingUsers,
    refetch,
  } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdatingStatus }] = useUpdateUserMutation();

  const handleEdit = (record: UserResponse) => {
    setEditingUser(record);
    setOpenModal(true);
  };

  const handleDelete = async (record: UserResponse) => {
    try {
      const userIdForDelete = record.userId;

      if (!userIdForDelete) {
        message.error("User ID not found. Cannot delete user.");
        return;
      }

      await deleteUser(userIdForDelete).unwrap();

      message.success("User deleted successfully");
      refetch(); // Refresh the user list after deletion
    } catch (error: any) {
      console.error("Delete failed:", error);
      const errorMessage =
        error?.data?.error?.message ||
        error?.message ||
        "Failed to delete user. Please try again.";
      message.error(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setOpenModal(true);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string, record: UserResponse) => (
        <div>
          <strong>{record.username}</strong> <br />
          <span style={{ color: "gray", fontSize: "12px" }}>
            {record.username}
          </span>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string, record: UserResponse) => (
        <Tag color={"cyan"}>{record.role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: UserResponse) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.isActive}
          loading={isUpdatingStatus}
          onChange={async (checked) => {
            try {
              if (!record.userId) {
                message.error("User ID not found. Cannot update status.");
                return;
              }

              await updateUser({
                userId: record.userId,
                data: {
                  isActive: checked,
                  updatedBy: "system",
                },
              }).unwrap();

              message.success(
                `User status updated to ${checked ? "Active" : "Inactive"}`
              );
              refetch(); // Refresh the user list after status update
            } catch (error: any) {
              console.error("Status update failed:", error);
              const errorMessage =
                error?.data?.error?.message ||
                error?.message ||
                "Failed to update user status. Please try again.";
              message.error(errorMessage);
            }
          }}
        />
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string | Date) => {
        if (!createdAt) return "-";
        try {
          const date =
            typeof createdAt === "string" ? new Date(createdAt) : createdAt;
          return date.toLocaleString();
        } catch {
          return createdAt.toString();
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: UserResponse) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ padding: 0 }}
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
              loading={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      {/* Page Header - Outlined Border Style with Dots Pattern */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "#fff",
          borderRadius: 12,
          border: "2px solid #e11d48",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot pattern background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 150,
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, #fda4af 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff0f3",
              border: "2px solid #e11d48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 22 }}>👥</span>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#be123c",
              }}
            >
              User Management
            </h2>
            <p
              style={{
                margin: "0.2rem 0 0 0",
                fontSize: "0.85rem",
                color: "#6b7280",
              }}
            >
              Manage user accounts and access controls
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          style={{
            background: "#e11d48",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            height: 40,
            padding: "0 20px",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 2px 8px rgba(225, 29, 72, 0.25)",
            transition: "all 0.3s ease",
          }}
        >
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <Search
          placeholder="Search by name or email..."
          style={{ width: 280, borderRadius: 8 }}
        />
        <Select placeholder="Filter by role" style={{ width: 180 }}>
          <Option value="Super Admin">Super Admin</Option>
          <Option value="Manager">Manager</Option>
          <Option value="Viewer">Viewer</Option>
        </Select>
        <Select placeholder="Filter by status" style={{ width: 160 }}>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isGettingUsers}
        rowKey={(record) => record.userId || record.username || "key"}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.pagination?.total || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />

      {/* Popup modal */}
      <UserManagmentModal
        open={openModal}
        onClose={handleCloseModal}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;
