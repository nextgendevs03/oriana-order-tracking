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



// import React from "react";
// import { Modal, Form, Input, Select, DatePicker, Button } from "antd";

// const { Option } = Select;

// const ModalDocuments = ({ open, onClose, onSubmit }) => {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     // Calculate Dispatch Count from inverter serial numbers
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
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const { Option } = Select;

const ModalDocuments: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Document Details"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="No Dues Clearance"
          name="noDues"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select status">
            <Option value="Pending">Pending</Option>
            <Option value="Approved">Approved</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tax Invoice No"
          name="taxInvoice"
          rules={[{ required: true, message: "Tax Invoice No is required" }]}
        >
          <Input placeholder="Enter tax invoice number" />
        </Form.Item>

        <Form.Item
          label="Invoice Date"
          name="invoiceDate"
          rules={[{ required: true, message: "Invoice date is required" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="E-way Bill"
          name="ewayBill"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter E-way bill" />
        </Form.Item>

        <Form.Item
          label="Delivery Challan"
          name="deliveryChallan"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter delivery challan no" />
        </Form.Item>

        <Form.Item
          label="Dispatch Date"
          name="dispatchDate"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Packaging List"
          name="packagingList"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter packaging list info" />
        </Form.Item>

        <Form.Item
          label="Material Dispatch Location"
          name="dispatchLocation"
          rules={[{ required: true }]} 
        >
          <Input placeholder="Enter dispatch location" />
        </Form.Item>

        <Form.Item
          label="Inverter Serial Nos (comma separated)"
          name="serialNos"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. 123, 456, 789" />
        </Form.Item>

        <Form.Item
          label="Dispatch Status"
          name="dispatchStatus"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select status">
            <Option value="Not Dispatched">Not Dispatched</Option>
            <Option value="Partially Dispatched">Partially Dispatched</Option>
            <Option value="Fully Dispatched">Fully Dispatched</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Dispatch Remarks" name="remarks">
          <Input.TextArea placeholder="Optional remarks" rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDocuments;


