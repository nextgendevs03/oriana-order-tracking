import { useState } from "react";
import { Layout, Typography, Avatar, Space, Button, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import SidebarMenu from "../Components/SidebarMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "store/hooks";
import { RootState } from "store";
import { colors, shadows } from "../styles/theme";
import OSGLogo from "../OSG_Logo.png";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const LayoutPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const username = useAppSelector(
    (state: RootState) => state.auth.auth.username
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar - Vibrant Gradient */}
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={collapsed}
        width={260}
        collapsedWidth={72}
        className="osg-sidebar"
        style={{
          background: colors.sidebarBg,
          boxShadow: "4px 0 24px rgba(102, 126, 234, 0.25)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo Section */}
        <motion.div
          className="osg-sidebar-logo"
          style={{
            height: collapsed ? 48 : 56,
            margin: collapsed ? "16px 8px" : "16px 16px",
            padding: collapsed ? "8px" : "12px 16px",
          }}
          initial={false}
          animate={{
            height: collapsed ? 48 : 56,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.img
            src={OSGLogo}
            alt="OSG Logo"
            style={{
              maxHeight: collapsed ? 32 : 40,
              width: "auto",
              objectFit: "contain",
            }}
            initial={false}
            animate={{
              maxHeight: collapsed ? 32 : 40,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Divider */}
        <div className="osg-sidebar-divider" />

        {/* Menu */}
        <SidebarMenu collapsed={collapsed} />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 72 : 260,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Navbar - Clean & Light */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Header
            className="osg-navbar"
            style={{
              padding: "0 24px",
              background: colors.white,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: shadows.sm,
              borderBottom: `1px solid ${colors.gray200}`,
              height: 64,
              position: "sticky",
              top: 0,
              zIndex: 99,
            }}
          >
            {/* LEFT - Toggle Button + Title */}
            <Space size="middle" align="center">
              <Tooltip title={collapsed ? "Expand menu" : "Collapse menu"}>
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  className="osg-navbar-toggle"
                  style={{
                    fontSize: 16,
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    color: colors.gray500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </Tooltip>
              <div>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    color: colors.gray800,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Order Tracking System
                </Text>
              </div>
            </Space>

            {/* RIGHT - Profile */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Space size={12}>
                <div style={{ textAlign: "right" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: colors.gray700,
                      display: "block",
                      lineHeight: 1.3,
                    }}
                  >
                    {username}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.gray400,
                      display: "block",
                      lineHeight: 1.3,
                    }}
                  >
                    Administrator
                  </Text>
                </div>
                <Avatar
                  className="osg-avatar"
                  size={40}
                  style={{
                    background: colors.primary,
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </Space>
            </motion.div>
          </Header>
        </motion.div>

        {/* Main Content with Page Transitions */}
        <Content
          style={{
            margin: 24,
            padding: 0,
            minHeight: "calc(100vh - 64px - 48px)",
            background: "transparent",
            overflow: "auto",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
