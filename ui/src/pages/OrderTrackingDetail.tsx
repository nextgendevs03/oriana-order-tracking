import React, { useState } from "react";
import WarrantyCertificate from "../Components/WarrantyCertificate/WarrantyCertificate";
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
  UploadOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

type UserRole = "Sales Person" | "Delivery Person";

const OrderTrackingDetail: React.FC = () => {
  const [role, setRole] = useState<UserRole>("Sales Person");

  // Frontend store for submitted forms
  const [submittedData, setSubmittedData] = useState<any[]>([]);

  // Common Success Handler
  const handleSuccess = <T,>(
    formName: string,
    values: T,
    form: FormInstance<T>
  ) => {
    console.log(`${formName} Submitted:`, values);
    message.success(`${formName} submitted successfully!`);
    setSubmittedData(prev => [...prev, { formName, ...values }]);
    form.resetFields();
  };

  // Dropdown menu
  const menu = (
    <Menu
      onClick={(e: { key: string }) =>
        setRole(e.key as UserRole)
      }
      items={[
        { key: "Sales Person", label: "Sales Person" },
        { key: "Delivery Person", label: "Delivery Person" },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f9f7ff", padding: "24px" }}>   

      {/* Content */}
      <Content style={{ marginTop: 24 }}>
        <Card style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Text style={{ color: "#1890ff", cursor: "pointer" }}>
            <LeftOutlined style={{ marginRight: 4 }} /> Back to Dashboard
          </Text>
</Card>
          <div style={{ marginTop: 12 }}>
            <Title level={4} style={{ margin: 0 }}>Order ORD-001</Title>
            <Text type="secondary">ABC Corporation</Text>
          </div>

          <Collapse bordered={false} style={{ marginTop: 24 }} expandIconPosition="start">
            {/* Purchase Panel */}
            <Panel
              header={
                <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                  <Col>
                    <ShoppingOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
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
            </Panel>

            {/* Dispatch Panel */}
            <Panel
              header={
                <Row align="middle" justify="space-between" style={{ width: "100%" }}>
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
            </Panel>        

{/* Delivery Panel */}
<Panel
  header={
    <Row align="middle" justify="space-between" style={{ width: "100%" }}>
      <Col>
        <CheckCircleOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
        <Text strong>Delivery Confirmation</Text>
      </Col>
      <Col>
        <Tag color="default">Pending</Tag>
        <EyeOutlined />
      </Col>
    </Row>
  }
  key="3"
>
</Panel>
       
            <Panel
              header={
                <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                  <Col>
                    <CheckCircleOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
                    <Text strong>Warrenty Certificate</Text>
                  </Col>
                  <Col>
                    <Tag color="default">Pending</Tag>
                    <EyeOutlined />
                  </Col>
                </Row>
              }
              key="4"
            >
<WarrantyCertificate/>
</Panel>
          </Collapse>

          {/* Frontend preview */}
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
  }
  
  export default OrderTrackingDetail;