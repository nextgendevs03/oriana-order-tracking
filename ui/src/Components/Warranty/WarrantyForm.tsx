// Updated WarrantyForm with Multi-Select Item Dropdown placeholder
import React from "react";
import { Form, Input, DatePicker, Select, Button, Card } from "antd";

const { Option } = Select;

interface Props {
  onSubmit: (values: any) => void;
  selectedItems?: string[]; // ⭐ items from ItemModal
}

const WarrantyForm: React.FC<Props> = ({ onSubmit, selectedItems = [] }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({ ...values, selectedItems }); // ⭐ include selected items
    form.resetFields();
  };

  return (
    <Card
      style={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: 12,
        padding: 20,
        maxHeight: "65vh",
        overflowY: "auto",
      }}
    >
      <div style={{ paddingRight: 10 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            sharedStatus: "",
            warrantyStartDate: null,
            warrantyEndDate: null,
            issueDate: null,
            remark: "",
          }}
        >
          {/* ⭐ Multi‑Check Dropdown Inside Warranty Form */
          <Form.Item
            name="selectedItems"
            label="Select Items"
            rules={[{ required: true, message: "Please select items" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select warranty items"
              allowClear
            >
              <Option value="ITEM-01">Motor</Option>
              <Option value="ITEM-02">Pump</Option>
              <Option value="ITEM-03">Control Panel</Option>
              <Option value="ITEM-04">Cable</Option>
              <Option value="ITEM-05">Switch Gear</Option>
              <Option value="ITEM-06">Starter</Option>
              <Option value="ITEM-07">Pipe</Option>
              <Option value="ITEM-08">Valve</Option>
              <Option value="ITEM-09">Sensor</Option>
              <Option value="ITEM-10">Relay</Option>
            </Select>
          </Form.Item>}
          

          <Form.Item
            name="warrantyCertificateNo"
            label="Warranty Certificate No"
            rules={[{ required: true, message: "Please enter certificate number" }]}
          >
            <Input placeholder="Enter warranty certificate number" />
          </Form.Item>

          <Form.Item
            name="warrantyStartDate"
            label="Warranty Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="warrantyEndDate"
            label="Warranty End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="issueDate" label="Issue Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="sharedStatus" label="Shared Status">
            <Select placeholder="Select shared status">
              <Option value="Done">Done</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Hold">Hold</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea rows={3} placeholder="Enter remark" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default WarrantyForm;
