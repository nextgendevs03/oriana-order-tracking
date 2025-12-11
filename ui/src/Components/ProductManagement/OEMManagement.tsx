import React, { useState } from "react";
import { Table, Button, Tag, Space, Breadcrumb, message } from "antd";
import { PlusOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectOEMs,
  addOEM,
  updateOEM,
  OEM,
} from "../../store/productManagementSlice";
import OEMModal from "./OEMModal";

const OEMManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const oems = useAppSelector(selectOEMs);
  const [openModal, setOpenModal] = useState(false);
  const [editingOEM, setEditingOEM] = useState<OEM | null>(null);

  const handleAdd = () => {
    setEditingOEM(null);
    setOpenModal(true);
  };

  const handleEdit = (record: OEM) => {
    setEditingOEM(record);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingOEM(null);
  };

  const handleSubmit = (values: Omit<OEM, "id">) => {
    if (editingOEM) {
      dispatch(
        updateOEM({
          ...values,
          id: editingOEM.id,
        })
      );
      message.success("OEM updated successfully");
    } else {
      const newOEM: OEM = {
        ...values,
        id: `OEM-${Date.now()}`,
      };
      dispatch(addOEM(newOEM));
      message.success("OEM added successfully");
    }
    handleCloseModal();
  };

  const columns = [
    {
      title: "OEM Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: OEM) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ padding: 0 }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <Link to="/dashboard">
                <HomeOutlined /> Home
              </Link>
            ),
          },
          {
            title: <Link to="/product-management">Product Management</Link>,
          },
          {
            title: "OEM Management",
          },
        ]}
      />

      {/* Title + Add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>OEM Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add OEM
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={oems}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        footer={() => `Total ${oems.length} OEMs`}
      />

      {/* Modal */}
      <OEMModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingOEM={editingOEM}
      />
    </div>
  );
};

export default OEMManagement;

