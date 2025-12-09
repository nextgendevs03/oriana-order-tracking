import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Card,
  Input,
  Space,
  Button,
  Popconfirm,
  message,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
} from "@ant-design/icons";
import AddRoleModal from "./AddRoleModal";
import {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  RoleResponse,
  RoleType,
} from "../../../store/api/roleApi";

const RoleManagement: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleToEdit, setRoleToEdit] = useState<RoleType | undefined>(undefined);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // RTK Query hooks
  const {
    data: rolesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllRolesQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const loading = isLoading || isCreating || isUpdating || isDeleting;

  // Map backend RoleResponse to frontend RoleType
  const mapRoleToFrontend = (
    role: RoleResponse,
    permissionsCount: number = 0,
    usersCount: number = 0
  ): RoleType => {
    // Determine if role should be locked (Super Admin, Admin, Manager, or inactive roles)
    const lockedRoles = ["Super Admin", "Admin", "Manager"];
    const isLocked = lockedRoles.includes(role.roleName) || !role.isActive;

    return {
      key: role.roleId,
      roleId: role.roleId,
      roleName: role.roleName,
      description: role.description || "",
      permissions: permissionsCount,
      users: usersCount,
      locked: isLocked,
      isActive: role.isActive,
    };
  };

  // Transform roles data for display
  const roles = useMemo(() => {
    if (!rolesData?.items) return [];
    return rolesData.items.map((role) => {
      // Count permissions if they exist in the role data
      // For now, we'll set to 0 as the backend doesn't return permission count
      // You can enhance this by calling a separate API to get permission count
      const permissionsCount = Array.isArray((role as any).permissions)
        ? (role as any).permissions.length
        : 0;

      // Users count - set to 0 for now, can be fetched from user API if available
      const usersCount = (role as any).users || 0;

      return mapRoleToFrontend(role, permissionsCount, usersCount);
    });
  }, [rolesData]);

  // Handle errors
  React.useEffect(() => {
    if (isError) {
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.data?.error?.message ||
        (error as any)?.message ||
        "Failed to fetch roles";
      message.error(errorMessage);
    }
  }, [isError, error]);

  // Add or Update role
  const handleAddOrEditRole = async (values: any) => {
    try {
      if (roleToEdit) {
        // Update existing role
        const updateData: any = {
          roleName: values.roleName,
          description: values.description || "",
          isActive:
            values.isActive !== undefined
              ? values.isActive
              : roleToEdit.isActive,
        };

        await updateRole({
          id: roleToEdit.roleId,
          data: updateData,
        }).unwrap();
        message.success("Role updated successfully");
      } else {
        // Add new role
        const createData: any = {
          roleName: values.roleName,
          description: values.description || "",
          isActive: values.isActive !== undefined ? values.isActive : true,
        };

        await createRole(createData).unwrap();
        message.success("Role created successfully");
      }

      // RTK Query will automatically refetch due to invalidatesTags
      setOpenModal(false);
      setRoleToEdit(undefined);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to save role";
      message.error(errorMessage);
      console.error("Error saving role:", error);
    }
  };

  // Delete role
  const handleDeleteRole = async (role: RoleType) => {
    try {
      await deleteRole(role.roleId).unwrap();
      message.success("Role deleted successfully");
      // RTK Query will automatically refetch due to invalidatesTags
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete role";
      message.error(errorMessage);
      console.error("Error deleting role:", error);
    }
  };

  // Handle table pagination change
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(
    (r) =>
      r.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
      (r.description &&
        r.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: "Role Name",
      dataIndex: "roleName",
      render: (text: string, record: RoleType) => (
        <Space>
          {text}
          {record.locked && <LockOutlined style={{ color: "orange" }} />}
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      render: (val: number) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: "Users",
      dataIndex: "users",
      render: (val: number) => (
        <Tag color="green">
          {val} {val !== 1 ? "users" : "user"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: RoleType) => (
        <Space>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setRoleToEdit(record);
              setOpenModal(true);
            }}
          />
          {!record.locked && (
            <Popconfirm
              title="Are you sure to delete this role?"
              onConfirm={() => handleDeleteRole(record)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Role Management"
      bordered={false}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setRoleToEdit(undefined);
            setOpenModal(true);
          }}
          disabled={loading}
        >
          Add Role
        </Button>
      }
    >
      <Input.Search
        placeholder="Search roles..."
        style={{ width: 250, marginBottom: 16 }}
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        disabled={loading}
      />

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredRoles}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: rolesData?.pagination?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} roles`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          rowKey="key"
        />
      </Spin>

      <AddRoleModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setRoleToEdit(undefined);
        }}
        onSubmit={handleAddOrEditRole}
        roleToEdit={roleToEdit}
      />
    </Card>
  );
};

export default RoleManagement;
