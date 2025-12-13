/**
 * Status Color Helpers
 * 
 * Common utility functions for determining tag colors based on status values.
 * Used across multiple components and pages for consistent status visualization.
 */

/**
 * Get color for payment status
 * @param status - Payment status string
 * @returns Ant Design Tag color
 */
export const getPaymentStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "advanced":
    case "received":
      return "green";
    case "pending":
      return "orange";
    case "15_dc":
    case "30_dc":
      return "blue";
    case "lc":
      return "purple";
    default:
      return "default";
  }
};

/**
 * Get color for PO (Purchase Order) status
 * @param status - PO status string
 * @returns Ant Design Tag color
 */
export const getPoStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "po_received":
      return "green";
    case "po_confirmed_phone":
      return "blue";
    case "on_call":
      return "orange";
    case "on_mail":
      return "purple";
    case "closed":
      return "red";
    default:
      return "default";
  }
};

/**
 * Get color for generic status (used in ServiceDetailsModal, PODetails)
 * @param status - Status string
 * @returns Ant Design Tag color
 */
export const getStatusColor = (status: string): string => {
  if (!status) return "default";

  const statusLower = status.toLowerCase();
  const colorMap: Record<string, string> = {
    done: "green",
    pending: "orange",
    hold: "blue",
    cancelled: "red",
    confirmed: "green",
    rejected: "red",
    in_progress: "processing",
  };

  return colorMap[statusLower] || "default";
};

/**
 * Get color for accordion status (Done, In-Progress, Not Started)
 * @param status - Accordion status string
 * @returns Ant Design Tag color
 */
export const getAccordionStatusColor = (status: string): string => {
  switch (status) {
    case "Done":
      return "green";
    case "In-Progress":
      return "orange";
    case "Not Started":
    default:
      return "default";
  }
};

/**
 * Get color for clearance status
 * @param status - Clearance status string
 * @returns Ant Design Tag color
 */
export const getClearanceStatusColor = (status: string): string => {
  if (!status) return "default";

  const statusLower = status.toLowerCase();
  const colorMap: Record<string, string> = {
    pending: "orange",
    approved: "green",
    rejected: "red",
    on_hold: "blue",
  };

  return colorMap[statusLower] || "default";
};

/**
 * Get color for dispatch status
 * @param status - Dispatch status string
 * @returns Ant Design Tag color
 */
export const getDispatchStatusColor = (status: string): string => {
  if (!status) return "default";

  const statusLower = status.toLowerCase();
  const colorMap: Record<string, string> = {
    done: "green",
    pending: "orange",
    hold: "blue",
    cancelled: "red",
  };

  return colorMap[statusLower] || "default";
};

/**
 * Get color for delivery status
 * @param status - Delivery status string
 * @returns Ant Design Tag color
 */
export const getDeliveryStatusColor = (status: string): string => {
  if (!status) return "default";

  const statusLower = status.toLowerCase();
  const colorMap: Record<string, string> = {
    done: "green",
    pending: "orange",
    hold: "blue",
    cancelled: "red",
  };

  return colorMap[statusLower] || "default";
};

/**
 * Get status color with type specification (used in DispatchDetailsModal)
 * @param status - Status string
 * @param type - Type of status: "clearance", "dispatch", or "delivery"
 * @returns Ant Design Tag color
 */
export const getStatusColorByType = (
  status: string,
  type: "clearance" | "dispatch" | "delivery" = "dispatch"
): string => {
  if (type === "clearance") {
    return getClearanceStatusColor(status);
  }

  if (type === "delivery") {
    return getDeliveryStatusColor(status);
  }

  return getDispatchStatusColor(status);
};
