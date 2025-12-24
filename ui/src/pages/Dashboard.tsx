import { useEffect, useMemo } from "react";
import { Table, Button, Tag } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { POData } from "../store/poSlice";
import { selectPOList } from "../store/poSelectors";
import type { ColumnsType } from "antd/es/table";
import { getPaymentStatusColor, getPoStatusColor, formatLabel } from "../utils";
import { colors, gradients } from "../styles/theme";

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
  const poList = useAppSelector(selectPOList);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
    navigate(`/po-details/${record.poOrderId}`);
  };

  const handleCreatePO = () => {
    navigate("/create-po");
  };

  const clientNameFilters = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(dataSource.map((item) => item.clientName))
    );
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
          style={{ color: colors.primary }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "0.5rem", background: "#fff", minHeight: "100%" }}>
      {/* Header with OSG gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="osg-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          background: gradients.header,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(236, 108, 37, 0.25)",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#ffffff",
              letterSpacing: "0.5px",
            }}
          >
            Order Punch Dashboard
          </h2>
          <p
            style={{
              margin: "0.35rem 0 0 0",
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 400,
            }}
          >
            Track and manage all purchase orders in one place
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreatePO}
            style={{
              backgroundColor: colors.white,
              color: colors.primary,
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 42,
              padding: "0 24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            Create PO
          </Button>
        </motion.div>
      </motion.div>

      {/* PO Table with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
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
          style={{
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
