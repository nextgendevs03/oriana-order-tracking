import React, { useState } from "react";
import { Card, Button, Input, Select, Table, Checkbox, DatePicker } from "antd";
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
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { colors, gradients } from "../styles/theme";

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

  /* ---------- Cards ---------- */
  const cards = [
    {
      title: "TOTAL ORDERS",
      subtitle: "All orders",
      color: gradients.header,
      icon: <FileTextOutlined />,
    },
    {
      title: "IN PROGRESS",
      subtitle: "Processing",
      color: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
      icon: <SyncOutlined />,
    },
    {
      title: "PENDING",
      subtitle: "Awaiting action",
      color: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
      icon: <ClockCircleOutlined />,
    },
    {
      title: "COMPLETED",
      subtitle: "Closed",
      color: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      icon: <CheckCircleOutlined />,
    },
  ];

  /* ---------- FILTER STATES ---------- */
  const [poId, setPoId] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

  return (
    <div style={{ padding: 24, background: colors.gray50, minHeight: "100vh" }}>
      {/* ---------- Header - OSG Gradient Style ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "relative",
          marginBottom: 24,
          padding: "1.5rem 2rem",
          background: `linear-gradient(135deg, rgba(236, 108, 37, 0.1) 0%, rgba(113, 162, 65, 0.1) 100%)`,
          borderRadius: 16,
          border: `1px solid rgba(236, 108, 37, 0.2)`,
          backdropFilter: "blur(10px)",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `linear-gradient(135deg, rgba(236, 108, 37, 0.3), rgba(113, 162, 65, 0.1))`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 80,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `rgba(113, 162, 65, 0.15)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: gradients.header,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px rgba(236, 108, 37, 0.4)`,
                }}
              >
                <FileTextOutlined style={{ fontSize: 24, color: "#fff" }} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.5rem", color: colors.gray800 }}>
                  Summary Dashboard
                </h2>
                <p style={{ margin: 0, fontSize: "0.875rem", color: colors.gray500 }}>
                  Track all purchase orders at a glance
                </p>
              </div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{
                background: gradients.button,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                height: 42,
                padding: "0 24px",
                boxShadow: `0 4px 12px rgba(113, 162, 65, 0.35)`,
              }}
            >
              Refresh
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* ---------- Cards ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            style={{ flex: "1 1 200px", minWidth: 180 }}
          >
            <Card
              bordered={false}
              style={{
                background: card.color,
                borderRadius: 14,
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    padding: 12,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <div
                    style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0.5 }}
                  >
                    {card.title}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
                    0
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    {card.subtitle}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ---------- Table ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        <Card bordered={false} style={{ borderRadius: 12 }}>
          <div style={{ display: "flex", gap: 12, paddingBottom: 12 }}>
            {/* Status Select */}
            <Select
              value={status}
              onChange={(v) => setStatus(v)}
              style={{ width: 180 }}
              options={[
                {
                  value: "active",
                  label: (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: colors.accent,
                        }}
                      />
                      Inactive Orders
                    </span>
                  ),
                },
              ]}
            />

            <Input.Search placeholder="Search orders..." style={{ width: 260 }} />

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(true)}
              >
                Filters
              </Button>

              <Button
                icon={<SettingOutlined />}
                onClick={() => setShowColumns(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                Columns
                <span
                  style={{
                    background: colors.gray200,
                    borderRadius: 6,
                    padding: "0 6px",
                    fontSize: 12,
                    fontWeight: 600,
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
                <div style={{ textAlign: "center", padding: 32 }}>
                  <FileSearchOutlined
                    style={{ fontSize: 40, color: colors.gray300 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    {status === "active"
                      ? "No Active Orders Found"
                      : "No Inactive Orders Found"}
                  </div>
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
                <Input
                  placeholder="PO ID"
                  style={{ marginBottom: 12 }}
                  value={poId}
                  onChange={(e) => setPoId(e.target.value)}
                />
                <Input
                  placeholder="Client"
                  style={{ marginBottom: 12 }}
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                />
                <Select
                  placeholder="Order Status"
                  style={{ width: "100%", marginBottom: 12 }}
                  value={orderStatus}
                  onChange={(v) => setOrderStatus(v)}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "completed", label: "Completed" },
                  ]}
                />
                <DatePicker
                  placeholder="Start Date"
                  style={{ width: "100%", marginBottom: 12 }}
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <DatePicker
                  placeholder="End Date"
                  style={{ width: "100%", marginBottom: 16 }}
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />

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
            title="Columns"
            onClose={() => setShowColumns(false)}
            content={
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <Button
                    size="small"
                    onClick={() =>
                      setSelectedColumns(allColumns.map((c) => c.key))
                    }
                  >
                    Select All
                  </Button>
                  <Button size="small" onClick={() => setSelectedColumns([])}>
                    Clear
                  </Button>
                </div>

                <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
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
                      style={{ display: "flex", padding: "6px 0" }}
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

/* ---------- SIDE PANEL ---------- */
const SidePanel = ({ title, onClose, content }: any) => (
  <motion.div
    initial={{ x: 320, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 320, opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: 320,
      height: "100vh",
      background: "#fff",
      padding: 20,
      boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
      borderRadius: "12px 0 0 12px",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <h3 style={{ margin: 0, color: colors.gray800 }}>{title}</h3>
      <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
    </div>
    {content}
  </motion.div>
);

export default SummaryDashboard;
