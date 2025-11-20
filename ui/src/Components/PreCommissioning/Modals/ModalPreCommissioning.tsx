import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PreCommissionData) => void;
  serialNumbers: string[];
  editingData: PreCommissionData | null;
}

export interface PreCommissionData {
  serialNumber: string;
  contactPerson: string;
  sheetSharedClient: string;
  sheetReceivedClient: string;
  sheetSharedOEM: string;
  ticketNo: string;
  status: string;
  remarks?: string;
}

const ModalPreCommissioning: React.FC<ModalProps> = ({
  open,
  onClose,
  onSubmit,
  serialNumbers,
  editingData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue(editingData);
    } else {
      form.resetFields();
    }
  }, [editingData, form]);

  return (
    <Modal title="Pre-Commissioning Details" open={open} onCancel={onClose} footer={null}>
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item label="Serial Number" name="serialNumber" rules={[{ required: false }]}>
          <Select disabled={!!editingData} placeholder="Select Serial Number">
            {serialNumbers.map((sn) => (
              <Option key={sn} value={sn}>
                {sn}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Client Contact Person" name="contactPerson" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="PPM Shared With Client" name="sheetSharedClient">
          <Input />
        </Form.Item>

        <Form.Item label="PPM Received From Client" name="sheetReceivedClient">
          <Input />
        </Form.Item>

        <Form.Item label="PPM Shared With OEM" name="sheetSharedOEM">
          <Input />
        </Form.Item>

        <Form.Item label="OEM Ticket Number" name="ticketNo">
          <Input />
        </Form.Item>

        <Form.Item label="Commissioning Status" name="status">
          <Select>
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="In Progress">In Progress</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingData ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalPreCommissioning;