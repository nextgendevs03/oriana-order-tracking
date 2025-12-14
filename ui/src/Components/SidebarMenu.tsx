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
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

interface SidebarMenuProps {
  collapsed?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1":
        navigate("/dashboard");
        break;
      case "1-1":
        navigate("/summary-dashboard");
        break;

      // Admin
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
        { key: "2-3", label: "Permissions", icon: <SafetyCertificateOutlined /> },
        { key: "2-4", label: "Product Management", icon: <AppstoreOutlined /> },
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
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={["2"]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{
        background: "#001529",
        flex: 1,
        borderRight: 0,
      }}
      inlineCollapsed={collapsed}
    />
  );
};

export default SidebarMenu;
