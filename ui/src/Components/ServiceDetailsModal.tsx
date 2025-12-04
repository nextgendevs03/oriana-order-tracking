import React, { useEffect, useState } from "react";
import { Modal, Tabs, Descriptions, Tag, Empty } from "antd";
import {
  ToolOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { PreCommissioning } from "../store/poSlice";

export type ServiceDetailsTab = "precommissioning" | "commissioning" | "warranty";

interface ServiceDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  preCommissioning: PreCommissioning | null;
  initialTab?: ServiceDetailsTab;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  visible,
  onClose,
  preCommissioning,
  initialTab = "precommissioning",
}) => {
  const [activeTab, setActiveTab] = useState<ServiceDetailsTab>(initialTab);

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

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      Done: "green",
      done: "green",
      Pending: "orange",
      pending: "orange",
      Hold: "blue",
      hold: "blue",
      Cancelled: "red",
      cancelled: "red",
      confirmed: "green",
      rejected: "red",
      in_progress: "processing",
    };
    return colorMap[status] || "default";
  };

  // Pre-Commissioning Tab Content
  const renderPreCommissioningDetails = () => {
    if (!preCommissioning) return <Empty description="No data available" />;

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
      >
        <Descriptions.Item label="PC ID">
          <Tag color="purple">{preCommissioning.id || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Dispatch ID">
          <Tag color="blue">{preCommissioning.dispatchId || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          <Tag color="geekblue">{preCommissioning.serialNumber || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {formatLabel(preCommissioning.product) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PC Contact">
          {preCommissioning.pcContact || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Service Engineer Assigned">
          {preCommissioning.serviceEngineerAssigned || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM/Checklist">
          {preCommissioning.ppmChecklist || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Sheet Received from Client">
          {preCommissioning.ppmSheetReceivedFromClient || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Checklist Shared with OEM">
          {preCommissioning.ppmChecklistSharedWithOem || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Ticked No from OEM">
          {preCommissioning.ppmTickedNoFromOem || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Confirmation Status">
          {preCommissioning.ppmConfirmationStatus ? (
            <Tag color={getStatusColor(preCommissioning.ppmConfirmationStatus)}>
              {formatLabel(preCommissioning.ppmConfirmationStatus)}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Pre-Commissioning Status">
          {preCommissioning.preCommissioningStatus ? (
            <Tag color={getStatusColor(preCommissioning.preCommissioningStatus)}>
              {formatLabel(preCommissioning.preCommissioningStatus)}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Remarks" span={2}>
          {preCommissioning.remarks || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {preCommissioning.createdAt
            ? new Date(preCommissioning.createdAt).toLocaleString()
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // Commissioning Tab Content
  const renderCommissioningDetails = () => {
    if (!preCommissioning) return <Empty description="No data available" />;

    const hasCommissioningData =
      preCommissioning.commissioningStatus ||
      preCommissioning.commissioningDate ||
      preCommissioning.commissioningEcdFromClient;

    if (!hasCommissioningData) {
      return <Empty description="No commissioning details available" />;
    }

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
      >
        <Descriptions.Item label="PC ID">
          <Tag color="purple">{preCommissioning.id || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          <Tag color="geekblue">{preCommissioning.serialNumber || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {formatLabel(preCommissioning.product) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Commissioning Status">
          {preCommissioning.commissioningStatus ? (
            <Tag color={getStatusColor(preCommissioning.commissioningStatus)}>
              {formatLabel(preCommissioning.commissioningStatus)}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="ECD from Client">
          {preCommissioning.commissioningEcdFromClient || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="CCD from Client">
          {preCommissioning.commissioningCcdFromClient || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Service Ticket No from OEM">
          {preCommissioning.commissioningServiceTicketNo || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Information Generated">
          {preCommissioning.commissioningInfoGenerated || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Commissioning Date">
          {preCommissioning.commissioningDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Issues in Commissioning" span={2}>
          {preCommissioning.commissioningIssues || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Solution on Issues" span={2}>
          {preCommissioning.commissioningSolution || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Remarks" span={2}>
          {preCommissioning.commissioningRemarks || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {preCommissioning.commissioningUpdatedAt
            ? new Date(preCommissioning.commissioningUpdatedAt).toLocaleString()
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // Warranty Certificate Tab Content
  const renderWarrantyDetails = () => {
    if (!preCommissioning) return <Empty description="No data available" />;

    const hasWarrantyData =
      preCommissioning.warrantyStatus ||
      preCommissioning.warrantyCertificateNo ||
      preCommissioning.warrantyStartDate;

    if (!hasWarrantyData) {
      return <Empty description="No warranty certificate details available" />;
    }

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
      >
        <Descriptions.Item label="PC ID">
          <Tag color="purple">{preCommissioning.id || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          <Tag color="geekblue">{preCommissioning.serialNumber || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {formatLabel(preCommissioning.product) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty Status">
          {preCommissioning.warrantyStatus ? (
            <Tag color={getStatusColor(preCommissioning.warrantyStatus)}>
              {formatLabel(preCommissioning.warrantyStatus)}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty Certificate No" span={2}>
          {preCommissioning.warrantyCertificateNo || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Issue Date">
          {preCommissioning.warrantyIssueDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty Start Date">
          {preCommissioning.warrantyStartDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty End Date">
          {preCommissioning.warrantyEndDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {preCommissioning.warrantyUpdatedAt
            ? new Date(preCommissioning.warrantyUpdatedAt).toLocaleString()
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const tabItems = [
    {
      key: "precommissioning",
      label: (
        <span>
          <ToolOutlined />
          Pre-Commissioning
        </span>
      ),
      children: renderPreCommissioningDetails(),
    },
    {
      key: "commissioning",
      label: (
        <span>
          <SettingOutlined />
          Commissioning
        </span>
      ),
      children: renderCommissioningDetails(),
    },
    {
      key: "warranty",
      label: (
        <span>
          <SafetyCertificateOutlined />
          Warranty Certificate
        </span>
      ),
      children: renderWarrantyDetails(),
    },
  ];

  return (
    <Modal
      title={`Service Details - ${preCommissioning?.id || ""}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as ServiceDetailsTab)}
        items={tabItems}
        style={{ marginTop: "8px" }}
      />
    </Modal>
  );
};

export default ServiceDetailsModal;

