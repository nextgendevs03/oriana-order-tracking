import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const SidebarMenu = () => {
  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Admin",
      children: [
        {
          key: "2",
          label: <Link to="/users">User Management</Link>,
        },
        {
          key: "3",
          label: <Link to="/roles">Role Management</Link>,
        },
        {
          key: "4",
          label: <Link to="/permissions">Permissions</Link>,
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
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{ background: "#001529" }}
        />
      </div>

      {/* Logout */}
      <div
        style={{
          height: 50,
          borderTop: "1px solid #0a1d2f",
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          cursor: "pointer",
          color: "white",
          gap: 10,
        }}
      >
        <LogoutOutlined />
        Logout
      </div>
    </Sider>
  );
};

export default SidebarMenu;
