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

  /* ---------- Vibrant Glass Cards ---------- */
  const stats = [
    {
      title: "Total Orders",
      value: 0,
      subtitle: "All orders",
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadowColor: "rgba(102, 126, 234, 0.4)",
    },
    {
      title: "In Progress",
      value: 0,
      subtitle: "Processing",
      icon: <SyncOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadowColor: "rgba(245, 87, 108, 0.4)",
    },
    {
      title: "Pending",
      value: 0,
      subtitle: "Awaiting action",
      icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      shadowColor: "rgba(79, 172, 254, 0.4)",
    },
    {
      title: "Completed",
      value: 0,
      subtitle: "Closed",
      icon: <CheckCircleOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      shadowColor: "rgba(67, 233, 123, 0.4)",
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
            borderRadius: 16,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
            borderLeft: `4px solid ${colors.accent}`,
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
              <BarChartOutlined style={{ fontSize: 26, color: "#fff" }} />
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
                Summary Dashboard
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.9rem",
                  color: colors.gray500,
                }}
              >
                Track all purchase orders at a glance
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{
                background: colors.primary,
                color: colors.white,
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                height: 44,
                padding: "0 24px",
                boxShadow: "0 4px 16px rgba(113, 162, 65, 0.35)",
              }}
            >
              Refresh
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* ---------- Vibrant Glass Stat Cards ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.35,
              delay: 0.1 + index * 0.08,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{ 
              y: -6, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div
              style={{
                background: stat.gradient,
                borderRadius: 20,
                padding: "24px 22px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 10px 30px ${stat.shadowColor}`,
                cursor: "pointer",
              }}
            >
              {/* Glass overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
                  borderRadius: 20,
                }}
              />
              {/* Decorative circle */}
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: 40,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 500,
                        opacity: 0.9,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.title}
                    </p>
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: 36,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 13,
                        opacity: 0.8,
                      }}
                    >
                      {stat.subtitle}
                    </p>
                  </div>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ---------- Table Card ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
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
              padding: "18px 22px",
              borderBottom: `1px solid ${colors.gray200}`,
              flexWrap: "wrap",
              background: colors.gray50,
              borderRadius: "16px 16px 0 0",
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
                          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
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
              style={{ width: 260 }}
            />

            <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(true)}
                style={{
                  borderRadius: 10,
                  borderColor: colors.gray300,
                  height: 40,
                }}
              >
                Filters
              </Button>

              <Button
                icon={<SettingOutlined />}
                onClick={() => setShowColumns(true)}
                style={{
                  borderRadius: 10,
                  borderColor: colors.gray300,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Columns
                <span
                  style={{
                    background: colors.accent,
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
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
                <div style={{ textAlign: "center", padding: 56 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px auto",
                    }}
                  >
                    <FileSearchOutlined
                      style={{ fontSize: 36, color: "#667eea" }}
                    />
                  </div>
                  <p
                    style={{
                      marginBottom: 4,
                      color: colors.gray700,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {status === "active"
                      ? "No active orders found"
                      : "No inactive orders found"}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: colors.gray400,
                      fontSize: 14,
                    }}
                  >
                    Orders will appear here once created
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
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.gray700,
                    }}
                  >
                    PO ID
                  </label>
                  <Input
                    placeholder="Enter PO ID"
                    value={poId}
                    onChange={(e) => setPoId(e.target.value)}
                    style={{ borderRadius: 10, height: 42 }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.gray700,
                    }}
                  >
                    Client
                  </label>
                  <Input
                    placeholder="Enter client name"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    style={{ borderRadius: 10, height: 42 }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.gray700,
                    }}
                  >
                    Order Status
                  </label>
                  <Select
                    placeholder="Select status"
                    style={{ width: "100%", height: 42 }}
                    value={orderStatus}
                    onChange={(v) => setOrderStatus(v)}
                    options={[
                      { value: "pending", label: "Pending" },
                      { value: "completed", label: "Completed" },
                    ]}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.gray700,
                    }}
                  >
                    Date Range
                  </label>
                  <DatePicker
                    placeholder="Start Date"
                    style={{ width: "100%", marginBottom: 10, borderRadius: 10, height: 42 }}
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                  <DatePicker
                    placeholder="End Date"
                    style={{ width: "100%", borderRadius: 10, height: 42 }}
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
                    marginTop: 12,
                    borderRadius: 10,
                    height: 44,
                    background: colors.primary,
                    border: "none",
                    fontWeight: 600,
                    boxShadow: "0 4px 16px rgba(113, 162, 65, 0.3)",
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
                    gap: 10,
                    marginBottom: 18,
                    paddingBottom: 18,
                    borderBottom: `1px solid ${colors.gray200}`,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() =>
                      setSelectedColumns(allColumns.map((c) => c.key))
                    }
                    style={{ borderRadius: 8, height: 34 }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedColumns([])}
                    style={{ borderRadius: 8, height: 34 }}
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
                        padding: "12px 0",
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
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 999,
      }}
    />
    {/* Panel */}
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 360,
        height: "100vh",
        background: colors.white,
        padding: 28,
        boxShadow: shadows.xl,
        zIndex: 1000,
        borderRadius: "20px 0 0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 18,
          borderBottom: `1px solid ${colors.gray200}`,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
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
            borderRadius: 8,
            width: 36,
            height: 36,
          }}
        />
      </div>
      {content}
    </motion.div>
  </>
);

export default SummaryDashboard;
