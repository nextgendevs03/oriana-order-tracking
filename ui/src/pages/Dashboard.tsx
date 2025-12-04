import React, { useMemo } from "react";
import { Table, Button, Tag } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { POData } from "../store/poSlice";
import type { ColumnsType } from "antd/es/table";

interface PORecord {
  key: string;
  poOrderId: string;
  date: string;
  clientName: string;
  osgPiNo: string;
  osgPoNo: string;
  assignDispatchTo: number;
  paymentStatus: string;
  poStatus: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const poList = useAppSelector((state) => state.po.poList);

  // Transform Redux data to table format
  const dataSource: PORecord[] = poList.map((po: POData) => ({
    key: po.id,
    poOrderId: po.id,
    date: po.date,
    clientName: po.clientName,
    osgPiNo: String(po.osgPiNo),
    osgPoNo: String(po.clientPoNo),
    assignDispatchTo: po.assignDispatchTo,
    paymentStatus: po.paymentStatus,
    poStatus: po.poStatus,
  }));

  const handleView = (record: PORecord) => {
    // Navigate to PO details page with poId in route
    navigate(`/po-details/${record.poOrderId}`);
  };

  const handleCreatePO = () => {
    navigate("/create-po");
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "advanced":
      case "received":
        return "green";
      case "pending":
        return "orange";
      case "15_dc":
      case "30_dc":
        return "blue";
      case "lc":
        return "purple";
      default:
        return "default";
    }
  };

  const getPoStatusColor = (status: string) => {
    switch (status) {
      case "po_received":
        return "green";
      case "po_confirmed_phone":
        return "blue";
      case "on_call":
        return "orange";
      case "on_mail":
        return "purple";
      default:
        return "default";
    }
  };

  const formatLabel = (value: string) => {
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Generate unique filter options from data
  const clientNameFilters = useMemo(() => {
    const uniqueNames = Array.from(new Set(dataSource.map((item) => item.clientName)));
    return uniqueNames.map((name) => ({ text: name, value: name }));
  }, [dataSource]);

  const assignDispatchToFilters = [
    { text: "Aman", value: 1 },
    { text: "Rahul", value: 2 },
  ];

  const poStatusFilters = [
    { text: "PO Received", value: "po_received" },
    { text: "PO Confirmed on Phone", value: "po_confirmed_phone" },
    { text: "On Call", value: "on_call" },
    { text: "On Mail", value: "on_mail" },
    { text: "Closed", value: "closed" },
  ];

  const columns: ColumnsType<PORecord> = [
    {
      title: "OSG Order ID",
      dataIndex: "poOrderId",
      key: "poOrderId",
      fixed: "left",
      width: 120,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      width: 180,
      filters: clientNameFilters,
      filterSearch: true,
      onFilter: (value, record) => record.clientName.includes(value as string),
    },
    {
      title: "OSG PI No",
      dataIndex: "osgPiNo",
      key: "osgPiNo",
      width: 140,
    },
    {
      title: "Client PO No",
      dataIndex: "clientPoNo",
      key: "clientPoNo",
      width: 140,
    },
    {
      title: "Assign Dispatch To",
      dataIndex: "assignDispatchTo",
      key: "assignDispatchTo",
      width: 160,
      filters: assignDispatchToFilters,
      filterSearch: true,
      onFilter: (value, record) => record.assignDispatchTo === value,
      render: (value: number) => {
        const assigneeMap: Record<number, string> = { 1: "Aman", 2: "Rahul" };
        return <Tag color="cyan">{assigneeMap[value] || "-"}</Tag>;
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 140,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>{formatLabel(status)}</Tag>
      ),
    },
    {
      title: "PO Status",
      dataIndex: "poStatus",
      key: "poStatus",
      width: 150,
      filters: poStatusFilters,
      filterSearch: true,
      onFilter: (value, record) => record.poStatus === value,
      render: (status: string) => (
        <Tag color={getPoStatusColor(status)}>{formatLabel(status)}</Tag>
      ),
    },
    {
      title: "View",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "1rem",
        background: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Header with Create PO button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreatePO}
          style={{
            backgroundColor: "#4b6cb7",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Create PO
        </Button>
      </div>

      {/* PO Table */}
      <Table<PORecord>
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1200 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        locale={{
          emptyText: "No PO available",
        }}
        bordered
      />
    </div>
  );
};

export default Dashboard;
