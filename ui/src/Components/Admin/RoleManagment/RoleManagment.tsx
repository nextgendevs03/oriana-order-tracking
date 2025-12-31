import React, { useState } from "react";
import { Table, Card, Input, Space, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AddRoleModal from "./AddRoleModal";
import ViewRoleModal from "./ViewRoleModal";
import {
  useGetAllRolesQuery,
  useDeleteRoleMutation,
} from "../../../store/api/roleApi";
import { useGetPermissionsQuery } from "../../../store/api/permissionApi";
import { RoleResponse } from "@OrianaTypes";

const RoleManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleResponse | null>(null);
  const [roleToView, setRoleToView] = useState<RoleResponse | null>(null);

  const { data, isLoading } = useGetAllRolesQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [deleteRole] = useDeleteRoleMutation();

  // Fetch all active permissions
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useGetPermissionsQuery({
      isActive: true,
      limit: 1000, // Fetch all permissions
    });

  const openAdd = () => {
    setRoleToEdit(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (role: RoleResponse) => {
    setRoleToEdit(role);
    setIsEditModalOpen(true);
  };

  const openView = (role: RoleResponse) => {
    setRoleToView(role);
    setIsViewModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setRoleToEdit(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setRoleToEdit(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setRoleToView(null);
  };

  const handleDelete = async (id: number) => {
    await deleteRole(id);
  };

  const filteredRoles = data?.data.filter((r) =>
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
      title: "Actions",
      render: (_: any, record: RoleResponse) => (
        <Space>
          <EyeOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => openView(record)}
            title="View"
          />
          <EditOutlined
            style={{ cursor: "pointer", color: "#52c41a" }}
            onClick={() => openEdit(record)}
            title="Edit"
          />
          {record.roleName !== "Super Admin" && (
            <Popconfirm
              title="Are you sure to delete this role?"
              onConfirm={() => handleDelete(record.roleId)}
            >
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                title="Delete"
              />
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
              <h2
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#92400e",
                }}
              >
                Role Management
              </h2>
              <p
                style={{
                  margin: "0.2rem 0 0 0",
                  fontSize: "0.85rem",
                  color: "#a16207",
                }}
              >
                Define roles and assign permissions
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAdd}
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 40,
              padding: "0 20px",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.25)",
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
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.pagination?.total || 0,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} roles`,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
        />
        <AddRoleModal
          open={isAddModalOpen}
          onClose={closeAddModal}
          roleToEdit={null}
          permissions={permissionsData?.data || []}
          isLoadingPermissions={isLoadingPermissions}
        />
        <AddRoleModal
          open={isEditModalOpen}
          onClose={closeEditModal}
          roleToEdit={roleToEdit}
          permissions={permissionsData?.data || []}
          isLoadingPermissions={isLoadingPermissions}
        />
        <ViewRoleModal
          open={isViewModalOpen}
          onClose={closeViewModal}
          role={roleToView}
        />
      </Card>
    </div>
  );
};

export default RoleManagement;
