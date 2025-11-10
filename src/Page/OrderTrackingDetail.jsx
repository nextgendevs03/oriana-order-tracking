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

const App = () => {
  const [role, setRole] = useState("Sales Person");
  const [purchaseForm] = Form.useForm();
  const [dispatchForm] = Form.useForm();
  const [deliveryForm] = Form.useForm();

  // ✅ Common Success Handler
  const handleSuccess = (formName, values, form) => {
    console.log(`${formName} Submitted:`, values);
    message.success(`${formName} submitted successfully!`);
    form.resetFields();
  };

  // Dropdown menu
  const menu = (
    <Menu
      onClick={(e) => setRole(e.key)}
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
      {/* 🔹 Header */}
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
          <Avatar style={{ backgroundColor: "#1890ff" }}>SP</Avatar>
        </div>
      </Header>

      {/* 🔹 Content */}
      <Content style={{ marginTop: 24 }}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Text style={{ color: "#1890ff", cursor: "pointer" }}>
            <LeftOutlined style={{ marginRight: 4 }} /> Back to Dashboard
          </Text>
          <div style={{ marginTop: 12 }}>
            <Title level={4} style={{ margin: 0 }}>
              Order ORD-001
            </Title>
            <Text type="secondary">ABC Corporation</Text>
          </div>

          <Collapse bordered={false} style={{ marginTop: 24 }} expandIconPosition="start">
            {/* 🟣 Purchase Details */}
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
              <Form
                layout="vertical"
                form={purchaseForm}
                onFinish={(values) =>
                  handleSuccess("Purchase Details", values, purchaseForm)
                }
                onFinishFailed={() =>
                  message.error("Please fill all required fields!")
                }
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="orderId" label="Order ID" rules={[{ required: true }]}>
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
                        <Option value="PO Confirmed on Phone">PO Confirmed on Phone</Option>
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
                    <Form.Item name="clientContact" label="Client Point of Contact">
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
                    <Form.Item name="productModel" label="Inverter/Product Model">
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
                      label="On Site Commissioning Support Required"
                    >
                      <Radio.Group>
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                        <Radio value="Maybe">Maybe</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="confirmDispatchDate" label="Confirm Date of Dispatch">
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="paymentStatus" label="Payment Receipt Status">
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

            {/* 🟡 Dispatch Details */}
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
              <Form
                layout="vertical"
                form={dispatchForm}
                onFinish={(values) =>
                  handleSuccess("Dispatch Details", values, dispatchForm)
                }
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="orderId" label="Order ID" rules={[{ required: true }]}>
                      <Input placeholder="Enter Order ID" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="deliveryCount" label="Delivery Count">
                      <Input placeholder="Enter Delivery Count" type="number" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="dispatchType" label="No of Dispatch">
                      <Radio.Group>
                        <Radio value="Single">Single</Radio>
                        <Radio value="Multiple">Multiple</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="siteProjectName" label="Site Wise Project Name">
                      <Input placeholder="Enter Project Name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="siteProjectLocation" label="Site Wise Project Location">
                      <Input placeholder="Enter Project Location" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="siteAddress" label="Site Delivery Address">
                      <Input.TextArea rows={2} placeholder="Enter Delivery Address" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="siteMapLink" label="Site Google Map Link">
                      <Input placeholder="Paste Google Map Link" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="deliveryQty" label="Site Wise Delivery Quantity">
                      <Input type="number" placeholder="Enter Quantity" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="confirmDispatchDate" label="Confirm Dispatch Date">
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="dispatchDate" label="Date">
                      <DatePicker style={{ width: "100%" }} />
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

            {/* 🟢 Delivery Confirmation */}
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
              <Form
                layout="vertical"
                form={deliveryForm}
                onFinish={(values) =>
                  handleSuccess("Delivery Confirmation", values, deliveryForm)
                }
                style={{ marginTop: 16 }}
              >
               <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="orderId"
                      label="Order ID"
                      rules={[{ required: true, message: "Please enter Order ID" }]}
                    >
                      <Input placeholder="Enter Order ID" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="noDuesClearance"
                      label="No Dues Clearance from Account"
                    >
                      <Select placeholder="Select Status">
                        <Option value="Pending">Pending</Option>
                        <Option value="Approved">Approved</Option>
                        <Option value="Option3">Option 3</Option>
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
                        <Option value="Option3">Option 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="deliveryChallan" label="Delivery Challan">
                      <Select placeholder="Select Option">
                        <Option value="Option1">Option 1</Option>
                        <Option value="Option2">Option 2</Option>
                        <Option value="Option3">Option 3</Option>
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
                    <Form.Item name="packingList" label="Packing List (Upload)">
                      <Upload>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
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
          </Collapse>
        </Card>
      </Content>
    </Layout>
  );
};

export default App;
