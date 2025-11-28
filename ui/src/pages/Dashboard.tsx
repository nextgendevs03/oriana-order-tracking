import React, { useState } from "react";
import { Layout, Typography, Avatar, Space, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons"; // Hamburger icon
import SidebarMenu from "../Components/SidebarMenu";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("loggedUser") || "Guest";
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <SidebarMenu collapsed={collapsed} />
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
          {/* LEFT: Hamburger + Logo + Order Tracking */}
          <Space size="large" align="center">
            {/* Hamburger Icon */}
            <MenuOutlined
              style={{ fontSize: 24, cursor: "pointer" }}
              onClick={() => setCollapsed(!collapsed)}
            />

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
      </Layout>
    </Layout>
  );
};

export default Dashboard;