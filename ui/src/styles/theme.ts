import type { ThemeConfig } from "antd";

// ========================================
// OSG Brand Colors
// ========================================
export const colors = {
  // Primary Colors
  primary: "#71a241", // Green - Primary buttons, CTAs
  primaryLight: "#8fc05a",
  primaryDark: "#5a8234",

  // Accent Colors
  accent: "#ec6c25", // Orange - Highlights, hover states
  accentLight: "#f5924d",
  accentDark: "#d45a1a",

  // Sidebar Gradient
  sidebarGradientStart: "#ec6c25", // Orange (top)
  sidebarGradientEnd: "#71a241", // Green (bottom)

  // Neutral Colors
  white: "#ffffff",
  black: "#000000",
  gray50: "#fafafa",
  gray100: "#f5f5f5",
  gray200: "#e8e8e8",
  gray300: "#d9d9d9",
  gray400: "#bfbfbf",
  gray500: "#8c8c8c",
  gray600: "#595959",
  gray700: "#434343",
  gray800: "#262626",
  gray900: "#1f1f1f",

  // Status Colors
  success: "#71a241",
  warning: "#ec6c25",
  error: "#ff4d4f",
  info: "#1890ff",

  // Background Colors
  bgLight: "#f8f9fa",
  bgDark: "#0f1419",
};

// ========================================
// Ant Design Theme Configuration
// ========================================
export const antTheme: ThemeConfig = {
  token: {
    // Primary color (Green)
    colorPrimary: colors.primary,
    colorPrimaryHover: colors.primaryLight,
    colorPrimaryActive: colors.primaryDark,

    // Link colors
    colorLink: colors.primary,
    colorLinkHover: colors.primaryLight,
    colorLinkActive: colors.primaryDark,

    // Success/Warning colors
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Font
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

    // Shadows
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    boxShadowSecondary: "0 4px 16px rgba(0, 0, 0, 0.12)",
  },
  components: {
    Button: {
      primaryShadow: "0 4px 12px rgba(113, 162, 65, 0.3)",
      defaultBorderColor: colors.gray300,
      fontWeight: 600,
    },
    Menu: {
      darkItemBg: "transparent",
      darkSubMenuItemBg: "transparent",
      darkItemSelectedBg: "rgba(255, 255, 255, 0.15)",
      darkItemHoverBg: "rgba(255, 255, 255, 0.1)",
      darkItemSelectedColor: colors.white,
      darkItemColor: "rgba(255, 255, 255, 0.85)",
    },
    Table: {
      headerBg: colors.gray50,
      headerColor: colors.gray700,
      rowHoverBg: colors.gray50,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Input: {
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primaryLight,
    },
    Select: {
      optionSelectedBg: `${colors.primary}15`,
    },
  },
};

// ========================================
// Animation Variants for Framer Motion
// ========================================
export const animations = {
  // Page entrance
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  },

  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Scale on hover
  scaleHover: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },

  // Button hover
  buttonHover: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },

  // Navbar entrance
  navbarEnter: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // Sidebar menu item
  menuItem: {
    whileHover: { x: 4 },
    transition: { duration: 0.2 },
  },
};

// ========================================
// Gradient Definitions
// ========================================
export const gradients = {
  sidebar: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.accentDark} 30%, ${colors.primaryDark} 70%, ${colors.primary} 100%)`,
  sidebarSubtle: `linear-gradient(180deg, rgba(236, 108, 37, 0.9) 0%, rgba(90, 130, 52, 0.95) 100%)`,
  header: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
  headerReverse: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
  button: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  accentButton: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
};

