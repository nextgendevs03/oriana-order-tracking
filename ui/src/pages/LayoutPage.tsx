import { useState } from "react";
import { Layout, Typography, Avatar, Space, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import SidebarMenu from "../Components/SidebarMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "store/hooks";
import { RootState } from "store";
import { colors, gradients } from "../styles/theme";
import OSGLogo from "../OSG_Logo.png";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const LayoutPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const username = useAppSelector((state: RootState) => state.auth.auth.username);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar with Gradient */}
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={collapsed}
        width={240}
        collapsedWidth={80}
        className="osg-sidebar"
        style={{
          background: gradients.sidebar,
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Logo Section */}
        <motion.div
          className="osg-sidebar-logo"
          style={{
            height: collapsed ? 56 : 72,
            margin: collapsed ? "12px 8px" : "12px 16px",
            padding: collapsed ? "8px" : "12px 16px",
          }}
          initial={false}
          animate={{
            height: collapsed ? 56 : 72,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.img
            src={OSGLogo}
            alt="OSG Logo"
            style={{
              maxHeight: collapsed ? 36 : 48,
              width: "auto",
              objectFit: "contain",
            }}
            initial={false}
            animate={{
              maxHeight: collapsed ? 36 : 48,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Menu */}
        <SidebarMenu collapsed={collapsed} />
      </Sider>

      <Layout>
        {/* Navbar with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Header
            className="osg-navbar"
            style={{
              padding: "0 24px",
              background: colors.white,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              borderBottom: `1px solid ${colors.gray200}`,
              height: 64,
            }}
          >
            {/* LEFT - Toggle Button + Title */}
            <Space size="middle" align="center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="osg-navbar-toggle"
                  style={{
                    fontSize: 18,
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    color: colors.accent,
                  }}
                />
              </motion.div>
              <Title
                level={4}
                className="osg-navbar-title"
                style={{
                  margin: 0,
                  background: gradients.header,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  fontSize: 18,
                }}
              >
                Order Tracking System
              </Title>
            </Space>

            {/* RIGHT - Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Space>
                <Avatar
                  className="osg-avatar"
                  style={{
                    background: gradients.header,
                    fontWeight: 600,
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <Text strong style={{ color: colors.gray700 }}>
                  {username}
                </Text>
              </Space>
            </motion.div>
          </Header>
        </motion.div>

        {/* Main Content with Page Transitions */}
        <Content
          style={{
            margin: 20,
            padding: 24,
            minHeight: 280,
            background: colors.white,
            borderRadius: 12,
            overflow: "auto",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ height: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
