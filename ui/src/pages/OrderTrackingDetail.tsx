import React, { useState } from "react";
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
import DispatchForm from "../Components/DispatchDetails/DispatchForm";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

// TypeScript Interfaces
interface PurchaseFormValues {
  orderId: string;
  date?: string;
  salesPerson?: string;
  clientName?: string;
  osgPiNo?: string;
  osgPiDate?: string;
  poStatus?: string;
  clientPoNo?: string;
  poDate?: string;
  dispatchType?: "Single" | "Multiple";
  clientAddress?: string;
  clientContact?: string;
  oemName?: string;
  productModel?: string;
  totalQty?: number;
  spareQty?: number;
  warranty?: string;
  dispatchPlanDate?: string;
  siteLocation?: string;
  onSiteSupport?: "Yes" | "No" | "Maybe";
  confirmDispatchDate?: string;
  paymentStatus?: string;
  remarks?: string;
}

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

type UserRole = "Sales Person" | "Delivery Person";

const OrderTrackingDetail: React.FC = () => {
  const [role, setRole] = useState<UserRole>("Sales Person");

  const [purchaseForm] = Form.useForm<PurchaseFormValues>();
  const [dispatchForm] = Form.useForm<DispatchFormValues>();
  const [deliveryForm] = Form.useForm<DeliveryFormValues>();

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
    setSubmittedData((prev) => [...prev, { formName, ...values }]);
    form.resetFields();
  };

  // Dropdown menu
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
      {/* <Header
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
            <Button style={{ borderColor: "#1890ff", color: "#1890ff", marginRight: 16 }}>
              {role} <DownOutlined />
            </Button>
          </Dropdown>
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {role === "Sales Person" ? "SP" : "DP"}
          </Avatar>
        </div>
      </Header> */}

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
          {/* Purchase Panel */}
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
            <Form<PurchaseFormValues>
              layout="vertical"
              form={purchaseForm}
              onFinish={(values: PurchaseFormValues) =>
                handleSuccess("Purchase Details", values, purchaseForm)
              }
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="orderId"
                    label="Order ID"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter Order ID" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="date" label="Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salesPerson" label="Sales Person">
                    <Select placeholder="Select">
                      <Option value="Ajay">Ajay</Option>
                      <Option value="Kishor">Kishor</Option>
                      <Option value="Ajay2">Ajay2</Option>
                      <Option value="Kishor2">Kishor2</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="clientName" label="Client Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="osgPiNo" label="OSG PI No">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="osgPiDate" label="OSG PI Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="poStatus" label="PO Status">
                    <Select placeholder="Select">
                      <Option value="PO Received">PO Received</Option>
                      <Option value="PO Confirmed on Phone">
                        PO Confirmed on Phone
                      </Option>
                      <Option value="On Call">On Call</Option>
                      <Option value="On Mail">On Mail</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="clientPoNo" label="Client PO No">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="poDate" label="PO Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="dispatchType" label="No Of Dispatch">
                    <Radio.Group>
                      <Radio value="Single">Single</Radio>
                      <Radio value="Multiple">Multiple</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="clientAddress" label="Client Address">
                    <Input.TextArea rows={1} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="clientContact"
                    label="Client Point of Contact"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="oemName" label="OEM Name">
                    <Select placeholder="Select">
                      <Option value="Sieneng">Sieneng</Option>
                      <Option value="Solis">Solis</Option>
                      <Option value="Jio">Jio</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="productModel" label="Product Model">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="totalQty" label="Total Quantity Ordered">
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="spareQty" label="Spare Quantity">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="warranty" label="Warranty Period">
                    <Select>
                      <Option value="1 Year">1 Year</Option>
                      <Option value="2 Years">2 Years</Option>
                      <Option value="3 Years">3 Years</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="dispatchPlanDate" label="Dispatch Plan Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="siteLocation" label="Site Location">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="onSiteSupport"
                    label="On Site Support Required"
                  >
                    <Radio.Group>
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                      <Radio value="Maybe">Maybe</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="confirmDispatchDate"
                    label="Confirm Dispatch Date"
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="paymentStatus"
                    label="Payment Receipt Status"
                  >
                    <Select>
                      <Option value="Advance">Advance</Option>
                      <Option value="Received">Received</Option>
                      <Option value="Pending">Pending</Option>
                      <Option value="15 Days Credit">15 Days Credit</Option>
                      <Option value="30 Days Credit">30 Days Credit</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item name="remarks" label="Remark">
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
              </Row>
            </Form>
          </Panel>

          {/* Dispatch Panel */}
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

          {/* Delivery Panel
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
              <Form<DeliveryFormValues>
                layout="vertical"
                form={deliveryForm}
                onFinish={(values: DeliveryFormValues) => handleSuccess("Delivery Confirmation", values, deliveryForm)}
              >
                <Row gutter={16}>
                  <Col span={8}><Form.Item name="orderId" label="Order ID" rules={[{ required: true }]}><Input placeholder="Enter Order ID" /></Form.Item></Col>
                  <Col span={8}><Form.Item name="noDuesClearance" label="No Dues Clearance from Account"><Select placeholder="Select Status">
                    <Option value="Pending">Pending</Option>
                    <Option value="Approved">Approved</Option>
                    <Option value="Option3">Option 3</Option>
                  </Select></Form.Item></Col>
                  <Col span={8}><Form.Item name="taxInvoiceNo" label="Tax Invoice No"><Input placeholder="Enter Tax Invoice No" /></Form.Item></Col>
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
                        <Option value="Option3">Option 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  </Select></Form.Item>
                  <Col>
                  <Col span={8}><Form.Item name="deliveryChallan" label="Delivery Challan"><Select placeholder="Select Option">
                    <Option value="Option1">Option 1</Option>
                    <Option value="Option2">Option 2</Option>
                    <Option value="Option3">Option 3</Option>
                  </Select></Form.Item></Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}><Form.Item name="dispatchDate" label="Dispatch Date"><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
                  <Col span={8}><Form.Item name="packingList" label="Packing List">
                 <Input placeholder="Enter Packing List Details" />
                 </Form.Item>
                 </Col>
                </Row>

                <Row justify="end">
                  <Col>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a", borderRadius: 8 }}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Panel> */}

          {/* Delivery Panel */}

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
                  <Text strong>Dispatch Confirmation</Text>
                </Col>
                <Col>
                  <Tag color="default">Pending</Tag>
                  <EyeOutlined />
                </Col>
              </Row>
            }
            key="3"
          ></Panel>
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
};

export default OrderTrackingDetail;
