import React from "react";
import { Menu } from "antd";
import { DashboardOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarMenuProps {
  collapsed?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine selected key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/" || path.includes("/po-details") || path.includes("/create-po")) {
      return "dashboard";
    }
    if (path === "/settings") {
      return "settings";
    }
    return "dashboard";
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      items={menuItems}
      style={{ marginTop: 8 }}
    />
  );
};

export default SidebarMenu;
