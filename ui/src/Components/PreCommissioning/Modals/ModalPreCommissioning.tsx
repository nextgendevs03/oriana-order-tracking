import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  serialNumbers: string[];
}

const ModalPreCommissioning: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  serialNumbers,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Pre-Commissioning Details"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        
        {/* Serial Number Dropdown */}
        <Form.Item
          label="Serial Number"
          name="serialNumber"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select placeholder="Select Serial Number">
            {serialNumbers.map((sn) => (
              <Option key={sn} value={sn}>{sn}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Contact Person */}
        <Form.Item
          label="Client Contact Person"
          name="contactPerson"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Enter contact name or number" />
        </Form.Item>

        {/* PPM Shared With Client */}
        <Form.Item
          label="PPM Sheet Shared With Client"
          name="sheetSharedClient"
        >
          <Input placeholder="Enter Yes/No or document reference" />
        </Form.Item>

        {/* PPM Received From Client */}
        <Form.Item
          label="PPM Sheet Received From Client"
          name="sheetReceivedClient"
        >
          <Input placeholder="Enter Yes/No or document reference" />
        </Form.Item>

        {/* Shared with OEM */}
        <Form.Item
          label="PPM Shared With OEM"
          name="sheetSharedOEM"
        >
          <Input placeholder="Enter Yes/No or Reference" />
        </Form.Item>

        {/* Ticket No */}
        <Form.Item
          label="OEM Ticket Number"
          name="ticketNo"
        >
          <Input placeholder="Enter ticket number" />
        </Form.Item>

        {/* Status */}
        <Form.Item
          label="Commissioning Status"
          name="status"
        >
          <Select>
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="In Progress">In Progress</Option>
          </Select>
        </Form.Item>

        {/* Remarks */}
        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={3} placeholder="Optional remarks" />
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

export default ModalPreCommissioning;
