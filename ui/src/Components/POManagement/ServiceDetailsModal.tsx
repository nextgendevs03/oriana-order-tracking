import React, { useEffect, useState } from "react";
import { Modal, Tabs, Descriptions, Tag, Empty, Button, Space } from "antd";
import {
  ToolOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type {
  PreCommissioningResponse,
  CommissioningResponse,
  WarrantyCertificateResponse,
} from "@OrianaTypes";
import { formatLabel, getStatusColor } from "../../utils";
import { useLazyGetDownloadUrlQuery } from "../../store/api/fileApi";

export type ServiceDetailsTab =
  | "precommissioning"
  | "commissioning"
  | "warranty";

type ServiceDetailsData =
  | PreCommissioningResponse
  | CommissioningResponse
  | WarrantyCertificateResponse;

interface ServiceDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  data: ServiceDetailsData | null;
  initialTab?: ServiceDetailsTab;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  visible,
  onClose,
  data,
  initialTab = "precommissioning",
}) => {
  const [activeTab, setActiveTab] = useState<ServiceDetailsTab>(initialTab);
  const [getDownloadUrl] = useLazyGetDownloadUrlQuery();

  // Update active tab when initialTab changes
  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  const handleDownloadFile = async (fileId: number) => {
    try {
      const result = await getDownloadUrl(fileId).unwrap();
      window.open(result.downloadUrl, "_blank");
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  // Type guards
  const isPreCommissioning = (d: ServiceDetailsData): d is PreCommissioningResponse => {
    return "preCommissioningId" in d;
  };

  const isCommissioning = (d: ServiceDetailsData): d is CommissioningResponse => {
    return "commissioningId" in d && !("warrantyCertificateId" in d);
  };

  const isWarrantyCertificate = (d: ServiceDetailsData): d is WarrantyCertificateResponse => {
    return "warrantyCertificateId" in d;
  };

  // Render file list
  const renderFiles = (files?: { fileId: number; originalFileName: string }[]) => {
    if (!files || files.length === 0) return "-";
    return (
      <Space direction="vertical" size="small">
        {files.map((file) => (
          <Button
            key={file.fileId}
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadFile(file.fileId)}
            style={{ padding: 0 }}
          >
            {file.originalFileName}
          </Button>
        ))}
      </Space>
    );
  };

  // Pre-Commissioning Tab Content
  const renderPreCommissioningDetails = () => {
    if (!data || !isPreCommissioning(data)) {
      return <Empty description="No pre-commissioning data available" />;
    }

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
      >
        <Descriptions.Item label="PC ID">
          <Tag color="purple">{data.preCommissioningId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Dispatch ID">
          <Tag color="blue">{data.dispatchId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          <Tag color="geekblue">{data.serialNumber}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {formatLabel(data.productName) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PC Contact">
          {data.pcContact || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Service Engineer Assigned">
          {data.serviceEngineerAssigned || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM/Checklist">
          {data.ppmChecklist || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Sheet Received from Client">
          {data.ppmSheetReceivedFromClient || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Checklist Shared with OEM">
          {data.ppmChecklistSharedWithOem || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Ticked No from OEM">
          {data.ppmTickedNoFromOem || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="PPM Confirmation Status">
          {data.ppmConfirmationStatus ? (
            <Tag color={getStatusColor(data.ppmConfirmationStatus)}>
              {formatLabel(data.ppmConfirmationStatus)}
            </Tag>
          ) : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Pre-Commissioning Status">
          {data.preCommissioningStatus ? (
            <Tag color={getStatusColor(data.preCommissioningStatus)}>
              {formatLabel(data.preCommissioningStatus)}
            </Tag>
          ) : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="OEM Comments" span={2}>
          {data.oemComments || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Remarks" span={2}>
          {data.remarks || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Documents" span={2}>
          {renderFiles(data.files)}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // Commissioning Tab Content
  const renderCommissioningDetails = () => {
    if (!data || !isCommissioning(data)) {
      return <Empty description="No commissioning data available" />;
    }

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
      >
        <Descriptions.Item label="Commissioning ID">
          <Tag color="purple">{data.commissioningId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Pre-Commissioning ID">
          <Tag color="blue">{data.preCommissioningId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          <Tag color="geekblue">{data.serialNumber || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {formatLabel(data.productName) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Commissioning Status">
          {data.commissioningStatus ? (
            <Tag color={getStatusColor(data.commissioningStatus)}>
              {formatLabel(data.commissioningStatus)}
            </Tag>
          ) : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Commissioning Date">
          {data.commissioningDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="ECD from Client">
          {data.ecdFromClient || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="CCD from Client">
          {data.ccdFromClient || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Service Ticket No">
          {data.serviceTicketNo || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Info Generated">
          {data.infoGenerated || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Issues" span={2}>
          {data.issues || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Solution" span={2}>
          {data.solution || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Remarks" span={2}>
          {data.remarks || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Documents" span={2}>
          {renderFiles(data.files)}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // Warranty Certificate Tab Content
  const renderWarrantyDetails = () => {
    if (!data || !isWarrantyCertificate(data)) {
      return <Empty description="No warranty certificate data available" />;
    }

    return (
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
      >
        <Descriptions.Item label="Warranty Certificate ID">
          <Tag color="purple">{data.warrantyCertificateId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Commissioning ID">
          <Tag color="blue">{data.commissioningId}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          <Tag color="geekblue">{data.serialNumber || "-"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {formatLabel(data.productName) || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty Status">
          {data.warrantyStatus ? (
            <Tag color={getStatusColor(data.warrantyStatus)}>
              {formatLabel(data.warrantyStatus)}
            </Tag>
          ) : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Certificate No">
          {data.certificateNo || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Issue Date">
          {data.issueDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty Start Date">
          {data.warrantyStartDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Warranty End Date">
          {data.warrantyEndDate || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Documents" span={2}>
          {renderFiles(data.files)}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // Get title based on data type
  const getTitle = () => {
    if (!data) return "Service Details";
    if (isPreCommissioning(data)) return `Pre-Commissioning Details - #${data.preCommissioningId}`;
    if (isCommissioning(data)) return `Commissioning Details - #${data.commissioningId}`;
    if (isWarrantyCertificate(data)) return `Warranty Certificate - #${data.warrantyCertificateId}`;
    return "Service Details";
  };

  const tabItems = [
    {
      key: "precommissioning",
      label: (
        <span>
          <ToolOutlined /> Pre-Commissioning
        </span>
      ),
      children: renderPreCommissioningDetails(),
      disabled: data ? !isPreCommissioning(data) : true,
    },
    {
      key: "commissioning",
      label: (
        <span>
          <SettingOutlined /> Commissioning
        </span>
      ),
      children: renderCommissioningDetails(),
      disabled: data ? !isCommissioning(data) : true,
    },
    {
      key: "warranty",
      label: (
        <span>
          <SafetyCertificateOutlined /> Warranty Certificate
        </span>
      ),
      children: renderWarrantyDetails(),
      disabled: data ? !isWarrantyCertificate(data) : true,
    },
  ];

  return (
    <Modal
      title={getTitle()}
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
