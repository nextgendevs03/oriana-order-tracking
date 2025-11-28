import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { Option } = Select;

export interface DocumentFormValues {
  key?: number;
  noDuesClearance?: string;
  taxInvoiceNo: string;
  invoiceDate: Dayjs;
  ewayBill: string;
  deliveryChallan: string;
  dispatchDate: Dayjs;
  packingList: string;
  dispatchFromLocation: string;
  inverterSerialNos: string;
  dispatchStatus?: string;
  dispatchRemarks?: string;
  dispatchCount?: number;
}

interface DocumentModalProps {
  open: boolean;
  editingRecord?: DocumentFormValues | null;
  onClose: () => void;
  onSubmit: (data: DocumentFormValues) => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  open,
  editingRecord,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        invoiceDate: dayjs(editingRecord.invoiceDate),
        dispatchDate: dayjs(editingRecord.dispatchDate),
      });
    } else {
      form.resetFields();
    }
  }, [editingRecord, open, form]);

  const handleFinish = (values: any) => {
    const serialNumbers = values.inverterSerialNos
      ? values.inverterSerialNos.split(",").map((x: string) => x.trim())
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
      width={900} // Smaller width
      destroyOnClose
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 10 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="No Dues Clearance" name="noDuesClearance">
              <Select placeholder="Select status" allowClear>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tax Invoice No"
              name="taxInvoiceNo"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Invoice Date"
              name="invoiceDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="E-way Bill"
              name="ewayBill"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Delivery Challan"
              name="deliveryChallan"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Dispatch Date"
              name="dispatchDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Packing List"
              name="packingList"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Dispatch Location"
              name="dispatchLocation"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Inverter Serial Nos"
              name="inverterSerialNos"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Comma separated serial numbers" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Dispatch Status" name="dispatchStatus">
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="Dispatched">Dispatched</Option>
                <Option value="Delivered">Delivered</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Dispatch Remarks" name="dispatchRemarks">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" size="small">
            {editingRecord ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentModal;
