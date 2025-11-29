import React, { useState } from "react";
import WarrantyCertificate from "../Components/WarrantyCertificate/WarrantyCertificate";
import {
  Layout,
  Typography,
  Card,
  Collapse,
  Tag,
  Row,
  Col,
} from "antd";
import {
  ShoppingOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import CommissioningForm from "../Components/Commissioning/CommissioningForm";
import PreCommissioningForm from "../Components/PreCommissioning/PreCommissioningForm";
import DocumentForm from "../Components/Documents/DocumentsForm";
import DeliveryForm from "../Components/DeliveryConfirmation/DeliveryForm";
import PurchaseOrderDetails from "../Components/PurchaseOrderDetails/PurchaseOrderDetails";
import DispatchDetails from "../Components/DispatchDetails/DispatchDetails";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

type UserRole = "Sales Person" | "Delivery Person";

const OrderTrackingDetail: React.FC = () => {
  const [role, setRole] = useState<UserRole>("Sales Person");

  const [submittedData, setSubmittedData] = useState<any[]>([]);


  return (
    <>
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
            <PurchaseOrderDetails />
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
            <DispatchDetails />
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
     
    </>
  );
};

export default OrderTrackingDetail;
