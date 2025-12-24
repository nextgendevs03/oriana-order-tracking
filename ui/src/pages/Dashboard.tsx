import { useEffect, useMemo } from "react";
import { Table, Button, Tag, Card } from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { POData } from "../store/poSlice";
import { selectPOList } from "../store/poSelectors";
import type { ColumnsType } from "antd/es/table";
import {
  getPaymentStatusColor,
  getPoStatusColor,
  formatLabel,
} from "../utils";
import { colors, shadows } from "../styles/theme";

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
      render: (text) => (
        <span style={{ fontWeight: 500, color: colors.gray800 }}>{text}</span>
      ),
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
        return (
          <Tag
            style={{
              background: colors.gray100,
              color: colors.gray700,
              border: "none",
            }}
          >
            {assigneeMap[value] || "-"}
          </Tag>
        );
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
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          style={{
            color: colors.primary,
            borderRadius: 6,
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100%" }}>
      {/* Page Header - Vibrant & Modern */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: 16,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
            background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
          }}
          bodyStyle={{
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
              }}
            >
              <FileTextOutlined
                style={{ fontSize: 26, color: "#fff" }}
              />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                Order Punch Dashboard
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.9rem",
                  color: colors.gray500,
                }}
              >
                Track and manage all purchase orders
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePO}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
                padding: "0 24px",
                boxShadow: "0 4px 16px rgba(102, 126, 234, 0.35)",
              }}
            >
              Create PO
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* PO Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
          }}
          bodyStyle={{ padding: 0 }}
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
              style: { padding: "12px 16px", margin: 0 },
            }}
            locale={{
              emptyText: (
                <div style={{ padding: "48px 0", textAlign: "center" }}>
                  <FileTextOutlined
                    style={{
                      fontSize: 48,
                      color: colors.gray300,
                      marginBottom: 12,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      color: colors.gray500,
                      fontSize: 14,
                    }}
                  >
                    No purchase orders yet
                  </p>
                </div>
              ),
            }}
            style={{
              borderRadius: 12,
              overflow: "hidden",
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
