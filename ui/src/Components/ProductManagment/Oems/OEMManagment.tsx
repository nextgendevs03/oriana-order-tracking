import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetOEMsQuery,
  useDeleteOEMMutation,
} from "../../../store/api/oemApi";
import type { OEMResponse } from "@OrianaTypes";
import AddOEMModal from "./AddOEMModal";

const OEMManagement: React.FC = () => {
  const { data: oems = [], isLoading } = useGetOEMsQuery();
  const [deleteOEM] = useDeleteOEMMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOEM, setEditingOEM] = useState<OEMResponse | null>(null);

  const handleEdit = (record: OEMResponse) => {
    setEditingOEM(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOEM(id).unwrap();
      message.success("OEM deleted successfully");
    } catch (error) {
      message.error("Failed to delete OEM");
    }
  };

  const columns: ColumnsType<OEMResponse> = [
    {
      title: "OEM Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (_: unknown, record: OEMResponse) =>
        record.isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_: unknown, record: OEMResponse) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
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
