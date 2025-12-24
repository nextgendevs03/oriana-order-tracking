import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Checkbox,
  DatePicker,
} from "antd";
import {
  ReloadOutlined,
  FileTextOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  FilterOutlined,
  SettingOutlined,
  CloseOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { colors, shadows } from "../styles/theme";

const SummaryDashboard: React.FC = () => {
  const [status, setStatus] = useState<"active" | "inactive">("active");

  /* ---------- Side Panels ---------- */
  const [showFilter, setShowFilter] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  /* ---------- Columns ---------- */
  const allColumns = [
    { key: "poId", title: "PO ID", dataIndex: "poId" },
    { key: "date", title: "Date", dataIndex: "date" },
    { key: "client", title: "Client", dataIndex: "client" },
    { key: "piNo", title: "OSG PI No", dataIndex: "piNo" },
    { key: "status", title: "Status", dataIndex: "status" },
    { key: "payment", title: "Payment", dataIndex: "payment" },
    { key: "dispatch", title: "Dispatch", dataIndex: "dispatch" },
    { key: "preComm", title: "PreComm", dataIndex: "preComm" },
    { key: "comm", title: "Comm", dataIndex: "comm" },
  ];

  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((c) => c.key)
  );

  /* ---------- Refresh ---------- */
  const handleRefresh = () => {
    setSelectedColumns(allColumns.map((c) => c.key));
    setStatus("active");
  };

  /* ---------- Stats Cards Data ---------- */
  const stats = [
    {
      title: "Total Orders",
      value: 0,
      subtitle: "All orders",
      icon: <FileTextOutlined />,
      color: colors.primary,
      bgColor: colors.primaryMuted,
    },
    {
      title: "In Progress",
      value: 0,
      subtitle: "Processing",
      icon: <SyncOutlined />,
      color: colors.accent,
      bgColor: colors.accentMuted,
    },
    {
      title: "Pending",
      value: 0,
      subtitle: "Awaiting action",
      icon: <ClockCircleOutlined />,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.08)",
    },
    {
      title: "Completed",
      value: 0,
      subtitle: "Closed",
      icon: <CheckCircleOutlined />,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.08)",
    },
  ];

  /* ---------- FILTER STATES ---------- */
  const [poId, setPoId] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

  return (
    <div style={{ minHeight: "100%" }}>
      {/* ---------- Page Header ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
          }}
          bodyStyle={{
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: colors.primaryMuted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChartOutlined
                style={{ fontSize: 22, color: colors.primary }}
              />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: colors.gray900,
                  letterSpacing: "-0.01em",
                }}
              >
                Summary Dashboard
              </h2>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "0.875rem",
                  color: colors.gray500,
                }}
              >
                Track all purchase orders at a glance
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{
                background: colors.primary,
                color: colors.white,
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                height: 40,
                padding: "0 20px",
                boxShadow: shadows.primary,
              }}
            >
              Refresh
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* ---------- Stat Cards ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: 0.05 + index * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                border: `1px solid ${colors.gray200}`,
                boxShadow: shadows.card,
                transition: "all 0.2s ease",
              }}
              bodyStyle={{ padding: 20 }}
              hoverable
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: stat.color,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: colors.gray500,
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: 28,
                      fontWeight: 700,
                      color: colors.gray900,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: 12,
                      color: colors.gray400,
                    }}
                  >
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ---------- Table Card ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            border: `1px solid ${colors.gray200}`,
            boxShadow: shadows.card,
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Table Toolbar */}
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "16px 20px",
              borderBottom: `1px solid ${colors.gray200}`,
              flexWrap: "wrap",
            }}
          >
            <Select
              value={status}
              onChange={(v) => setStatus(v)}
              style={{ width: 160 }}
              options={[
                {
                  value: "active",
                  label: (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: colors.primary,
                        }}
                      />
                      Active Orders
                    </span>
                  ),
                },
                {
                  value: "inactive",
                  label: (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: colors.gray400,
                        }}
                      />
                      Inactive Orders
                    </span>
                  ),
                },
              ]}
            />

            <Input.Search
              placeholder="Search orders..."
              style={{ width: 240 }}
            />

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(true)}
                style={{
                  borderRadius: 8,
                  borderColor: colors.gray300,
                }}
              >
                Filters
              </Button>

              <Button
                icon={<SettingOutlined />}
                onClick={() => setShowColumns(true)}
                style={{
                  borderRadius: 8,
                  borderColor: colors.gray300,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Columns
                <span
                  style={{
                    background: colors.gray100,
                    borderRadius: 4,
                    padding: "0 6px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.gray600,
                  }}
                >
                  {selectedColumns.length}
                </span>
              </Button>
            </div>
          </div>

          <Table
            pagination={false}
            columns={allColumns.filter((c) => selectedColumns.includes(c.key))}
            dataSource={[]}
            locale={{
              emptyText: (
                <div style={{ textAlign: "center", padding: 48 }}>
                  <FileSearchOutlined
                    style={{ fontSize: 48, color: colors.gray300 }}
                  />
                  <p
                    style={{
                      marginTop: 12,
                      marginBottom: 0,
                      color: colors.gray500,
                      fontSize: 14,
                    }}
                  >
                    {status === "active"
                      ? "No active orders found"
                      : "No inactive orders found"}
                  </p>
                </div>
              ),
            }}
          />
        </Card>
      </motion.div>

      {/* ---------- FILTER PANEL ---------- */}
      <AnimatePresence>
        {showFilter && (
          <SidePanel
            title="Filters"
            onClose={() => setShowFilter(false)}
            content={
              <>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: colors.gray700,
                    }}
                  >
                    PO ID
                  </label>
                  <Input
                    placeholder="Enter PO ID"
                    value={poId}
                    onChange={(e) => setPoId(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: colors.gray700,
                    }}
                  >
                    Client
                  </label>
                  <Input
                    placeholder="Enter client name"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: colors.gray700,
                    }}
                  >
                    Order Status
                  </label>
                  <Select
                    placeholder="Select status"
                    style={{ width: "100%" }}
                    value={orderStatus}
                    onChange={(v) => setOrderStatus(v)}
                    options={[
                      { value: "pending", label: "Pending" },
                      { value: "completed", label: "Completed" },
                    ]}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: colors.gray700,
                    }}
                  >
                    Date Range
                  </label>
                  <DatePicker
                    placeholder="Start Date"
                    style={{ width: "100%", marginBottom: 8 }}
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                  <DatePicker
                    placeholder="End Date"
                    style={{ width: "100%" }}
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>

                <Button
                  type="primary"
                  block
                  onClick={() => {
                    console.log("Filters applied:", {
                      poId,
                      client,
                      orderStatus,
                      startDate: startDate?.format("YYYY-MM-DD"),
                      endDate: endDate?.format("YYYY-MM-DD"),
                    });
                    setShowFilter(false);
                  }}
                  style={{
                    marginTop: 8,
                    borderRadius: 8,
                    height: 40,
                  }}
                >
                  Apply Filters
                </Button>
              </>
            }
          />
        )}
      </AnimatePresence>

      {/* ---------- COLUMNS PANEL ---------- */}
      <AnimatePresence>
        {showColumns && (
          <SidePanel
            title="Manage Columns"
            onClose={() => setShowColumns(false)}
            content={
              <>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: `1px solid ${colors.gray200}`,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() =>
                      setSelectedColumns(allColumns.map((c) => c.key))
                    }
                    style={{ borderRadius: 6 }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedColumns([])}
                    style={{ borderRadius: 6 }}
                  >
                    Clear All
                  </Button>
                </div>

                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                  {allColumns.map((col) => (
                    <Checkbox
                      key={col.key}
                      checked={selectedColumns.includes(col.key)}
                      onChange={(e) =>
                        setSelectedColumns(
                          e.target.checked
                            ? [...selectedColumns, col.key]
                            : selectedColumns.filter((k) => k !== col.key)
                        )
                      }
                      style={{
                        display: "flex",
                        padding: "10px 0",
                        borderBottom: `1px solid ${colors.gray100}`,
                      }}
                    >
                      {col.title}
                    </Checkbox>
                  ))}
                </div>
              </>
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- SIDE PANEL COMPONENT ---------- */
interface SidePanelProps {
  title: string;
  onClose: () => void;
  content: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ title, onClose, content }) => (
  <>
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.3)",
        zIndex: 999,
      }}
    />
    {/* Panel */}
    <motion.div
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 340, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 340,
        height: "100vh",
        background: colors.white,
        padding: 24,
        boxShadow: shadows.xl,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `1px solid ${colors.gray200}`,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: colors.gray900,
          }}
        >
          {title}
        </h3>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          style={{
            color: colors.gray500,
            borderRadius: 6,
          }}
        />
      </div>
      {content}
    </motion.div>
  </>
);

export default SummaryDashboard;
