import React, { useState } from "react";
import WarrantyCertificate from "../Components/WarrantyCertificate/WarrantyCertificate";
import PurchaseDetailsForm from "../Components/PurchaseDetail/PurchaseDetailForm";
import {
  Layout,
  Typography,
  Button,
  Card,
  Collapse,
  Tag,
  Row,
  Col,
  Avatar,
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Upload,
  message,
  Dropdown,
  Menu,
} from "antd";
import type { FormInstance } from "antd";
import {
  ShoppingOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  LeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import CommissioningData from "../Components/Commissioning/CommissioningForm";
import CommissioningForm from "../Components/Commissioning/CommissioningForm";
import PreCommissioningForm from "../Components/PreCommissioning/PreCommissioningForm";
import DocumentForm from "../Components/Documents/DocumentsForm";
import DeliveryForm from "../Components/DeliveryConfirmation/DeliveryForm";
import DispatchForm from "../Components/DispatchDetails/DispatchForm";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

type UserRole = "Sales Person" | "Delivery Person";

const OrderTrackingDetail: React.FC = () => {
  const [role, setRole] = useState<UserRole>("Sales Person");

  const [submittedData, setSubmittedData] = useState<any[]>([]);

  const handleSuccess = <T,>(
    formName: string,
    values: T,
    form: FormInstance<T>
  ) => {
    console.log(`${formName} Submitted:`, values);
    message.success(`${formName} submitted successfully!`);
    setSubmittedData((prev) => [...prev, { formName, ...values }]);
    form.resetFields();
  };

  const menu = (
    <Menu
      onClick={(e: { key: string }) => setRole(e.key as UserRole)}
      items={[
        { key: "Sales Person", label: "Sales Person" },
        { key: "Delivery Person", label: "Delivery Person" },
      ]}
    />
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9f7ff",
        padding: "24px",
      }}
    >
      {/* Header */}
      <Header
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Title level={4} style={{ margin: 0, color: "#000000" }}>
          Order Tracking System
        </Title>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              style={{
                borderColor: "#1890ff",
                color: "#1890ff",
                marginRight: 16,
              }}
            >
              {role} <DownOutlined />
            </Button>
          </Dropdown>
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {role === "Sales Person" ? "SP" : "DP"}
          </Avatar>
        </div>
      </Header>

      {/* Content */}
      <Content style={{ marginTop: 24 }}>
        <Card
          style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <Text style={{ color: "#1890ff", cursor: "pointer" }}>
            <LeftOutlined style={{ marginRight: 4 }} /> Back to Dashboard
          </Text>
        </Card>
        <div style={{ marginTop: 12 }}>
          <Title level={4} style={{ margin: 0 }}>
            Order ORD-001
          </Title>
          <Text type="secondary">ABC Corporation</Text>
        </div>

        <Collapse
          bordered={false}
          style={{ marginTop: 24 }}
          expandIconPosition="start"
        >
          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <ShoppingOutlined
                    style={{ color: "#6a1b9a", marginRight: 8 }}
                  />
                  <Text strong>Purchase Details</Text>
                </Col>
                <Col>
                  <Tag color="green">Completed</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="1"
          >
            {/* ⭐ PURCHASE DETAILS FORM */}
            <PurchaseDetailsForm />
          </Panel>

          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <TruckOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
                  <Text strong>Dispatch Details</Text>
                </Col>
                <Col>
                  <Tag color="orange">In Progress</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="2"
          >
            <DispatchForm products={[]} />
          </Panel>

          {/* Delivery Panel */}
          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <TruckOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
                  <Text strong>Delivery Confirmation</Text>
                </Col>
                <Col>
                  <Tag color="orange">In Progress</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="4"
          >
            <DeliveryForm />
          </Panel>

          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <CheckCircleOutlined
                    style={{ color: "#6a1b9a", marginRight: 8 }}
                  />
                  <Text strong>Document Confirmation</Text>
                </Col>
                <Col>
                  <Tag color="default">Pending</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="4"
          >
            <DocumentForm />
          </Panel>

          {/* Pre-Commissioning */}
          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <TruckOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
                  <Text strong>Pre-Commissioning</Text>
                </Col>
                <Col>
                  <Tag color="orange">In Progress</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="5"
          >
            <PreCommissioningForm serialNumbers={[]} />
          </Panel>

          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <CheckCircleOutlined
                    style={{ color: "#6a1b9a", marginRight: 8 }}
                  />
                  <Text strong> Commisioning </Text>
                </Col>
                <Col>
                  <Tag color="default">Pending</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="6"
          >
            <CommissioningForm />
          </Panel>

          <Panel
            header={
              <Row
                align="middle"
                justify="space-between"
                style={{ width: "100%" }}
              >
                <Col>
                  <CheckCircleOutlined
                    style={{ color: "#6a1b9a", marginRight: 8 }}
                  />
                  <Text strong>Warrenty Certificate</Text>
                </Col>
                <Col>
                  <Tag color="default">Pending</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="7"
          >
            <WarrantyCertificate />
          </Panel>
        </Collapse>

        {submittedData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Submitted Data</Title>
            {submittedData.map((item, index) => (
              <Card key={index} style={{ marginTop: 16 }}>
                <Text strong>{item.formName}</Text>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </Card>
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default OrderTrackingDetail;
