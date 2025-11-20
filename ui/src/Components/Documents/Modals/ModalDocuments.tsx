import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";

const { Option } = Select;

export interface DocumentFormValues {
  key?: number;
  noDuesClearance?: string;
  taxInvoiceNo: string;
  invoiceDate: any;
  ewayBill: string;
  deliveryChallan: string;
  dispatchDate: any;
  packingList: string;
  dispatchFromLocation: string;
  inverterSerialNos: string;
  dispatchStatus?: string;
  dispatchRemarks?: string;
  dispatchCount?: number;
}

interface ModalDocumentsProps {
  open: boolean;
  editingRecord?: DocumentFormValues | null;
  onClose: () => void;
  onSubmit: (data: DocumentFormValues) => void;
}

const ModalDocuments: React.FC<ModalDocumentsProps> = ({
  open,
  editingRecord,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // 🔥 Prefill form if editing  
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        invoiceDate: editingRecord.invoiceDate,
        dispatchDate: editingRecord.dispatchDate,
      });
    } else {
      form.resetFields();
    }
  }, [editingRecord, open]);

  const handleFinish = (values: DocumentFormValues) => {
    const serialNumbers = values.inverterSerialNos
      ? values.inverterSerialNos.split(",").map((x) => x.trim())
      : [];

    const dispatchCount = serialNumbers.length;

    onSubmit({
      ...values,
      key: editingRecord?.key ?? Date.now(),
      dispatchCount,
    });

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={editingRecord ? "Edit Document" : "Add Document"}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
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
          <Input />
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
          <Input.TextArea rows={3} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {editingRecord ? "Update" : "Submit"}
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalDocuments;


