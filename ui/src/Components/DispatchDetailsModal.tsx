import React, { useEffect, useState } from "react";
import { Modal, Tabs, Descriptions, Tag, Typography, Empty } from "antd";
import {
  TruckOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { DispatchDetail } from "../store/poSlice";

const { Text } = Typography;

export type DispatchDetailsTab = "dispatch" | "documents" | "delivery";

interface DispatchDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  dispatch: DispatchDetail | null;
  initialTab?: DispatchDetailsTab;
}

const DispatchDetailsModal: React.FC<DispatchDetailsModalProps> = ({
  visible,
  onClose,
  dispatch,
  initialTab = "dispatch",
}) => {
  const [activeTab, setActiveTab] = useState<DispatchDetailsTab>(initialTab);

  // Update active tab when initialTab changes
  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  const formatLabel = (value: string) => {
    if (!value) return "";
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusColor = (status: string, type: "clearance" | "dispatch" | "delivery" = "dispatch") => {
    if (type === "clearance") {
      const colorMap: Record<string, string> = {
        pending: "orange",
        approved: "green",
        rejected: "red",
        on_hold: "blue",
      };
      return colorMap[status] || "default";
    }
    
    const colorMap: Record<string, string> = {
      done: "green",
      pending: "orange",
      hold: "blue",
      cancelled: "red",
    };
    return colorMap[status] || "default";
  };

  // Dispatch Details Tab Content
  const renderDispatchDetails = () => {
    if (!dispatch) return <Empty description="No data available" />;

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "180px" }}
      >
        <Descriptions.Item label="Dispatch ID">
          <Tag color="blue">{dispatch.id || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Confirm Dispatch Date">
          {dispatch.confirmDispatchDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Project Name">
          {dispatch.projectName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Project Location">
          {dispatch.projectLocation || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Location">
          {dispatch.deliveryLocation || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Address">
          {dispatch.deliveryAddress || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Google Map Link">
          {dispatch.googleMapLink ? (
            <a
              href={dispatch.googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1890ff" }}
            >
              View Map
            </a>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Contact">
          {dispatch.deliveryContact || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Dispatched Items" span={2}>
          {dispatch.dispatchedItems && dispatch.dispatchedItems.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {dispatch.dispatchedItems.map((item, index) => (
                <Tag key={index} color="geekblue">
                  {formatLabel(item.product)}: {item.quantity}
                </Tag>
              ))}
            </div>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Remarks" span={2}>
          {dispatch.remarks || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {dispatch.createdAt
            ? new Date(dispatch.createdAt).toLocaleString()
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // Dispatch Documents Tab Content
  const renderDocumentDetails = () => {
    if (!dispatch) return <Empty description="No data available" />;

    const hasDocumentData = dispatch.dispatchStatus || dispatch.taxInvoiceNumber || dispatch.ewayBill;

    if (!hasDocumentData) {
      return <Empty description="No document details available" />;
    }

    return (
      <div>
        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          size="small"
          labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "180px" }}
          style={{ marginBottom: "16px" }}
        >
          <Descriptions.Item label="Dispatch ID">
            <Tag color="blue">{dispatch.id || "-"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="No Due Clearance">
            {dispatch.noDuesClearance ? (
              <Tag color={getStatusColor(dispatch.noDuesClearance, "clearance")}>
                {formatLabel(dispatch.noDuesClearance)}
              </Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="OSG PI No">
            {dispatch.docOsgPiNo || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="OSG PI Date">
            {dispatch.docOsgPiDate || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Tax Invoice No">
            {dispatch.taxInvoiceNumber || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Invoice Date">
            {dispatch.invoiceDate || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="E-way Bill">
            {dispatch.ewayBill || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Delivery Challan">
            {dispatch.deliveryChallan || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Dispatch Date">
            {dispatch.dispatchDate || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Dispatch Status">
            {dispatch.dispatchStatus ? (
              <Tag color={getStatusColor(dispatch.dispatchStatus)}>
                {formatLabel(dispatch.dispatchStatus)}
              </Tag>
            ) : (
              "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Dispatch LR No">
            {dispatch.dispatchLrNo || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Dispatch From Location">
            {dispatch.dispatchFromLocation || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Packaging List" span={2}>
            {dispatch.packagingList || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Dispatched Items" span={2}>
            {dispatch.dispatchedItems && dispatch.dispatchedItems.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {dispatch.dispatchedItems.map((item, index) => (
                  <Tag key={index} color="geekblue">
                    {formatLabel(item.product)}: {item.quantity}
                    {item.serialNumbers && (
                      <Text type="secondary" style={{ marginLeft: 4, fontSize: "12px" }}>
                        (S/N: {item.serialNumbers})
                      </Text>
                    )}
                  </Tag>
                ))}
              </div>
            ) : (
              "-"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Remarks" span={2}>
            {dispatch.dispatchRemarks || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {dispatch.documentUpdatedAt
              ? new Date(dispatch.documentUpdatedAt).toLocaleString()
              : "-"}
          </Descriptions.Item>
        </Descriptions>

        {/* Uploaded Documents Section */}
        {dispatch.dispatchDocuments && dispatch.dispatchDocuments.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <Text strong style={{ marginBottom: "8px", display: "block" }}>
              Uploaded Documents ({dispatch.dispatchDocuments.length})
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "8px",
                backgroundColor: "#fafafa",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #f0f0f0",
              }}
            >
              {dispatch.dispatchDocuments.map((doc, index) => {
                const ext = doc.name.split(".").pop()?.toLowerCase();
                const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext || "");
                const isPdf = ext === "pdf";
                const isExcel = ["xlsx", "xls"].includes(ext || "");
                const isWord = ["doc", "docx"].includes(ext || "");

                let iconColor = "#8c8c8c";
                if (isImage) iconColor = "#52c41a";
                else if (isPdf) iconColor = "#ff4d4f";
                else if (isExcel) iconColor = "#52c41a";
                else if (isWord) iconColor = "#1890ff";

                return (
                  <div
                    key={doc.uid || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    <FileTextOutlined style={{ fontSize: "16px", color: iconColor }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <Text ellipsis style={{ display: "block", maxWidth: "180px" }}>
                        {doc.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "11px" }}>
                        {(doc.size / 1024).toFixed(1)} KB
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Delivery Confirmation Tab Content
  const renderDeliveryDetails = () => {
    if (!dispatch) return <Empty description="No data available" />;

    const hasDeliveryData = dispatch.deliveryStatus || dispatch.dateOfDelivery;

    if (!hasDeliveryData) {
      return <Empty description="No delivery confirmation details available" />;
    }

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "180px" }}
      >
        <Descriptions.Item label="Dispatch ID">
          <Tag color="blue">{dispatch.id || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Status">
          {dispatch.deliveryStatus ? (
            <Tag color={getStatusColor(dispatch.deliveryStatus, "delivery")}>
              {formatLabel(dispatch.deliveryStatus)}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Delivery">
          {dispatch.dateOfDelivery || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Proof of Delivery">
          {dispatch.proofOfDelivery || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Dispatched Items" span={2}>
          {dispatch.dispatchedItems && dispatch.dispatchedItems.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {dispatch.dispatchedItems.map((item, index) => (
                <Tag key={index} color="geekblue">
                  {formatLabel(item.product)}: {item.quantity}
                  {item.serialNumbers && (
                    <Text type="secondary" style={{ marginLeft: 4, fontSize: "12px" }}>
                      (S/N: {item.serialNumbers})
                    </Text>
                  )}
                </Tag>
              ))}
            </div>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {dispatch.deliveryUpdatedAt
            ? new Date(dispatch.deliveryUpdatedAt).toLocaleString()
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const tabItems = [
    {
      key: "dispatch",
      label: (
        <span>
          <TruckOutlined />
          Dispatch Details
        </span>
      ),
      children: renderDispatchDetails(),
    },
    {
      key: "documents",
      label: (
        <span>
          <FileTextOutlined />
          Dispatch Documents
        </span>
      ),
      children: renderDocumentDetails(),
    },
    {
      key: "delivery",
      label: (
        <span>
          <CheckCircleOutlined />
          Delivery Confirmation
        </span>
      ),
      children: renderDeliveryDetails(),
    },
  ];

  return (
    <Modal
      title={`Dispatch Details - ${dispatch?.id || ""}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as DispatchDetailsTab)}
        items={tabItems}
        style={{ marginTop: "8px" }}
      />
    </Modal>
  );
};

export default DispatchDetailsModal;

