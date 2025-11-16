import React, { FC } from "react";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Card,
  Typography,
  Divider,
  message,
} from "antd";

import type { PurchaseFormValues } from "./purchaseForm.types";
import { ClearanceStatus } from "./purchaseForm.types";

const { Title } = Typography;

const PurchaseForm: FC = () => {
  const [form] = Form.useForm<PurchaseFormValues>();

  const onFinish = (values: PurchaseFormValues): void => {
    console.log("Form Data:", values);
    message.success("Form submitted successfully!");
  };

  const goBack = (): void => {
    window.history.back();
  };

  return (
    <div
      style={{
        backgroundColor: "#f3e9ff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 700,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
          Purchase details
        </Title>

        <Divider />

        <div
          style={{
            backgroundColor: "#673AB7",
            color: "white",
            padding: "10px 16px",
            borderRadius: 6,
            fontWeight: 500,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Document preparation form
        </div>

        <Form<PurchaseFormValues>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          {/* No dues clearance */}
          <Form.Item
            label="No dues clearance from account"
            name="clearance"
            rules={[{ required: true, message: "Please select clearance status" }]}
          >
            <Radio.Group style={{ display: "flex", flexDirection: "column" }}>
              <Radio value={"Pending" satisfies ClearanceStatus}>Pending</Radio>
              <Radio value={"Approved" satisfies ClearanceStatus}>Approved</Radio>
              <Radio value={"Option 3" satisfies ClearanceStatus}>Option 3</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Tax Invoice No */}
          <Form.Item
            label="Tax invoice no"
            name="taxInvoiceNo"
            rules={[{ required: true, message: "Please enter invoice number" }]}
          >
            <Input placeholder="Your answer" />
          </Form.Item>

          {/* Invoice Date */}
          <Form.Item
            label="Invoice date"
            name="invoiceDate"
            rules={[{ required: true, message: "Please select invoice date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          {/* E-Way Bill */}
          <Form.Item
            label="E-Way bill"
            name="eWayBill"
            rules={[{ required: true, message: "Please enter E-Way bill" }]}
          >
            <Input placeholder="Option 1" />
          </Form.Item>

          {/* Delivery Challan */}
          <Form.Item
            label="Delivery challan"
            name="deliveryChallan"
            rules={[{ required: true, message: "Please enter delivery challan" }]}
          >
            <Input placeholder="Option 1" />
          </Form.Item>

          {/* Dispatch Date */}
          <Form.Item
            label="Dispatch date"
            name="dispatchDate"
            rules={[{ required: true, message: "Please select dispatch date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          {/* Packing List */}
          <Form.Item
            label="Packing List"
            name="packingList"
            rules={[{ required: true, message: "Please enter packing list" }]}
          >
            <Input placeholder="Your answer" />
          </Form.Item>

          {/* Buttons */}
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
              }}
            >
              <Button onClick={goBack}>Back</Button>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#673AB7",
                  borderColor: "#673AB7",
                }}
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PurchaseForm;
