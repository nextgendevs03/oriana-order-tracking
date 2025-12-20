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
import { useAppDispatch } from "../../store/hooks";
import { updateUserStatus } from "../../store/userSlice";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api/userApi";
import { UserResponse } from "@OrianaTypes";

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const [editingUser, setEditingUser] = useState<
    (UserResponse & { id?: string }) | null
  >(null);
  const [openModal, setOpenModal] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const { data, isLoading: isGettingUsers, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  // const users = useAppSelector(selectUsers);

  const handleEdit = (record: UserResponse & { id?: string }) => {
    setEditingUser(record);
    setOpenModal(true);
  };

  const handleDelete = async (record: UserResponse & { id?: string }) => {
    try {
      // Use userId instead of username (backend expects userId)
      const userIdForDelete = record.userId || record.id;

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
        <Tag
          color={
            role === "Super Admin"
              ? "gold"
              : role === "Manager"
                ? "blue"
                : "cyan"
          }
        >
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.status === "Active"}
          onChange={() =>
            dispatch(
              updateUserStatus({
                id: record.id,
                status: record.status === "Active" ? false : true,
              })
            )
          }
        />
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin: string) => (lastLogin ? lastLogin : "-"),
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      render: (created: string) => (created ? created : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: UserResponse & { id?: string }) => (
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
            backgroundImage: "radial-gradient(circle, #fda4af 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
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
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.4rem", color: "#be123c" }}>
              User Management
            </h2>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
              Manage user accounts and access controls
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{
            background: isButtonHovered ? "#be123c" : "#e11d48",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            height: 40,
            padding: "0 20px",
            position: "relative",
            zIndex: 1,
            boxShadow: isButtonHovered
              ? "0 6px 20px rgba(225, 29, 72, 0.4)"
              : "0 2px 8px rgba(225, 29, 72, 0.25)",
            transform: isButtonHovered ? "translateY(-2px)" : "translateY(0)",
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
        dataSource={data?.items}
        loading={isGettingUsers}
        rowKey={(record) => record.userId || record.username || 'key'}
        pagination={{ pageSize: 5 }}
        footer={() => `Total ${data?.items?.length || 0} users`}
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
