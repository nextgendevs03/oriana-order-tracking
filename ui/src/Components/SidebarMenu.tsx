import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "admin",
      icon: <UserOutlined />,
      label: "Admin",
      children: [
        {
          key: "/admin/users",
          label: "User Management",
        },
        {
          key: "/role-management",
          label: "Role Management",
        },
        {
          key: "/admin/permissions",
          label: "Permissions",
        },
      ],
    },
  ];

  return (
    <Sider
      width={220}
      theme="dark"
      style={{
        background: "#001529",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 18,
          fontWeight: 600,
          borderBottom: "1px solid #0a1d2f",
        }}
      >
        OSG India
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["admin"]}
        items={menuItems}
        onClick={(e) => navigate(e.key)}
        style={{ background: "#001529", flex: 1 }}
      />

      {/* ✅ Logout always visible */}
      <div
        onClick={() => navigate("/")}
        style={{
          padding: 20,
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: "1px solid #0a1d2f",
        }}
      >
        <LogoutOutlined />
        Logout
      </div>
    </Sider>
  );
};

export default SidebarMenu;
