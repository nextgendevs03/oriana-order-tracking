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
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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
    <div style={{ padding: "1rem" }}>
      <Breadcrumb style={{ marginBottom: "1rem" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Product Management</Breadcrumb.Item>
        <Breadcrumb.Item>OEM Management</Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header - Pill Badge Style with Wave Pattern */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "#ecfdf5",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Wave decoration */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background: "linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.1))",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 30,
              background: "linear-gradient(135deg, #059669, #10b981)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
            }}
          >
            <span style={{ fontSize: 20 }}>🏭</span>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>OEM</span>
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.35rem", color: "#047857" }}>
              OEM Management
            </h2>
            <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.85rem", color: "#059669" }}>
              Manage Original Equipment Manufacturers
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingOEM(null);
            setIsModalOpen(true);
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{
            background: isButtonHovered
              ? "linear-gradient(135deg, #047857, #059669)"
              : "linear-gradient(135deg, #059669, #10b981)",
            border: "none",
            borderRadius: 20,
            fontWeight: 600,
            height: 40,
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
            boxShadow: isButtonHovered
              ? "0 6px 20px rgba(16, 185, 129, 0.5)"
              : "0 2px 8px rgba(16, 185, 129, 0.3)",
            transform: isButtonHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.3s ease",
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
