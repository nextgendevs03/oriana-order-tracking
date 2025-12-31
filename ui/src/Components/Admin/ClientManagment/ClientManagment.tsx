import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Input,
  Switch,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetClientsQuery,
  useDeleteClientMutation,
  useUpdateClientMutation,
} from "../../../store/api/clientApi";
import type { ClientResponse } from "@OrianaTypes";
import AddClientModal from "./AddClientModal";
import { useDebounce } from "../../../hooks";
import { useToast } from "../../../hooks/useToast";

const { Search } = Input;

const ClientManagement: React.FC = () => {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(
    null
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: clientsResponse,
    isLoading,
    refetch,
  } = useGetClientsQuery({
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "DESC",
    searchTerm: debouncedSearchTerm || undefined,
  });

  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [updateClient, { isLoading: isUpdatingStatus }] =
    useUpdateClientMutation();

  const clients = clientsResponse?.data || [];

  const handleEdit = (record: ClientResponse) => {
    setEditingClient(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id).unwrap();
      toast.success("Client deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete client");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    refetch();
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<ClientResponse> = [
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Address",
      dataIndex: "clientAddress",
      key: "clientAddress",
      render: (text: string | null) => text || "-",
    },
    {
      title: "Contact",
      dataIndex: "clientContact",
      key: "clientContact",
      render: (text: string | null) => text || "-",
    },
    {
      title: "GST",
      dataIndex: "clientGST",
      key: "clientGST",
      render: (text: string | null) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: unknown, record: ClientResponse) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={record.isActive}
          loading={isUpdatingStatus}
          onChange={async (checked) => {
            try {
              await updateClient({
                id: record.clientId,
                data: {
                  isActive: checked,
                  updatedBy: "admin", // TODO: Get from auth context
                },
              }).unwrap();
              toast.success(
                `Client status updated to ${checked ? "Active" : "Inactive"}`
              );
              refetch();
            } catch (error: any) {
              toast.error(
                error?.data?.message || "Failed to update client status"
              );
            }
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ClientResponse) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this client?"
            description="Are you sure you want to delete this client?"
            onConfirm={() => handleDelete(record.clientId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
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
          background: "#eff6ff",
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
              "linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.1))",
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
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.35)",
            }}
          >
            <span style={{ fontSize: 20 }}>🏢</span>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "1.35rem",
                color: "#1e40af",
              }}
            >
              Client Management
            </h2>
            <p
              style={{
                margin: "0.15rem 0 0 0",
                fontSize: "0.85rem",
                color: "#2563eb",
              }}
            >
              Manage client information and details
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClient}
          style={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            border: "none",
            borderRadius: 20,
            fontWeight: 600,
            height: 40,
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <Search
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, borderRadius: 8 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={clients}
        rowKey="clientId"
        loading={isLoading}
        style={{ marginTop: 20 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: clientsResponse?.pagination?.total || 0,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} clients`,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <AddClientModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        editingClient={editingClient}
        onSuccess={() => {
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default ClientManagement;
