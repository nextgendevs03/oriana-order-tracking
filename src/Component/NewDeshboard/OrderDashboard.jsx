import React, { useState } from "react";
import {
  Layout,
  Typography,
  Select,
  Avatar,
  Space,
  Button,
  Card,
  Tag,
  Row,
  Col,
} from "antd";
import { Package, Truck, CheckCircle } from "lucide-react"; 

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const OrderDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      company: "ABC Corporation",
      status: "PURCHASE COMPLETE",
      color: "blue",
      date: "2025-11-08",
      by: "John Doe",
      icon: <Package size={20} color="#1677ff" />, // ✅ Added example icons
    },
    {
      id: "ORD-002",
      company: "XYZ Ltd.",
      status: "DISPATCHED",
      color: "gold",
      date: "2025-11-09",
      by: "Jane Doe",
      icon: <Truck size={20} color="#faad14" />,
    },
    {
      id: "ORD-003",
      company: "LMN Pvt. Ltd.",
      status: "DELIVERED",
      color: "green",
      date: "2025-11-10",
      by: "Alex Smith",
      icon: <CheckCircle size={20} color="#52c41a" />,
    },
  ]);

  // ➕ Add new order dynamically
  const handleAddOrder = () => {
    const newId = `ORD-${(orders.length + 1).toString().padStart(3, "0")}`;
    const newOrder = {
      id: newId,
      company: "New Company",
      status: "PENDING",
      color: "default",
      date: new Date().toISOString().slice(0, 10),
      by: "Sales Person",
      icon: <Package size={20} color="#999" />,
    };
    setOrders([...orders, newOrder]);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      {/* ✅ Navbar Section */}
      {/* <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      > */}
        {/* <Title level={4} style={{ margin: 0, fontWeight: 700, color: "#001529" }}>
          Order Tracking System
        </Title>

        <Space align="center">
          <Select
            defaultValue="Sales Person"
            style={{ width: 150 }}
            options={[
              { value: "salesperson", label: "Sales Person" },
              { value: "manager", label: "Manager" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Avatar style={{ backgroundColor: "#1677ff" }}>p</Avatar>
        </Space>
      </Header> */}

      {/* ✅ Orders Section */}
      <Content style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>
              My Orders
            </Title>
            <Text type="secondary">Manage your purchase orders</Text>
          </div>

          <Button
            type="primary"
           // onClick={handleAddOrder}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            + New Order
          </Button>
        </div>

        {/* ✅ Order Cards */}
        <Row gutter={[16, 16]}>
          {orders.map((order) => (
            <Col xs={24} sm={12} md={8} lg={6} key={order.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 10,
                  border: "1px solid #f0f0f0",
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%", alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Title level={5} style={{ margin: 0 }}>
                      {order.id}
                    </Title>
                    <Tag color={order.color}>{order.status}</Tag>
                  </div>

                  {/* ✅ Icon and Details */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {order.icon}
                    <Text strong>{order.company}</Text>
                  </div>

                  <Text type="secondary">
                    By: {order.by} • {order.date}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default OrderDashboard;

