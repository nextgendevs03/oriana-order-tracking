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
} from "antd";

import { DispatchFormValues } from "./types/dispatch.types";

const { Title, Text } = Typography;

const DispatchForm: FC = () => {
  const [form] = Form.useForm<DispatchFormValues>();

  const onFinish = (values: DispatchFormValues) => {
    console.log("Form Data:", values);
  };

  const handleBack = () => {
    console.log("Back clicked");
  };

  return (
    <div
      style={{
        backgroundColor: "#f3e8ff",
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
          Dispatch / Project Details
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
          Not shared — Draft saved
        </Text>
        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >

          {/* Delivery Count */}
          <Form.Item
            label="Delivery Count"
            name="deliveryCount"
            rules={[{ required: true, message: "This is a required question" }]}
          >
            <Input type="number" placeholder="Enter delivery count" />
          </Form.Item>

          {/* No of Dispatch */}
          <Form.Item
            label="No of Dispatch"
            name="dispatchType"
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <Radio.Group>
              <Radio value="Single">Single</Radio>
              <Radio value="Multiple">Multiple</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Project Name */}
          <Form.Item
            label="Site Wise Project Name"
            name="projectName"
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          {/* Project Location */}
          <Form.Item
            label="Site Wise Project Location"
            name="projectLocation"
            rules={[{ required: true, message: "Please enter project location" }]}
          >
            <Input placeholder="Enter project location" />
          </Form.Item>

          {/* Delivery Address */}
          <Form.Item
            label="Site Delivery Address"
            name="deliveryAddress"
            rules={[{ required: true, message: "Please enter delivery address" }]}
          >
            <Input.TextArea rows={2} placeholder="Enter site delivery address" />
          </Form.Item>

          {/* Google Map Link */}
          <Form.Item
            label="Site Google Map Link"
            name="googleMapLink"
            rules={[{ type: "url", message: "Please enter a valid link" }]}
          >
            <Input placeholder="Paste Google Map link" />
          </Form.Item>

          {/* Delivery Quantity */}
          <Form.Item
            label="Site Wise Delivery Quantity"
            name="deliveryQuantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input type="number" placeholder="Enter delivery quantity" />
          </Form.Item>

          {/* Confirm Dispatch Date */}
          <Form.Item
            label="Confirm Dispatch Date"
            name="dispatchDate"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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
              <Button
                onClick={handleBack}
                style={{
                  backgroundColor: "#fff",
                  color: "#4f46e5",
                  borderColor: "#4f46e5",
                }}
              >
                Back
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#4f46e5",
                  borderColor: "#4f46e5",
                }}
              >
                Next
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DispatchForm;
