import React, { useState, useEffect } from "react";
import { Button, Table, Popconfirm, Input, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetOEMsQuery,
  useDeleteOEMMutation,
  useUpdateOEMMutation,
} from "../../../../store/api/oemApi";
import type { OEMResponse } from "@OrianaTypes";
import AddOEMModal from "./AddOEMModal";
import { useDebounce } from "../../../../hooks";
import { useToast } from "../../../../hooks/useToast";

const { Search } = Input;

const OEMManagement: React.FC = () => {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOEM, setEditingOEM] = useState<OEMResponse | null>(null);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: oemsResponse,
    isLoading,
    refetch,
  } = useGetOEMsQuery({
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "DESC",
    searchTerm: debouncedSearchTerm || undefined,
  });
  const [deleteOEM, { isLoading: isDeleting }] = useDeleteOEMMutation();
  const [updateOEM, { isLoading: isUpdatingStatus }] = useUpdateOEMMutation();

  const oems = oemsResponse?.data || [];

  const handleEdit = (record: OEMResponse) => {
    setEditingOEM(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOEM(id).unwrap();
      toast.success("OEM deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete OEM");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOEM(null);
    refetch();
  };

  const columns: ColumnsType<OEMResponse> = [
    {
      title: "OEM Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: unknown, record: OEMResponse) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.isActive}
          loading={isUpdatingStatus}
          onChange={async (checked) => {
            try {
              await updateOEM({
                id: record.oemId,
                data: {
                  isActive: checked,
                },
              }).unwrap();
              toast.success(
                `OEM status updated to ${checked ? "Active" : "Inactive"}`
              );
              refetch();
            } catch (error: any) {
              toast.error(
                error?.data?.message || "Failed to update OEM status"
              );
            }
          }}
        />
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
            <Button danger icon={<DeleteOutlined />} loading={isDeleting} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
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
            background:
              "linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.1))",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
            zIndex: 1,
          }}
        >
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
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "1.35rem",
                color: "#047857",
              }}
            >
              OEM Management
            </h2>
            <p
              style={{
                margin: "0.15rem 0 0 0",
                fontSize: "0.85rem",
                color: "#059669",
              }}
            >
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
          style={{
            background: "linear-gradient(135deg, #059669, #10b981)",
            border: "none",
            borderRadius: 20,
            fontWeight: 600,
            height: 40,
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          Add OEM
        </Button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <Search
          placeholder="Search OEMs by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, borderRadius: 8 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={oems}
        rowKey="oemId"
        loading={isLoading}
        style={{ marginTop: 20 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: oemsResponse?.pagination?.total || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} OEMs`,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <AddOEMModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        initialValues={editingOEM || undefined}
      />
    </div>
  );
};

export default OEMManagement;
