import React from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetOEMsQuery,
  useDeleteOEMMutation,
} from "../../../store/api/oemApi";
import AddOEMModal from "./AddOEMModal";

const OEMManagement = () => {
  const { data: oems = [], isLoading } = useGetOEMsQuery();
  const [deleteOEM] = useDeleteOEMMutation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOEM, setEditingOEM] = React.useState<any>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteOEM(id).unwrap();
      message.success("OEM deleted successfully");
    } catch (error) {
      message.error("Failed to delete OEM");
    }
  };

  const columns = [
    {
      title: "OEM Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => {
              setEditingOEM(record);
              setIsModalOpen(true);
            }}
          />

          <Popconfirm
            title="Delete this OEM?"
            onConfirm={() => handleDelete(record.oemId)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Product Management</Breadcrumb.Item>
        <Breadcrumb.Item>OEM Management</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <h2>OEM Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingOEM(null);
            setIsModalOpen(true);
          }}
        >
          Add OEM
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={oems}
        rowKey="oemId"
        loading={isLoading}
        style={{ marginTop: 20 }}
      />

      <AddOEMModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        initialValues={editingOEM || undefined}
      />
    </div>
  );
};

export default OEMManagement;
