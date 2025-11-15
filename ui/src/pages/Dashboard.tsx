

import React from "react";
import { Layout, Typography, Avatar, Space } from "antd";
import SidebarMenu from "../Components/SidebarMenu";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const username = localStorage.getItem("loggedUser") || "Guest";

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
          {/* LEFT LOGO + ORDER TRACKING SIDE BY SIDE */}
          <Space size="large" align="center">
            {/* Logo */}
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

            {/* Order Tracking */}
            <Text
              style={{
                fontSize: 16,
                color: "#555",
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              Order Tracking System
            </Text>
          </Space>

          {/* RIGHT PROFILE */}
          <Space>
            <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
            <Text strong>{username}</Text>
          </Space>
        </Header>

        {/* MAIN CONTENT */}
        <Content style={{ padding: 20 }}>
          <Title level={2}>Welcome, {username}! 🎉</Title>
          <p>Your dashboard is now ready with the logo and Order Tracking text side by side.</p>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;





