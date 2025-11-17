// import React from "react";
// import { Modal, Form, Input, Select, DatePicker, Button } from "antd";

// const { Option } = Select;

// const ModalDocuments = ({ open, onClose, onSubmit }) => {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     // Count number of dispatch items from serial numbers
//     const serialNumbers = values.inverterSerialNos
//       ? values.inverterSerialNos.split(",").map((s) => s.trim())
//       : [];
//     const dispatchCount = serialNumbers.length;

//     onSubmit({ ...values, dispatchCount });
//     form.resetFields();
//   };

//   return (
//     <Modal
//       title="Add Document"
//       open={open}
//       onCancel={() => {
//         form.resetFields();
//         onClose();
//       }}
//       footer={null}
//     >
//       <Form form={form} layout="vertical" onFinish={handleFinish}>
//         <Form.Item label="No Dues Clearance" name="noDuesClearance">
//           <Select placeholder="Select status" allowClear>
//             <Option value="Pending">Pending</Option>
//             <Option value="Approved">Approved</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Tax Invoice No"
//           name="taxInvoiceNo"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Invoice Date"
//           name="invoiceDate"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item
//           label="E-way Bill"
//           name="ewayBill"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Delivery Challan"
//           name="deliveryChallan"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Dispatch Date"
//           name="dispatchDate"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item
//           label="Packing List"
//           name="packingList"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Dispatch From Location"
//           name="dispatchFromLocation"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Input placeholder="Enter warehouse or dispatch location" />
//         </Form.Item>

//         <Form.Item
//           label="Inverter Serial Nos"
//           name="inverterSerialNos"
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Input placeholder="Comma separated serial numbers" />
//         </Form.Item>

//         <Form.Item label="Dispatch Status" name="dispatchStatus">
//           <Select placeholder="Select status">
//             <Option value="Pending">Pending</Option>
//             <Option value="Dispatched">Dispatched</Option>
//             <Option value="Delivered">Delivered</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Dispatch Remarks" name="dispatchRemarks">
//           <Input.TextArea rows={3} placeholder="Optional" />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default ModalDocuments;



import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";

const { Option } = Select;

const ModalDocuments = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Calculate Dispatch Count from inverter serial numbers
    const serialNumbers = values.inverterSerialNos
      ? values.inverterSerialNos.split(",").map((s) => s.trim())
      : [];
    const dispatchCount = serialNumbers.length;

    onSubmit({ ...values, dispatchCount });
    form.resetFields();
  };

  return (
    <Modal
      title="Add Document"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="No Dues Clearance" name="noDuesClearance">
          <Select placeholder="Select status" allowClear>
            <Option value="Pending">Pending</Option>
            <Option value="Approved">Approved</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tax Invoice No"
          name="taxInvoiceNo"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Invoice Date"
          name="invoiceDate"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="E-way Bill"
          name="ewayBill"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Delivery Challan"
          name="deliveryChallan"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dispatch Date"
          name="dispatchDate"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Packing List"
          name="packingList"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dispatch From Location"
          name="dispatchFromLocation"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter warehouse or dispatch location" />
        </Form.Item>

        <Form.Item
          label="Inverter Serial Nos"
          name="inverterSerialNos"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Comma separated serial numbers" />
        </Form.Item>

        <Form.Item label="Dispatch Status" name="dispatchStatus">
          <Select placeholder="Select status">
            <Option value="Pending">Pending</Option>
            <Option value="Dispatched">Dispatched</Option>
            <Option value="Delivered">Delivered</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Dispatch Remarks" name="dispatchRemarks">
          <Input.TextArea rows={3} placeholder="Optional" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDocuments;

