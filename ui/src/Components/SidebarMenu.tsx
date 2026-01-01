import { useMemo } from "react";
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
import { usePermissionUtils } from "../hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { useToast } from "../hooks/useToast";

interface SidebarMenuProps {
  collapsed?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { hasPermission } = usePermissionUtils();

  // Check permissions for Admin menu visibility
  const canViewUsers = hasPermission(PERMISSIONS.USERS_READ);
  const canViewProducts = hasPermission(PERMISSIONS.PRODUCT_READ);
  const showAdminMenu = canViewUsers || canViewProducts;

  /**
   * Handle logout action
   * Clears all storage and Redux state, then redirects to login
   */
  const handleLogout = () => {
    try {
      // Clear sessionStorage
      sessionStorage.clear();

      // Clear localStorage
      localStorage.clear();

      // Clear Redux state (logout action also sets isLoggedIn to false)
      dispatch(logout());

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to login page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An error occurred during logout");
      // Still redirect to login even if there's an error
      navigate("/", { replace: true });
    }
  };

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
        handleLogout();
        break;
      default:
        break;
    }
  };

  // Build Admin submenu items based on permissions
  const adminChildren = useMemo(() => {
    const children: MenuProps["items"] = [];

    if (canViewUsers) {
      children.push(
        { key: "2-1", label: "User Management", icon: <UserAddOutlined /> },
        { key: "2-2", label: "Role Management", icon: <KeyOutlined /> },
        {
          key: "2-3",
          label: "Permissions",
          icon: <SafetyCertificateOutlined />,
        }
      );
    }

    if (canViewProducts) {
      children.push(
        { key: "2-4", label: "Product Management", icon: <AppstoreOutlined /> },
        { key: "2-5", label: "Client Management", icon: <TeamOutlined /> }
      );
    }

    return children;
  }, [canViewUsers, canViewProducts]);

  // Build menu items based on permissions
  const menuItems: MenuProps["items"] = useMemo(() => {
    const items: MenuProps["items"] = [
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
    ];

    // Only show Admin menu if user has permission to see any admin items
    if (showAdminMenu && adminChildren.length > 0) {
      items.push({
        key: "2",
        icon: <SettingOutlined />,
        label: "Admin",
        children: adminChildren,
      });
    }

    items.push(
      {
        key: "3",
        icon: <UserOutlined />,
        label: "Profile",
      },
      {
        key: "4",
        icon: <LogoutOutlined />,
        label: "Logout",
      }
    );

    return items;
  }, [showAdminMenu, adminChildren]);

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
        defaultOpenKeys={collapsed ? [] : showAdminMenu ? ["2"] : []}
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
