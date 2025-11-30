import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Row,
  Col,
  Button,
  Card,
} from "antd";
import type { Moment } from "moment";
import PurchaseItemForm from "./PurchaseItemForm";

const { Option } = Select;

export interface PurchaseFormValues {
  orderId: string;
  date?: Moment;
  salesPerson?: string;
  clientName?: string;
  osgPiNo?: string;
  osgPiDate?: Moment;
  poStatus?: string;
  clientPoNo?: string;
  poDate?: Moment;
  dispatchType?: "Single" | "Multiple";
  clientAddress?: string;
  clientContact?: string;
  dispatchPlanDate?: Moment;
  siteLocation?: string;
  onSiteSupport?: "Yes" | "No" | "Maybe";
  confirmDispatchDate?: Moment;
  paymentStatus?: string;
  remarks?: string;
}

const PurchaseDetailsForm: React.FC = () => {
  const loggedInUser = localStorage.getItem("userName") || "Unknown";
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [form] = Form.useForm<PurchaseFormValues>();
  const [isFormValid, setIsFormValid] = useState(false);

  // Auto fill sales person
  useEffect(() => {
    form.setFieldsValue({ salesPerson: loggedInUser });
  }, []);

  const handleSubmit = (values: PurchaseFormValues) => {
    const poData = {
      ...values,
      date: values.date?.format("YYYY-MM-DD"),
      osgPiDate: values.osgPiDate?.format("YYYY-MM-DD"),
      poDate: values.poDate?.format("YYYY-MM-DD"),
      dispatchPlanDate: values.dispatchPlanDate?.format("YYYY-MM-DD"),
      confirmDispatchDate: values.confirmDispatchDate?.format("YYYY-MM-DD"),
    };

    const cleaned = Object.fromEntries(Object.entries(poData).filter(([_, v]) => v));
    setSubmittedData(cleaned);
    form.resetFields();
    form.setFieldsValue({ salesPerson: loggedInUser });
    setIsFormValid(false);
  };

  const renderDatePicker = (name: keyof PurchaseFormValues) => {
    const value = form.getFieldValue(name);
    return (
      <DatePicker
        style={{ width: "100%" }}
        value={value || null}
        onChange={(d) => form.setFieldsValue({ [name]: d })}
      />
    );
  };

  // Check form validity live
  const handleFormChange = async () => {
    try {
      await form.validateFields();
      setIsFormValid(true);
    } catch {
      setIsFormValid(false);
    }
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
      >
        {/* Line 1 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="orderId"
              label="Order ID"
              rules={[{ required: true, message: "Order ID required" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Date required" }]}
            >
              {renderDatePicker("date")}
            </Form.Item>
          </Col>
        </Row>

        {/* Line 2 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="salesPerson"
              label="Sales Person"
              rules={[{ required: true }]}
            >
              <Input disabled style={{ background: "#f5f5f5" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientName"
              label="Client Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Line 3 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="osgPiNo"
              label="OSG PI No"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="osgPiDate"
              label="OSG PI Date"
              rules={[{ required: true }]}
            >
              {renderDatePicker("osgPiDate")}
            </Form.Item>
          </Col>
        </Row>

        {/* Line 4 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="poStatus"
              label="PO Status"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select">
                <Option value="PO Received">PO Received</Option>
                <Option value="PO Confirmed on Phone">PO Confirmed on Phone</Option>
                <Option value="On Call">On Call</Option>
                <Option value="On Mail">On Mail</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientPoNo"
              label="Client PO No"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Line 5 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="poDate"
              label="PO Date"
              rules={[{ required: true }]}
            >
              {renderDatePicker("poDate")}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dispatchType"
              label="No Of Dispatch"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="Single">Single</Radio>
                <Radio value="Multiple">Multiple</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Line 6 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="clientAddress"
              label="Client Address"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientContact"
              label="Client Contact"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Items Table */}
        <PurchaseItemForm />

        {/* Line 7 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dispatchPlanDate"
              label="Dispatch Plan Date"
              rules={[{ required: true }]}
            >
              {renderDatePicker("dispatchPlanDate")}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="siteLocation"
              label="Site Location"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Line 8 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="onSiteSupport"
              label="On Site Support"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
                <Radio value="Maybe">Maybe</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmDispatchDate"
              label="Confirm Dispatch Date"
              rules={[{ required: true }]}
            >
              {renderDatePicker("confirmDispatchDate")}
            </Form.Item>
          </Col>
        </Row>

        {/* Line 9 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Receipt Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Advance">Advance</Option>
                <Option value="Received">Received</Option>
                <Option value="Pending">Pending</Option>
                <Option value="15 Days Credit">15 Days Credit</Option>
                <Option value="30 Days Credit">30 Days Credit</Option>
                <Option value="LC 30">LC 30</Option>
                <Option value="LC 45">LC 45</Option>
                <Option value="LC 60">LC 60</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="remarks"
              label="Remark"
            >
              <Input.TextArea rows={1} placeholder="Enter remarks..." />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isFormValid}
              style={{
                backgroundColor: "#1677ff",
                borderColor: "#1677ff",
                borderRadius: 8,
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {submittedData && (
        <Card title="Submitted" style={{ marginTop: 24 }}>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </Card>
      )}
    </>
  );
};

export default PurchaseDetailsForm;
