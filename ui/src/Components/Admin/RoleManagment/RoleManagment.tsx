import React, { useState } from "react";
import { Table, Tag, Card, Input, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, LockOutlined } from "@ant-design/icons";
import AddRoleModal from "./AddRoleModal";

interface RoleType {
  key: number;
  roleName: string;
  description: string;
  permissions: number;
  users: number;
  locked?: boolean;
}

const RoleManagement: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleToEdit, setRoleToEdit] = useState<RoleType | undefined>(undefined);

  const [roles, setRoles] = useState<RoleType[]>([
    {
      key: 1,
      roleName: "Super Admin",
      description: "Full system access with all permissions",
      permissions: 19,
      users: 1,
      locked: true,
    },
    {
      key: 2,
      roleName: "Manager",
      description: "Can manage orders and view reports, limited user management",
      permissions: 11,
      users: 1,
      locked: true,
    },
    {
      key: 3,
      roleName: "Viewer",
      description: "Read-only access to orders and reports",
      permissions: 2,
      users: 2,
    },
    {
      key: 4,
      roleName: "Sales Person",
      description: "Sales Person",
      permissions: 3,
      users: 1,
    },
  ]);

  // Add or Update role
  const handleAddOrEditRole = (values: any) => {
    if (roleToEdit) {
      // Update existing role
      setRoles((prev) =>
        prev.map((r) =>
          r.key === roleToEdit.key
            ? { ...r, ...values }
            : r
        )
      );
    } else {
      // Add new role
      const newRole: RoleType = {
        key: roles.length + 1,
        roleName: values.roleName,
        description: values.description,
        permissions: values.permissions,
        users: 0,
      };
      setRoles([...roles, newRole]);
    }

    setOpenModal(false);
    setRoleToEdit(undefined);
  };

  // Delete role
  const handleDeleteRole = (role: RoleType) => {
    setRoles((prev) => prev.filter((r) => r.key !== role.key));
  };

  // Filter roles based on search
  const filteredRoles = roles.filter((r) =>
    r.roleName.toLowerCase().includes(searchText.toLowerCase())
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
          {val} {val > 1 ? "users" : "user"}
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
      />

      <Table
        columns={columns}
        dataSource={filteredRoles}
        pagination={{ pageSize: 10 }}
      />

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
