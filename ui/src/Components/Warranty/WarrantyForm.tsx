import React from "react";
import { Form, Input, DatePicker, Select, Button, Card } from "antd";

const { Option } = Select;

interface Props {
  onSubmit: (values: any) => void;
}

const WarrantyForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log("Form Submitted Values:", values);
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Card
      title="Warranty / Project Details"
      style={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          sharedStatus: "Pending",
          warrantyStartDate: null,
          warrantyEndDate: null,
          issueDate: null,
          remark: "",
        }}
      >
        {/* Warranty Certificate Number */}
        <Form.Item
          name="warrantyCertificateNo"
          label="Warranty Certificate No"
          rules={[{ required: true, message: "Please enter certificate number" }]}
        >
          <Input placeholder="Enter warranty certificate number" />
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          name="warrantyStartDate"
          label="Warranty Start Date"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          name="warrantyEndDate"
          label="Warranty End Date"
          rules={[{ required: true, message: "Please select end date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Issue Date */}
        <Form.Item name="issueDate" label="Issue Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Shared Status Dropdown */}
        <Form.Item name="sharedStatus" label="Shared Status">
          <Select placeholder="Select shared status">
            <Option value="Done">Done</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Hold">Hold</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Form.Item>

        {/* Remark */}
        <Form.Item name="remark" label="Remark">
          <Input.TextArea rows={3} placeholder="Enter remark" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WarrantyForm;
