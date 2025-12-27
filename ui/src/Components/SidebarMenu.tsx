import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { motion } from "framer-motion";

interface SidebarMenuProps {
  collapsed?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine selected key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "1";
    if (path === "/summary-dashboard") return "1-1";
    if (path === "/user-management") return "2-1";
    if (path === "/role-management") return "2-2";
    if (path === "/permissions") return "2-3";
    if (path.includes("/product-management")) return "2-4";
    if (path === "/client-management") return "2-5";
    if (path === "/profile") return "3";
    return "1";
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1":
        navigate("/dashboard");
        break;
      case "1-1":
        navigate("/summary-dashboard");
        break;
      case "2-1":
        navigate("/user-management");
        break;
      case "2-2":
        navigate("/role-management");
        break;
      case "2-3":
        navigate("/permissions");
        break;
      case "2-4":
        navigate("/product-management");
        break;
      case "2-5":
        navigate("/client-management");
        break;
      case "3":
        navigate("/profile");
        break;
      case "4":
        navigate("/");
        break;
      default:
        break;
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: "1-1",
      icon: <BarChartOutlined />,
      label: "Summary Dashboard",
    },
    {
      key: "2",
      icon: <SettingOutlined />,
      label: "Admin",
      children: [
        { key: "2-1", label: "User Management", icon: <UserAddOutlined /> },
        { key: "2-2", label: "Role Management", icon: <KeyOutlined /> },
        {
          key: "2-3",
          label: "Permissions",
          icon: <SafetyCertificateOutlined />,
        },
        { key: "2-4", label: "Product Management", icon: <AppstoreOutlined /> },
        { key: "2-5", label: "Client Management", icon: <TeamOutlined /> },
      ],
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{ flex: 1, overflow: "auto" }}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={collapsed ? [] : ["2"]}
        items={menuItems}
        onClick={handleMenuClick}
        className="osg-menu"
        style={{
          background: "transparent",
          border: "none",
          padding: "8px 0",
        }}
        inlineCollapsed={collapsed}
      />
    </motion.div>
  );
};

export default SidebarMenu;
