import { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetOEMsQuery,
  useDeleteOEMMutation,
} from "../../../store/api/oemApi";
import AddOEMModal from "./AddOEMModal";

const OEMManagement = () => {
  const { data: oems = [], isLoading } = useGetOEMsQuery();
  const [deleteOEM] = useDeleteOEMMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOEM, setEditingOEM] = useState<any>(null);

  const columns = [
    { title: "OEM Name", dataIndex: "name" },

    {
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },

    {
      title: "Actions",
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingOEM(record);
              setIsModalOpen(true);
            }}
          />

          <Popconfirm
            title="Delete this OEM?"
            onConfirm={() => deleteOEM(record.oemId)}
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

      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
