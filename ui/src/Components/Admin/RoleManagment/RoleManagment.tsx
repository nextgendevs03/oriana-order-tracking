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
    <Card
      title="Role Management"
      bordered={false}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
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
        rowKey="roleId"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
      <AddRoleModal />
    </Card>
  );
};

export default RoleManagement;
