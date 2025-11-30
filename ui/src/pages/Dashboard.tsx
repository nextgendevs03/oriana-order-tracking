import React, { useEffect, useState } from "react";
import { Layout, Typography, Avatar, Space, Button, Card, Table } from "antd";
import SidebarMenu from "../Components/SidebarMenu";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface ItemFormValues {
  category: string;
  oemName: string;
  productModel: string;
  quantity?: number;
  spareQty?: number;
  totalQty?: number;
  pricePerUnit?: number;
  totalPrice?: number;
  warranty: string;
}

interface PurchaseFormValues {
  orderId: string;
  date?: string;
  salesPerson?: string;
  clientName?: string;
  osgPiNo?: string;
  osgPiDate?: string;
  poStatus?: string;
  clientPoNo?: string;
  poDate?: string;
  dispatchType?: "Single" | "Multiple";
  clientAddress?: string;
  clientContact?: string;
  dispatchPlanDate?: string;
  siteLocation?: string;
  onSiteSupport?: "Yes" | "No" | "Maybe";
  confirmDispatchDate?: string;
  paymentStatus?: string;
  remarks?: string;
  items?: ItemFormValues[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("loggedUser") || "Guest";

  const [latestPurchase, setLatestPurchase] = useState<PurchaseFormValues | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("latestPurchase");
    if (data) {
      setLatestPurchase(JSON.parse(data));
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider>
        <div
          style={{
            height: 60,
            margin: 16,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 8,
          }}
        />
        <SidebarMenu />
      </Sider>

      <Layout>
        {/* NAVBAR */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Space size="large" align="center">
            <Title
              level={3}
              style={{
                margin: 0,
                background: "linear-gradient(90deg, #4b6cb7, #182848)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              OSG ORIANA INDIA
            </Title>
            <Text style={{ fontSize: 16, color: "#555", fontWeight: 500, letterSpacing: 1 }}>
              Order Tracking System
            </Text>
          </Space>

          <Space>
            <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
            <Text strong>{username}</Text>
          </Space>
        </Header>

        {/* MAIN CONTENT */}
        <Content style={{ padding: 20 }}>
          <Title level={2}>Welcome, {username}! 🎉</Title>
          <p>Your dashboard is ready.</p>

          <Button
            type="primary"
            style={{
              backgroundColor: "#4b6cb7",
              borderRadius: 8,
              padding: "0 16px",
              fontWeight: 600,
              marginBottom: 20,
            }}
            onClick={() => navigate("/ordertracking")}
          >
            ADD Purchase Detail
          </Button>

          {latestPurchase ? (
            <Card title={`Purchase Summary: ${latestPurchase.orderId}`} style={{ marginTop: 16 }}>
              <p><b>Sales Person:</b> {latestPurchase.salesPerson}</p>
              <p><b>Client Name:</b> {latestPurchase.clientName}</p>
              <p><b>Client PO No:</b> {latestPurchase.clientPoNo}</p>
              <p><b>PO Status:</b> {latestPurchase.poStatus}</p>
              <p><b>PO Date:</b> {latestPurchase.poDate}</p>
              <p><b>Dispatch Type:</b> {latestPurchase.dispatchType}</p>
              <p><b>Site Location:</b> {latestPurchase.siteLocation}</p>
              <p><b>Dispatch Plan Date:</b> {latestPurchase.dispatchPlanDate}</p>
              <p><b>Confirm Dispatch Date:</b> {latestPurchase.confirmDispatchDate}</p>
              <p><b>Payment Status:</b> {latestPurchase.paymentStatus}</p>
              <p><b>Remarks:</b> {latestPurchase.remarks}</p>

              {latestPurchase.items && latestPurchase.items.length > 0 && (
                <>
                  <Title level={4} style={{ marginTop: 20 }}>Items</Title>
                  <Table
                    columns={[
                      { title: "Category", dataIndex: "category" },
                      { title: "OEM Name", dataIndex: "oemName" },
                      { title: "Product", dataIndex: "productModel" },
                      { title: "Quantity", dataIndex: "quantity" },
                      { title: "Spare Qty", dataIndex: "spareQty" },
                      { title: "Total Qty", dataIndex: "totalQty" },
                      { title: "Price/unit", dataIndex: "pricePerUnit" },
                      { title: "Total Price", dataIndex: "totalPrice" },
                      { title: "Warranty", dataIndex: "warranty" },
                    ]}
                    dataSource={latestPurchase.items}
                    rowKey={(_, i) => String(i)}
                    pagination={false}
                  />
                </>
              )}
            </Card>
          ) : (
            <Text type="secondary">No purchase data submitted yet.</Text>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
