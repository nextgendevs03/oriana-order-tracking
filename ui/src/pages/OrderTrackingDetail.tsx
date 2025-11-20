import React, { useState } from "react";
import WarrantyForm from "../Components/Warranty/WarrantyForm";
import ParentComponent from "../Components/Warranty/Model/ParentComponent";

import WarrantyModal from "../Components/Warranty/Model/WarrantyModal";
import ItemModal from "../Components/Warranty/Model/ItemModal";
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

/* ⭐ NEW WARRANTY INTERFACE */
interface WarrantyFormValues {
  orderId: string;
  warrantyCertificateNo?: string;
  issueDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  sharedStatus?: string;
  remarks?: string;
}

type UserRole = "Sales Person" | "Delivery Person";

/* ------------------------------ MAIN COMPONENT ------------------------------ */

const OrderTrackingDetail: React.FC = () => {
  const [role, setRole] = useState<UserRole>("Sales Person");

  const [purchaseForm] = Form.useForm<any>();
  const [dispatchForm] = Form.useForm<any>();
  const [deliveryForm] = Form.useForm<any>();
  const [warrantyForm] = Form.useForm<any>(); // ⭐ Warranty Form Instance

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

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f9f7ff", padding: "24px" }}>
      <Content style={{ marginTop: 24 }}>
        <Card style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Text style={{ color: "#1890ff", cursor: "pointer" }}>
            <LeftOutlined style={{ marginRight: 4 }} /> Back to Dashboard
          </Text>
        </Card>

        <div style={{ marginTop: 12 }}>
          <Title level={4}>Order ORD-001</Title>
          <Text type="secondary">ABC Corporation</Text>
        </div>

        <Collapse bordered={false} style={{ marginTop: 24 }} expandIconPosition="start">
          {/* 1️⃣ PURCHASE DETAILS */}
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
            {/* <PurchaseDetailsForm form={purchaseForm} /> */}
          </Panel>

          {/* 2️⃣ DISPATCH DETAILS */}
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
            {/* Your Dispatch form (same as before) */}
          </Panel>

          {/* 3️⃣ DELIVERY CONFIRMATION */}
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

          {/* 4️⃣ WARRANTY PANEL */}
          <Panel
            header={
              <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                <Col>
                  <CheckCircleOutlined style={{ color: "#6a1b9a", marginRight: 8 }} />
                  <Text strong>Warranty Details</Text>
                </Col>
                <Col>
                  <Tag color="blue">Pending</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="4"
          >
            <Form
              layout="vertical"
              form={warrantyForm}
              onFinish={(values) =>
                handleSuccess("Warranty Details", values, warrantyForm)
              }
             > 
          </Form> 
          </Panel>
        </Collapse>
       <ParentComponent/>

        {/* Submitted Data */}
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
