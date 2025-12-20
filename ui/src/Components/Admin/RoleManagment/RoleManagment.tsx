import React, { useState } from "react";
import { Table, Card, Input, Space, Button, Popconfirm, Tag } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../../store/hooks";
import { openModal, openModalForEdit } from "../../../store/roleSlice";
import AddRoleModal from "./AddRoleModal";
import {
  useGetAllRolesQuery,
  useDeleteRoleMutation
} from "../../../store/api/roleApi";
import { RoleResponse } from "@OrianaTypes";

const RoleManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetAllRolesQuery({ page: 1, limit: 20 });
  const [deleteRole] = useDeleteRoleMutation();
  const [searchText, setSearchText] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const openAdd = () => dispatch(openModal());
  const openEdit = (role: RoleResponse) => {
    dispatch(openModalForEdit(role));
  };

  const handleDelete = async (id: string) => {
    await deleteRole(id);
  };

  const filteredRoles = data?.items.filter((r) =>
    r.roleName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Role Name",
      dataIndex: "roleName",
      render: (text: string, record: RoleResponse) => (
        <Space>
          {text}
          {record.roleName === "Super Admin" && (
            <LockOutlined style={{ color: "orange" }} />
          )}
        </Space>
      ),
    },
    { title: "Description", dataIndex: "description" },
    {
      title: "Permissions",
      dataIndex: "permissions",
      render: (_: any, record: RoleResponse) => (
        <Tag color="blue">{record.permissions?.length || 0}</Tag>
      ),
    },
    {
      title: "Users",
      dataIndex: "users",
      render: (_: any, record: RoleResponse) => (
        <Tag color="green">{record.users?.length || 0}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: RoleResponse) => (
        <Space>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => openEdit(record)}
          />
          {record.roleName !== "Super Admin" && (
            <Popconfirm
              title="Are you sure to delete this role?"
              onConfirm={() => handleDelete(record.roleId)}
            >
              <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      {/* Page Header - Floating Card with Gradient Border */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: 3,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24, #fcd34d)",
          borderRadius: 14,
          boxShadow: "0 8px 24px rgba(245, 158, 11, 0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            background: "#fffbeb",
            borderRadius: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              }}
            >
              <LockOutlined style={{ fontSize: 24, color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.4rem", color: "#92400e" }}>
                Role Management
              </h2>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "#a16207" }}>
                Define roles and assign permissions
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAdd}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              background: isButtonHovered
                ? "linear-gradient(135deg, #d97706, #b45309)"
                : "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 40,
              padding: "0 20px",
              boxShadow: isButtonHovered
                ? "0 6px 20px rgba(245, 158, 11, 0.45)"
                : "0 2px 8px rgba(245, 158, 11, 0.25)",
              transform: isButtonHovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.3s ease",
            }}
          >
            Add Role
          </Button>
        </div>
      </div>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Input.Search
          placeholder="Search roles..."
          style={{ width: 280, marginBottom: 16, borderRadius: 8 }}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
      <Table
        columns={columns}
        dataSource={filteredRoles}
        rowKey="roleId"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
        <AddRoleModal />
      </Card>
    </div>
  );
};

export default RoleManagement;
