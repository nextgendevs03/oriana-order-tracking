import React, { useState } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddPermissionModal from "./AddPermissionModal";

const { Title } = Typography;

interface PermissionType {
  key: number;
  name: string;
  code: string;
  module: string;
  description: string;
  roles: string[];
}

const PermissionsManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionType[]>([
    {
      key: 1,
      name: "View Users",
      code: "user.view",
      module: "users",
      description: "Can view user list and details",
      roles: ["Super Admin", "Manager"],
    },
    {
      key: 2,
      name: "Create Users",
      code: "user.create",
      module: "users",
      description: "Can create new users",
      roles: ["Super Admin"],
    },
    {
      key: 3,
      name: "Edit Users",
      code: "user.edit",
      module: "users",
      description: "Can edit existing users",
      roles: ["Super Admin", "Manager"],
    },
    {
      key: 4,
      name: "Delete Users",
      code: "user.delete",
      module: "users",
      description: "Can delete users",
      roles: ["Super Admin"],
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [filterModule, setFilterModule] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [permissionToEdit, setPermissionToEdit] =
    useState<PermissionType | undefined>(undefined);

  const handleAddOrEdit = (values: any) => {
    if (permissionToEdit) {
      setPermissions((prev) =>
        prev.map((p) => (p.key === permissionToEdit.key ? { ...p, ...values } : p))
      );
    } else {
      const newPermission: PermissionType = {
        key: permissions.length + 1,
        roles: [], // FIX — prevent undefined.map crash
        ...values,
      };
      setPermissions([...permissions, newPermission]);
    }

    setOpenModal(false);
    setPermissionToEdit(undefined);
  };

  const handleDelete = (perm: PermissionType) => {
    setPermissions((prev) => prev.filter((p) => p.key !== perm.key));
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!filterModule || p.module === filterModule)
  );

  const columns = [
    {
      title: "Permission Name",
      dataIndex: "name",
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: "Code",
      dataIndex: "code",
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Module",
      dataIndex: "module",
      render: (m: string) => <Tag color="cyan">{m}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Used by Roles",
      dataIndex: "roles",
      render: (roles: string[]) =>
        (roles || []).map((r) => (
          <Tag color="geekblue" key={r}>
            {r}
          </Tag>
        )),
    },
    {
      title: "Actions",
      render: (_: any, record: PermissionType) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setPermissionToEdit(record);
              setOpenModal(true);
            }}
          />
          <Popconfirm title="Confirm delete?" onConfirm={() => handleDelete(record)}>
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        Permission Management
      </Title>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Space size="middle">
          <Input
            placeholder="Search permissions..."
            style={{ width: 260, height: 40 }}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Select
            placeholder="Filter by module"
            style={{ width: 180 }}
            allowClear
            onChange={(value) => setFilterModule(value)}
            options={[
              { label: "users", value: "users" },
              { label: "roles", value: "roles" },
              { label: "permissions", value: "permissions" },
            ]}
          />
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ height: 40 }}
          onClick={() => {
            setPermissionToEdit(undefined);
            setOpenModal(true);
          }}
        >
          Add Permission
        </Button>
      </div>

      <Table
        columns={columns as any}
        dataSource={filteredPermissions}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />

      <AddPermissionModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setPermissionToEdit(undefined);
        }}
        onSubmit={handleAddOrEdit}
        permissionToEdit={permissionToEdit}
      />
    </div>
  );
};

export default PermissionsManagement;
