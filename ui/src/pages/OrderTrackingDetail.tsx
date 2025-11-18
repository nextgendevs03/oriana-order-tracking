import React, { useState } from "react";
// import PurchaseDetailsForm from "../Components/PurchaseDetailForm/PurchaseDetailsForm";
// import ParentComponent from "../Components/PurchaseDetailForm/Modal/Parent Component";
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
/* ------------------------------ Interfaces ------------------------------ */

interface DispatchFormValues {
  orderId: string;
  deliveryCount?: number;
  dispatchType?: "Single" | "Multiple";
  siteProjectName?: string;
  siteProjectLocation?: string;
  siteAddress?: string;
  siteMapLink?: string;
  deliveryQty?: number;
  confirmDispatchDate?: string;
  dispatchDate?: string;
}

interface DeliveryFormValues {
  orderId: string;
  noDuesClearance?: string;
  taxInvoiceNo?: string;
  invoiceDate?: string;
  ewayBill?: string;
  deliveryChallan?: string;
  dispatchDate?: string;
  packingList?: any;
}

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
            {/* Delivery Form — unchanged */}
            <Form
              layout="vertical"
              form={deliveryForm}
              onFinish={(values) =>
                handleSuccess("Delivery Confirmation", values, deliveryForm)
              }
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="orderId" label="Order ID" rules={[{ required: true }]}>
                    <Input placeholder="Enter Order ID" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="noDuesClearance" label="No Dues Clearance from Account">
                    <Select placeholder="Select Status">
                      <Option value="Pending">Pending</Option>
                      <Option value="Approved">Approved</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="taxInvoiceNo" label="Tax Invoice No">
                    <Input placeholder="Enter Tax Invoice No" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="invoiceDate" label="Invoice Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="ewayBill" label="E-Way Bill">
                    <Select placeholder="Select Option">
                      <Option value="Option1">Option 1</Option>
                      <Option value="Option2">Option 2</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="deliveryChallan" label="Delivery Challan">
                    <Select placeholder="Select Option">
                      <Option value="Option1">Option 1</Option>
                      <Option value="Option2">Option 2</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="dispatchDate" label="Dispatch Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="packingList" label="Packing List">
                    <Input placeholder="Enter Packing List Details" />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="end">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#6a1b9a",
                      borderColor: "#6a1b9a",
                      borderRadius: 8,
                    }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
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
              {/* <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="warrantyCertificateNo"
                    label="Warranty Certificate No"
                    rules={[{ required: true, message: "Enter certificate number" }]}
                  >
                    <Input placeholder="Enter Certificate Number" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="issueDate" label="Issue Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="warrantyStartDate" label="Warranty Start Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="warrantyEndDate" label="Warranty End Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item
                    name="sharedStatus"
                    label="Warranty Certificate Shared with Client"
                  >
                    <Select placeholder="Select Status">
                      <Option value="Done">Done</Option>
                      <Option value="Pending">Pending</Option>
                      <Option value="Hold">Hold</Option>
                      <Option value="Cancelled">Cancelled</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="remarks" label="Remarks">
                    <Input.TextArea rows={2} placeholder="Enter remarks..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="end">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#6a1b9a",
                      borderColor: "#6a1b9a",
                      borderRadius: 8,
                    }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row> */}
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
