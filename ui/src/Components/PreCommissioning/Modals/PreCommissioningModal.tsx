import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Row, Col } from "antd";

const { Option } = Select;

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

interface PreCommissioningModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PreCommissionData) => void;
  serialNumbers: string[];
  editingData: PreCommissionData | null;
}

const ModalPreCommissioning: React.FC<PreCommissioningModalProps> = ({
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
    <Modal
      title={editingData ? "Edit Pre-Commissioning" : "Add Pre-Commissioning"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={890} // 👈 Smaller modal width
      // height={60}
    >
      <Form
        layout="horizontal" // 👈 Horizontal layout
        labelCol={{ span: 10 }} // 👈 Label width
        wrapperCol={{ span: 14 }}
        form={form}
        onFinish={onSubmit}
        size="small" // 👈 compact input size
      >
        {/* ---------------- Two Column Layout ---------------- */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Serial Number"
              name="serialNumber"
              rules={[{ required: false, message: "Select serial number" }]}
            >
              <Select
                disabled={!!editingData}
                placeholder="Select Serial Number"
              >
                {serialNumbers.map((sn) => (
                  <Option key={sn} value={sn}>
                    {sn}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Contact Person"
              name="contactPerson"
              rules={[{ required: true, message: "Enter contact person" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="PPM Shared w/ Client" name="sheetSharedClient">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="PPM Received from Client"
              name="sheetReceivedClient"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="PPM Shared w/ OEM" name="sheetSharedOEM">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="OEM Ticket No" name="ticketNo">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Remarks" name="remarks">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* ---------------- Submit Button ---------------- */}
        <Form.Item
          wrapperCol={{ span: 24 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5px",
          }}
        >
          <Button type="primary" htmlType="submit" block>
            {editingData ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalPreCommissioning;
