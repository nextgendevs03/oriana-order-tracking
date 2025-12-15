import React, { useState } from "react";
import { Card, Button, Input, Select, Table } from "antd";
import {
  ReloadOutlined,
  FileTextOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const SummaryDashboard: React.FC = () => {
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const cards = [
    {
      title: "TOTAL ORDERS",
      subtitle: "All orders",
      color: "linear-gradient(135deg,#667eea,#764ba2)",
      icon: <FileTextOutlined />,
    },
    {
      title: "IN PROGRESS",
      subtitle: "Processing",
      color: "linear-gradient(135deg,#f857a6,#ff5858)",
      icon: <SyncOutlined />,
    },
    {
      title: "PENDING",
      subtitle: "Awaiting action",
      color: "linear-gradient(135deg,#36d1dc,#5b86e5)",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "COMPLETED",
      subtitle: "Closed",
      color: "linear-gradient(135deg,#42e695,#3bb2b8)",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ marginBottom: 4 }}>Summary Dashboard</h2>
          <span style={{ color: "#6b7280" }}>
            Track all purchase orders at a glance
          </span>
        </div>

        <Button icon={<ReloadOutlined />}>Refresh</Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.title}
            bordered={false}
            style={{
              background: card.color,
              borderRadius: 14,
              color: "#fff",
              height: 110,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.25)",
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 20,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {card.subtitle}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>0</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card
        bordered={false}
        style={{
          padding: 0,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "12px 16px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Select
            value={status}
            onChange={(v) => setStatus(v)}
            style={{ width: 180 }}
            options={[
              {
                value: "active",
                label: (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22c55e",
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#ef4444",
                      }}
                    />
                    Inactive Orders
                  </span>
                ),
              },
            ]}
          />

          <Input.Search placeholder="Search orders..." style={{ width: 260 }} />

          <div style={{ marginLeft: "auto" }}>
            <Button>Filters</Button>
            <Button style={{ marginLeft: 8 }}>Columns</Button>
          </div>
        </div>

        {/* -------- Table -------- */}
        <Table
          pagination={false}
          columns={[
            { title: "PO ID", dataIndex: "poId" },
            { title: "Date", dataIndex: "date" },
            { title: "Client", dataIndex: "client" },
            { title: "OSG PI No", dataIndex: "piNo" },
            { title: "Status", dataIndex: "status" },
            { title: "Payment", dataIndex: "payment" },
            { title: "Dispatch", dataIndex: "dispatch" },
            { title: "PreComm", dataIndex: "preComm" },
            { title: "Comm", dataIndex: "comm" },
          ]}
          dataSource={[]}
          locale={{
            emptyText: (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <FileSearchOutlined
                  style={{
                    fontSize: 40,
                    color: "#d1d5db",
                    marginBottom: 8,
                  }}
                />
                <div style={{ color: "#9ca3af", fontSize: 13 }}>
                  No orders found
                </div>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default SummaryDashboard;
