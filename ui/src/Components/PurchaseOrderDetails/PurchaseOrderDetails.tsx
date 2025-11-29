import React from "react";
import {
  Typography,
  Descriptions,
  Tag,
  Table,
  Empty,
} from "antd";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import type { ColumnsType } from "antd/es/table";
import type { POItem, POData } from "../../store/poSlice";


const { Title } = Typography;

const PurchaseOrderDetails: React.FC = () => {
  const { poId } = useParams<{ poId: string }>();
  // Fetch PO from poList using poId from route params
  const poList = useAppSelector((state) => state.po.poList);

  // Find the PO by ID
  const selectedPO = poList.find((po: POData) => po.id === poId);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "po_received":
        return "green";
      case "po_confirmed_phone":
        return "blue";
      case "on_call":
        return "orange";
      case "on_mail":
        return "purple";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
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

  const formatLabel = (value: string) => {
    if (!value) return "";
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const itemColumns: ColumnsType<POItem> = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "OEM Name",
      dataIndex: "oemName",
      key: "oemName",
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Spare Qty",
      dataIndex: "spareQuantity",
      key: "spareQuantity",
    },
    {
      title: "Total Qty",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Price/Unit",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      title: "Warranty",
      dataIndex: "warranty",
      key: "warranty",
      render: (value) => formatLabel(value || ""),
    },
  ];

  if (!selectedPO) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="PO not found. Please select a valid PO from the dashboard." />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1rem",
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <Descriptions
        bordered
        column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
        size="small"
        labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa" }}
      >
        <Descriptions.Item label="PO Order ID">
          <Tag color="blue">{selectedPO.id}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Date">{selectedPO.date}</Descriptions.Item>
        <Descriptions.Item label="Client Name">
          {selectedPO.clientName}
        </Descriptions.Item>
        <Descriptions.Item label="OSG PI No">
          {selectedPO.osgPiNo}
        </Descriptions.Item>
        <Descriptions.Item label="OSG PI Date">
          {selectedPO.osgPiDate}
        </Descriptions.Item>
        <Descriptions.Item label="Client PO No">
          {selectedPO.clientPoNo}
        </Descriptions.Item>
        <Descriptions.Item label="Client PO Date">
          {selectedPO.clientPoDate}
        </Descriptions.Item>
        <Descriptions.Item label="PO Status">
          <Tag color={getStatusColor(selectedPO.poStatus)}>
            {formatLabel(selectedPO.poStatus)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="No of Dispatch">
          <Tag color="cyan">{formatLabel(selectedPO.noOfDispatch)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Client Address" span={2}>
          {selectedPO.clientAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Client Contact">
          {selectedPO.clientContact}
        </Descriptions.Item>
        <Descriptions.Item label="Site Location">
          {selectedPO.siteLocation}
        </Descriptions.Item>
        <Descriptions.Item label="OSC Support">
          <Tag color={selectedPO.oscSupport === "yes" ? "green" : "orange"}>
            {formatLabel(selectedPO.oscSupport)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <Tag color={getPaymentStatusColor(selectedPO.paymentStatus)}>
            {formatLabel(selectedPO.paymentStatus)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Dispatch Plan Date">
          {selectedPO.dispatchPlanDate}
        </Descriptions.Item>
        <Descriptions.Item label="Confirm Dispatch Date">
          {selectedPO.confirmDateOfDispatch}
        </Descriptions.Item>
        <Descriptions.Item label="Remarks" span={3}>
          {selectedPO.remarks}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {selectedPO.createdAt}
        </Descriptions.Item>
      </Descriptions>

      {/* Item Details Table */}
      {selectedPO.poItems && selectedPO.poItems.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <Title level={5} style={{ marginBottom: "1rem" }}>
            Item Details
          </Title>
          <Table
            columns={itemColumns}
            dataSource={selectedPO.poItems.map((item, index) => ({
              ...item,
              key: index,
            }))}
            pagination={false}
            bordered
            size="small"
            scroll={{ x: 900 }}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderDetails;
