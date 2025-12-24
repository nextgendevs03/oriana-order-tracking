import type { ThemeConfig } from "antd";

// ========================================
// OSG Brand Colors - Refined & Elegant
// ========================================
export const colors = {
  // Primary Colors (Green - for main actions)
  primary: "#71a241",
  primaryLight: "#8cb85a",
  primaryDark: "#5d8736",
  primaryMuted: "#71a24115",

  // Accent Colors (Orange - sparingly for highlights)
  accent: "#ec6c25",
  accentLight: "#f5894d",
  accentDark: "#d45a1a",
  accentMuted: "#ec6c2510",

  // Sidebar - Elegant dark slate
  sidebarBg: "#1a1f2e",
  sidebarHover: "#252b3d",
  sidebarActive: "#2d3548",
  sidebarBorder: "#2d3548",

  // Neutral Colors - Refined palette
  white: "#ffffff",
  black: "#0f1419",
  
  // Warm grays for elegance
  gray50: "#fafbfc",
  gray100: "#f4f5f7",
  gray200: "#e8eaed",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",

  // Status Colors
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Background Colors
  bgLight: "#f8fafc",
  bgPage: "#f1f5f9",
  bgCard: "#ffffff",
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

    // Status colors
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    // Border radius - slightly softer
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Font - Clean, professional
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

    // Refined shadows
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
      "0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)",
  },
  components: {
    Button: {
      primaryShadow: "0 2px 4px rgba(113, 162, 65, 0.25)",
      defaultBorderColor: colors.gray300,
      fontWeight: 500,
    },
    Menu: {
      darkItemBg: "transparent",
      darkSubMenuItemBg: "transparent",
      darkItemSelectedBg: colors.sidebarActive,
      darkItemHoverBg: colors.sidebarHover,
      darkItemSelectedColor: colors.white,
      darkItemColor: "rgba(255, 255, 255, 0.7)",
    },
    Table: {
      headerBg: colors.gray50,
      headerColor: colors.gray700,
      rowHoverBg: colors.gray50,
      borderColor: colors.gray200,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Input: {
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primaryLight,
    },
    Select: {
      optionSelectedBg: colors.primaryMuted,
    },
  },
};

// ========================================
// Animation Variants for Framer Motion
// ========================================
export const animations = {
  // Page entrance - subtle
  pageEnter: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },

  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },

  // Scale on hover - subtle
  scaleHover: {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.15 },
  },

  // Button hover - refined
  buttonHover: {
    whileHover: { y: -1 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  },

  // Navbar entrance
  navbarEnter: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },

  // Menu item
  menuItem: {
    whileHover: { x: 2 },
    transition: { duration: 0.15 },
  },
};

// ========================================
// Styling Helpers
// ========================================
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
  card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  cardHover: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
  primary: "0 2px 8px rgba(113, 162, 65, 0.2)",
  accent: "0 2px 8px rgba(236, 108, 37, 0.15)",
};
