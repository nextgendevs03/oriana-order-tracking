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
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddPermissionModal from "./AddPermissionModal";

// RTK Query
import {
  useGetPermissionsQuery,
  useDeletePermissionMutation,
} from "../../../store/api/permissionApi";

const { Title } = Typography;

const PermissionsManagement: React.FC = () => {
  const { data, isLoading } = useGetPermissionsQuery();
  const [deletePermissionApi] = useDeletePermissionMutation();

  const [searchText, setSearchText] = useState("");
  const [filterModule, setFilterModule] = useState<string>();
  const [openModal, setOpenModal] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState<any>();

  const handleDelete = async (id: string) => {
    try {
      await deletePermissionApi(id).unwrap();
      message.success("Permission Deleted");
    } catch {
      message.error("Delete Failed");
    }
  };

  const columns = [
    { title: "Permission Name", dataIndex: "permissionName" },
    {
      title: "Code",
      dataIndex: "permissionCode",
      render: (c: string) => <Tag color="blue">{c}</Tag>,
    },
    { title: "Module", dataIndex: "module" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Roles",
      dataIndex: "userRolePermissions",
      render: (roles: any[]) =>
        (roles || []).map((r: any) => (
          <Tag key={r} color="geekblue">
            {r}
          </Tag>
        )),
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
    <div>
      <Title level={3}>Permission Management</Title>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <Input
            placeholder="Search..."
            style={{ width: 260 }}
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
          onClick={() => {
            setPermissionToEdit(undefined);
            setOpenModal(true);
          }}
        >
          Add Permission
        </Button>
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.items}
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
