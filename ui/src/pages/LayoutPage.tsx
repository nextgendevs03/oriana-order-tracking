import React, { useState } from "react";
import { Layout, Typography, Avatar, Space, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import SidebarMenu from "../Components/SidebarMenu";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const LayoutPage: React.FC = () => {
    
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const username = localStorage.getItem("loggedUser") || "Guest";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.1)",
            margin: collapsed ? "8px" : "8px 16px",
            borderRadius: 8,
            transition: "all 0.2s",
          }}
        >
          <Title
            level={5}
            style={{
              margin: 0,
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {collapsed ? "OSG" : "OSG India"}
          </Title>
        </div>
        <SidebarMenu />
      </Sider>

      <Layout>
        {/* NAVBAR */}
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* LEFT - Toggle Button + Title */}
          <Space size="large" align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Title
              level={4}
              style={{
                margin: 0,
                background: "linear-gradient(90deg, #4b6cb7, #182848)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              Order Tracking System
            </Title>
          </Space>

          {/* RIGHT PROFILE */}
          <Space>
            <Avatar
              style={{
                backgroundColor: "#4b6cb7",
                verticalAlign: "middle",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Text strong>{username}</Text>
          </Space>
        </Header>

        {/* MAIN CONTENT */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
