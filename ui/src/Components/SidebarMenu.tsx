import React from "react";
import { Menu, Tooltip } from "antd";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
interface SidebarMenuProps {
  collapsed: boolean;
}
const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed }) => {
  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "2", icon: <SettingOutlined />, label: "Settings" },
  ];

  return (
    <div
      className={`h-screen flex flex-col transition-all duration-300 text-white ${
        collapsed ? "w-16" : "w-56"
      }`}
      style={{ backgroundColor: "#021C39" }}
    >
      {/* Brand Box */}
      <div
        className="mb-4 flex items-center transition-all duration-300"
        style={{
          backgroundColor: "#0A2D55", 
          color: "#FFFFFF",
          margin: "12px",
          height: 30,
          borderRadius: 10,
          paddingLeft: collapsed ? 0 : 12,
          maxWidth: collapsed ? "100%" : 140, 
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              lineHeight: "30px", 
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis", 
            }}
          >
            OSG India
          </span>
        )}
      </div>

      {/* Menu Items */}
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ flex: 1, borderRight: 0, backgroundColor: "#021C39" }}
      >
        {menuItems.map((item) =>
          collapsed ? (
            <Tooltip title={item.label} placement="right" key={item.key}>
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={{ textAlign: "center" }}
              />
            </Tooltip>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          )
        )}
      </Menu>
    </div>
  );
};

export default SidebarMenu;