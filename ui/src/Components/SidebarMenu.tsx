import React from "react";
import { Menu } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

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
        navigate("/product-management");
        break;
      case "3":
        // Add profile navigation if needed
        break;
      default:
        break;
    }
  };

  // Get the current selected key based on the route
  const getSelectedKey = () => {
    if (location.pathname === "/dashboard") return ["1"];
    if (location.pathname === "/user-management") return ["2-1"];
    if (location.pathname.startsWith("/product-management")) return ["2-2"];
    return ["1"];
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
          label: "Product Management", 
          icon: <AppstoreOutlined /> 
        }
      ]
    },
    { 
      key: "3", 
      icon: <UserOutlined />, 
      label: "Profile" 
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={getSelectedKey()}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ marginTop: 8 }}
    />
  );
};

export default SidebarMenu;
