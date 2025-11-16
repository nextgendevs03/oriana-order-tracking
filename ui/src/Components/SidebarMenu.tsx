import React from "react";
import { Menu } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

const SidebarMenu = () => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={[
        { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
        { key: "2", icon: <UserOutlined />, label: "Profile" },
      ]}
    />
  );
};

export default SidebarMenu;

