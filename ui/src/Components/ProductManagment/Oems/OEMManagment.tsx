import React, { useState } from "react";
import { Breadcrumb, Button, Table, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddOEMModal from "./AddOEMModal";

interface OEM {
  key: string;
  name: string;
  status: "Active" | "Inactive";
}

const OEMManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOEM, setEditingOEM] = useState<OEM | null>(null);
  const [oems, setOems] = useState<OEM[]>([]);

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
      render: (_: any, record: OEM) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingOEM(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = (key: string) => {
    setOems(oems.filter((item) => item.key !== key));
  };

  const handleSuccess = (newOEM: Omit<OEM, "key">) => {
    if (editingOEM) {
      setOems(
        oems.map((item) =>
          item.key === editingOEM.key ? { ...item, ...newOEM } : item
        )
      );
      setEditingOEM(null);
    } else {
      const newKey = Date.now().toString();
      setOems([...oems, { ...newOEM, key: newKey }]);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
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
        locale={{ emptyText: "No Data" }}
        style={{ marginTop: 20 }}
      />

      {/* Modal */}
      <AddOEMModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingOEM(null);
        }}
        onSuccess={handleSuccess}
        initialValues={editingOEM || undefined}
      />
    </div>
  );
};

export default OEMManagement;
