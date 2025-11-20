import React, { useState } from "react";
import WarrantyCertificate from "../Components/WarrantyCertificate/WarrantyCertificate";
import ModalWarrantyCertificate from "../Components/WarrantyCertificate/Modals/ModalWarrantyCertificate";
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
  {/* <Form<DeliveryFormValues>
    layout="vertical"
    form={deliveryForm}
    onFinish={(values: DeliveryFormValues) =>
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
          style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a", borderRadius: 8 }}
        >
          Submit
        </Button>
      </Col>
    </Row>
  </Form> */}
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