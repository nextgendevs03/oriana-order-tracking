import React, { useState } from "react";
import { Table, Input, Button, Select, Tag, Switch, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserMnagmentModal from "./UserMnagmentModal";
import { useAppSelector } from "../../store/hook";
import { selectUsers } from "../../store/userSlice";

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const users = useAppSelector(selectUsers);

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <strong>{record.name}</strong> <br />
          <span style={{ color: "gray", fontSize: "12px" }}>
            {record.email}
          </span>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          color={
            role === "Super Admin"
              ? "gold"
              : role === "Manager"
                ? "blue"
                : "cyan"
          }
        >
          {role}
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
          //   onChange={() => {
          //     setUsers((prev) =>
          //       prev.map((u) =>
          //         u.key === record.key ? { ...u, status: !u.status } : u
          //       )
          //     );
          //   }}
        />
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space size="middle">
          <EditOutlined style={{ cursor: "pointer" }} />
          <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Title + Add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>User Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenModal(true)}
        >
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <Search
          placeholder="Search by name or email..."
          style={{ width: 250 }}
        />

        <Select placeholder="Filter by role" style={{ width: 160 }}>
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
        dataSource={users}
        pagination={{ pageSize: 5 }}
        footer={() => `Total ${users.length} users`}
      />

      {/* Popup modal */}
      <UserMnagmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
};

export default UserManagement;
