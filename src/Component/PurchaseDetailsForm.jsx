
// 2nd only 1st form is done 

import React from "react";
import {
  Form,
  Input,
  Radio,
  DatePicker,
  Select,
  Button,
  message,
  Space,
} from "antd";

const { Option } = Select;

const PurchaseForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("✅ Submitted Data:", values);
    message.success("Form submitted successfully!");

    // Convert to JSON
    const jsonData = JSON.stringify(values, null, 2);
    console.log("JSON Data:", jsonData);

    // Example: Store locally (you can connect API instead)
    localStorage.setItem("purchaseDetails", jsonData);
  };

  const onFinishFailed = () => {
    message.error("Please fill all required fields correctly!");
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        background: "#fafafa",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Purchase Details
      </h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* Order ID */}
        <Form.Item
          label="Order ID"
          name="orderId"
          rules={[{ required: true, message: "Order ID is required" }]}
        >
          <Input placeholder="Enter Order ID" />
        </Form.Item>

        {/* Date */}
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Sales Person */}
        <Form.Item
          label="Sales Person"
          name="salesPerson"
          rules={[{ required: true, message: "Please select a salesperson" }]}
        >
          <Radio.Group style={{ display: "flex", flexDirection: "column" }}>
            <Radio value="Ajay">Ajay</Radio>
            <Radio value="Kishor">Kishor</Radio>
            <Radio value="Ajay2">Ajay2</Radio>
            <Radio value="Kishor2">Kishor2</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Client Info */}
        <Form.Item
          label="Client Name"
          name="clientName"
          rules={[{ required: true, message: "Client name is required" }]}
        >
          <Input placeholder="Enter client name" />
        </Form.Item>


      

        {/* OSG PI */}
        <Form.Item label="OSG PI No" name="osgPiNo">
          <Input placeholder="Enter OSG PI Number" />
        </Form.Item>

        <Form.Item label="OSG PI Date" name="osgPiDate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* PO Status */}
        <Form.Item label="PO Status" name="poStatus">
          <Radio.Group  style={{ display: "flex", flexDirection: "column" }}>
            <Radio value="PO Received">PO Received</Radio>
            <Radio value="PO Confirmed on Phone">PO Confirmed on Phone</Radio>
            <Radio value="On Call">On Call</Radio>
            <Radio value="On Mail">On Mail</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Client PO */}
        <Form.Item label="Client PO No" name="clientPoNo">
          <Input placeholder="Enter Client PO Number" />
        </Form.Item>

        <Form.Item label="PO Date" name="poDate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

       

        {/* Dispatch */}
        <Form.Item label="No Of Dispatch" name="dispatchType">
          <Radio.Group style={{ display: "flex", flexDirection: "column" }}>
            <Radio value="Single">Single</Radio>
            <Radio value="Multiple">Multiple</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Client Address" name="clientAddress">
          <Input.TextArea placeholder="Enter client address" rows={2} />
        </Form.Item>

          <Form.Item label="Client Point of Contact" name="clientPOC">
          <Input placeholder="Enter contact name or details" />
        </Form.Item>

        {/* OEM Name */}
        <Form.Item label="OEM Name" name="oemName">
          <Radio.Group style={{ display: "flex", flexDirection: "column" }}>
            <Radio value="Sieneng">Sieneng</Radio>
            <Radio value="Solis">Solis</Radio>
            <Radio value="Jio">Jio</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Product */}
        <Form.Item
          label="Inverter / Product Model"
          name="productModel"
          rules={[{ required: true, message: "Please select a product model" }]}
        >
          <Select placeholder="Select product">
            <Option value="product1">Product 1</Option>
            <Option value="product2">Product 2</Option>
            <Option value="product3">Product 3</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Total Quantity Ordered" name="totalQtyOrdered">
          <Input type="number" placeholder="Enter total quantity" />
        </Form.Item>

        <Form.Item label="Spare Quantity" name="spareQty">
          <Input type="number" placeholder="Enter spare quantity" />
        </Form.Item>

        <Form.Item label="Total Quantity" name="totalQty">
          <Input type="number" placeholder="Enter total quantity" />
        </Form.Item>

        {/* Warranty */}
        <Form.Item label="Warranty Period" name="warranty">
          <Select placeholder="Select warranty period">
            <Option value="1 Year">1 Year</Option>
            <Option value="2 Years">2 Years</Option>
            <Option value="5 Years">5 Years</Option>
          </Select>
        </Form.Item>

        {/* Dispatch Plan */}
        <Form.Item label="Dispatch Plan Date" name="dispatchPlanDate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Site Location" name="siteLocation">
          <Input placeholder="Enter site location" />
        </Form.Item>

        <Form.Item
          label="On-site Commissioning Support Required"
          name="commissionSupport"
        >
          <Radio.Group style={{ display: "flex", flexDirection: "column" }}>
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
            <Radio value="Maybe">Maybe</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Confirm Date of Dispatch" name="dispatchDate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Payment */}
        <Form.Item label="Payment Receipt Status" name="paymentStatus">
          <Radio.Group style={{ display: "flex", flexDirection: "column" }}>
            <Radio value="Advance Received">Advance Received</Radio>
            <Radio value="Pending">Pending</Radio>
            <Radio value="15 Days Credit">15 Days Credit</Radio>
            <Radio value="30 Days Credit">30 Days Credit</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Remark" name="remark">
          <Input.TextArea rows={3} placeholder="Enter any remarks" />
        </Form.Item>

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PurchaseForm;
