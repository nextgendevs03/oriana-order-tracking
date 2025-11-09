
// import React from "react";
// import {
//   Form,
//   Input,
//   DatePicker,
//   Radio,
//   Select,
//   Button,
//   Card,
//   Typography,
//   Divider,
// } from "antd";

// const { Title, Text } = Typography;

// const PurchaseDetailsForm = () => {
//   const [form] = Form.useForm();

//   const onFinish = (values) => {
//     console.log("Form Submitted:", values);
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#f3e8ff",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         padding: "40px 20px",
//       }}
//     >
//       <Card
//         bordered={false}
//         style={{
//           width: "100%",
//           maxWidth: 700,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           borderRadius: 12,
//           background: "#fff",
//         }}
//       >
//         <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
//           Purchase details
//         </Title>
//         <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
//           pshwufhueueu34@gmail.com — Not shared — Draft saved
//         </Text>
//         <Divider />

//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           requiredMark="optional"
//         >
//           {/* Order ID */}
//           <Form.Item
//             label="Order ID"
//             name="orderId"
//             rules={[{ required: true, message: "This is a required question" }]}
//           >
//             <Input placeholder="Enter Order ID" />
//           </Form.Item>

//           {/* Date */}
//           <Form.Item label="Date" name="date">
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           {/* Sales Person */}
//           <Form.Item label="Sales Person" name="salesPerson">
//             <Radio.Group>
//               <Radio value="Ajay">Ajay</Radio>
//               <Radio value="Kishor">Kishor</Radio>
//               <Radio value="Ajay2">Ajay2</Radio>
//               <Radio value="Kishor2">Kishor2</Radio>
//             </Radio.Group>
//           </Form.Item>

//           {/* Client Details */}
//           <Form.Item label="Client name" name="clientName">
//             <Input placeholder="Enter client name" />
//           </Form.Item>

//           <Form.Item label="OSG PI No" name="osgPiNo">
//             <Input placeholder="Enter OSG PI No" />
//           </Form.Item>

//           <Form.Item label="OSG PI Date" name="osgPiDate">
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           {/* PO Status */}
//           <Form.Item label="PO Status" name="poStatus">
//             <Radio.Group>
//               <Radio value="Received">PO Received</Radio>
//               <Radio value="Confirmed">PO Confirmed on Phone</Radio>
//               <Radio value="Call">On Call</Radio>
//               <Radio value="Mail">On Mail</Radio>
//               <Radio value="Option5">Option 5</Radio>
//             </Radio.Group>
//           </Form.Item>

//           {/* Client PO */}
//           <Form.Item label="Client PO No" name="clientPoNo">
//             <Input placeholder="Enter Client PO No" />
//           </Form.Item>

//           <Form.Item label="PO Date" name="poDate">
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           {/* Dispatch */}
//           <Form.Item label="No Of Dispatch" name="noOfDispatch">
//             <Radio.Group>
//               <Radio value="Single">Single</Radio>
//               <Radio value="Multiple">Multiple</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item label="Client Address" name="clientAddress">
//             <Input.TextArea rows={2} placeholder="Enter client address" />
//           </Form.Item>

//           <Form.Item label="Client Point of Contact" name="clientPOC">
//             <Input placeholder="Enter client contact person" />
//           </Form.Item>

//           {/* OEM */}
//           <Form.Item label="OEM name" name="oemName">
//             <Radio.Group>
//               <Radio value="Sieneng">Sieneng</Radio>
//               <Radio value="Solis">Solis</Radio>
//               <Radio value="Jio">JIo</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item
//   label="Inverter / Product model"
//   name="productModel"
//   rules={[{ required: true, message: "Please select a product model" }]}
// >
//   <Select placeholder="Select product">
//     <Select.Option value="product1">Product 1</Select.Option>
//     <Select.Option value="product2">Product 2</Select.Option>
//     <Select.Option value="product3">Product 3</Select.Option>
//   </Select>
// </Form.Item>

//           <Form.Item label="Total Quantity Ordered" name="totalQtyOrdered">
//             <Input placeholder="Enter quantity" type="number" />
//           </Form.Item>

//           <Form.Item label="Spare Quantity" name="spareQty">
//             <Input placeholder="Enter spare quantity" type="number" />
//           </Form.Item>

//           <Form.Item label="Total Quantity" name="totalQty">
//             <Input placeholder="Enter total quantity" type="number" />
//           </Form.Item>

//           <Form.Item label="Warranty period" name="warranty">
//             <Radio.Group>
//               <Radio value="Option1">Option 1</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item label="Dispatch Plan Date" name="dispatchPlanDate">
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item label="Site Location" name="siteLocation">
//             <Input placeholder="Enter site location" />
//           </Form.Item>

//           <Form.Item
//             label="On site commissioning support required"
//             name="commissionSupport"
//           >
//             <Radio.Group>
//               <Radio value="Yes">Yes</Radio>
//               <Radio value="No">No</Radio>
//               <Radio value="Maybe">Maybe</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item label="Confirm Date of Dispatch" name="confirmDispatchDate">
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item label="Payment receipt status" name="paymentStatus">
//             <Radio.Group>
//               <Radio value="Advance">Advance</Radio>
//               <Radio value="Received">Received</Radio>
//               <Radio value="Pending">Pending</Radio>
//               <Radio value="15days">15 days credit</Radio>
//               <Radio value="30days">30 days credit</Radio>
//               <Radio value="Option6">Option 6</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.Item label="Remark" name="remark">
//             <Input.TextArea rows={3} placeholder="Enter remarks" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="Next" block>
//               Next
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default PurchaseDetailsForm;

// 2nd only 1st form is done 

// import React from "react";
// import {
//   Form,
//   Input,
//   Radio,
//   DatePicker,
//   Select,
//   Button,
//   message,
//   Space,
// } from "antd";

// const { Option } = Select;

// const PurchaseForm = () => {
//   const [form] = Form.useForm();

//   const onFinish = (values) => {
//     console.log("✅ Submitted Data:", values);
//     message.success("Form submitted successfully!");

//     // Convert to JSON
//     const jsonData = JSON.stringify(values, null, 2);
//     console.log("JSON Data:", jsonData);

//     // Example: Store locally (you can connect API instead)
//     localStorage.setItem("purchaseDetails", jsonData);
//   };

//   const onFinishFailed = () => {
//     message.error("Please fill all required fields correctly!");
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 800,
//         margin: "auto",
//         background: "#fafafa",
//         padding: 30,
//         borderRadius: 12,
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 20 }}>
//         Purchase Details
//       </h2>

//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         {/* Order ID */}
//         <Form.Item
//           label="Order ID"
//           name="orderId"
//           rules={[{ required: true, message: "Order ID is required" }]}
//         >
//           <Input placeholder="Enter Order ID" />
//         </Form.Item>

//         {/* Date */}
//         <Form.Item
//           label="Date"
//           name="date"
//           rules={[{ required: true, message: "Please select a date" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         {/* Sales Person */}
//         <Form.Item
//           label="Sales Person"
//           name="salesPerson"
//           rules={[{ required: true, message: "Please select a salesperson" }]}
//         >
//           <Radio.Group>
//             <Radio value="Ajay">Ajay</Radio>
//             <Radio value="Kishor">Kishor</Radio>
//             <Radio value="Ajay2">Ajay2</Radio>
//             <Radio value="Kishor2">Kishor2</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* Client Info */}
//         <Form.Item
//           label="Client Name"
//           name="clientName"
//           rules={[{ required: true, message: "Client name is required" }]}
//         >
//           <Input placeholder="Enter client name" />
//         </Form.Item>

//         <Form.Item label="Client Address" name="clientAddress">
//           <Input.TextArea placeholder="Enter client address" rows={2} />
//         </Form.Item>

//         <Form.Item label="Client Point of Contact" name="clientPOC">
//           <Input placeholder="Enter contact name or details" />
//         </Form.Item>

//         {/* OSG PI */}
//         <Form.Item label="OSG PI No" name="osgPiNo">
//           <Input placeholder="Enter OSG PI Number" />
//         </Form.Item>

//         <Form.Item label="OSG PI Date" name="osgPiDate">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         {/* PO Status */}
//         <Form.Item label="PO Status" name="poStatus">
//           <Radio.Group>
//             <Radio value="PO Received">PO Received</Radio>
//             <Radio value="PO Confirmed on Phone">PO Confirmed on Phone</Radio>
//             <Radio value="On Call">On Call</Radio>
//             <Radio value="On Mail">On Mail</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* Client PO */}
//         <Form.Item label="Client PO No" name="clientPoNo">
//           <Input placeholder="Enter Client PO Number" />
//         </Form.Item>

//         <Form.Item label="PO Date" name="poDate">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         {/* Dispatch */}
//         <Form.Item label="No Of Dispatch" name="dispatchType">
//           <Radio.Group>
//             <Radio value="Single">Single</Radio>
//             <Radio value="Multiple">Multiple</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* OEM Name */}
//         <Form.Item label="OEM Name" name="oemName">
//           <Radio.Group>
//             <Radio value="Sieneng">Sieneng</Radio>
//             <Radio value="Solis">Solis</Radio>
//             <Radio value="Jio">Jio</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* Product */}
//         <Form.Item
//           label="Inverter / Product Model"
//           name="productModel"
//           rules={[{ required: true, message: "Please select a product model" }]}
//         >
//           <Select placeholder="Select product">
//             <Option value="product1">Product 1</Option>
//             <Option value="product2">Product 2</Option>
//             <Option value="product3">Product 3</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Total Quantity Ordered" name="totalQtyOrdered">
//           <Input type="number" placeholder="Enter total quantity" />
//         </Form.Item>

//         <Form.Item label="Spare Quantity" name="spareQty">
//           <Input type="number" placeholder="Enter spare quantity" />
//         </Form.Item>

//         <Form.Item label="Total Quantity" name="totalQty">
//           <Input type="number" placeholder="Enter total quantity" />
//         </Form.Item>

//         {/* Warranty */}
//         <Form.Item label="Warranty Period" name="warranty">
//           <Select placeholder="Select warranty period">
//             <Option value="1 Year">1 Year</Option>
//             <Option value="2 Years">2 Years</Option>
//             <Option value="5 Years">5 Years</Option>
//           </Select>
//         </Form.Item>

//         {/* Dispatch Plan */}
//         <Form.Item label="Dispatch Plan Date" name="dispatchPlanDate">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item label="Site Location" name="siteLocation">
//           <Input placeholder="Enter site location" />
//         </Form.Item>

//         <Form.Item
//           label="On-site Commissioning Support Required"
//           name="commissionSupport"
//         >
//           <Radio.Group>
//             <Radio value="Yes">Yes</Radio>
//             <Radio value="No">No</Radio>
//             <Radio value="Maybe">Maybe</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item label="Confirm Date of Dispatch" name="dispatchDate">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         {/* Payment */}
//         <Form.Item label="Payment Receipt Status" name="paymentStatus">
//           <Radio.Group>
//             <Radio value="Advance Received">Advance Received</Radio>
//             <Radio value="Pending">Pending</Radio>
//             <Radio value="15 Days Credit">15 Days Credit</Radio>
//             <Radio value="30 Days Credit">30 Days Credit</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item label="Remark" name="remark">
//           <Input.TextArea rows={3} placeholder="Enter any remarks" />
//         </Form.Item>

//         <Form.Item>
//           <Space style={{ display: "flex", justifyContent: "center" }}>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//             <Button onClick={() => form.resetFields()}>Reset</Button>
//           </Space>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default PurchaseForm;




//1st form is done
import React from "react";
import { Form, Input, Select, DatePicker, Radio, Space, Button } from "antd";

const { Option } = Select;

const PurchaseDetailsForm = ({ form, onNext }) => {
  return (
    <>
      <Form.Item
        label="Order ID"
        name="orderId"
        rules={[{ required: true, message: "Order ID is required" }]}
      >
        <Input placeholder="Enter Order ID" />
      </Form.Item>

      <Form.Item label="Date" name="orderDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Sales Person" name="salesPerson">
        <Select placeholder="Select Sales Person">
          <Option value="Ajay">Ajay</Option>
          <Option value="Kishor">Kishor</Option>
          <Option value="Ajay2">Ajay2</Option>
          <Option value="Kishor2">Kishor2</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Client Name" name="clientName">
        <Input placeholder="Enter Client Name" />
      </Form.Item>

      <Form.Item
        label="Inverter / Product Model"
        name="productModel"
        rules={[{ required: true, message: "Select a product" }]}
      >
        <Select placeholder="Choose product">
          <Option value="Product 1">Product 1</Option>
          <Option value="Product 2">Product 2</Option>
          <Option value="Product 3">Product 3</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" onClick={onNext}>
            Next
          </Button>
        </Space>
      </Form.Item>
    </>
  );
};

export default PurchaseDetailsForm;


