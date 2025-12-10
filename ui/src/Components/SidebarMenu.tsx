import React from "react";
import { Menu } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1":
        navigate("/dashboard");
        break;
      case "2-1":
        navigate("/user-management");
        break;
      case "2-2":
        navigate("/role-management");
        break;
      case "2-3":
        navigate("/admin/permissions");
        break;
      default:
        break;
    }
  };

  const menuItems: MenuProps["items"] = [
    { 
      key: "1", 
      icon: <HomeOutlined />, 
      label: "Dashboard" 
    },
    { 
      key: "2", 
      icon: <SettingOutlined />, 
      label: "Admin",
      children: [
        { 
          key: "2-1", 
          label: "User Management", 
          icon: <UserOutlined /> 
        },
        { 
          key: "2-2", 
          label: "Role Management", 
          icon: <UserOutlined /> 
        },
        { 
          key: "2-3", 
          label: "Permissions", 
          icon: <UserOutlined /> 
        },
      ]
    },
    { 
      key: "3", 
      icon: <UserOutlined />, 
      label: "Profile" 
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
        onClick={handleMenuClick}
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
