import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Radio, Select, Row, Col, Button, Card } from "antd";
import type { FormInstance } from "antd";
import moment, { Moment } from "moment";
import ParentComponent from "./PurchaseDetailForm/Modal/ParentComponent";

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

interface Props {
  form?: FormInstance<PurchaseFormValues>;
}

const PurchaseDetailsForm: React.FC<Props> = ({ form }) => {
  const loggedInUser = localStorage.getItem("userName") || "Unknown";

  const [submittedData, setSubmittedData] = useState<any>(null);
  const [internalForm] = Form.useForm<PurchaseFormValues>();
  const activeForm = form ?? internalForm;

  useEffect(() => {
    activeForm.setFieldsValue({ salesPerson: loggedInUser });
  }, [activeForm, loggedInUser]);

  const handleSubmit = (values: PurchaseFormValues) => {
    const poData = {
      ...values,
      date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
      osgPiDate: values.osgPiDate ? values.osgPiDate.format("YYYY-MM-DD") : undefined,
      poDate: values.poDate ? values.poDate.format("YYYY-MM-DD") : undefined,
      dispatchPlanDate: values.dispatchPlanDate ? values.dispatchPlanDate.format("YYYY-MM-DD") : undefined,
      confirmDispatchDate: values.confirmDispatchDate ? values.confirmDispatchDate.format("YYYY-MM-DD") : undefined
    };

    const cleanedData = Object.fromEntries(
      Object.entries(poData).filter(([_, v]) => v !== undefined && v !== "")
    );

    setSubmittedData(cleanedData);
    console.log("PO JSON:", cleanedData);

    // Reset form
    activeForm.resetFields();
    activeForm.setFieldsValue({
      date: undefined,
      osgPiDate: undefined,
      poDate: undefined,
      dispatchPlanDate: undefined,
      confirmDispatchDate: undefined,
      salesPerson: loggedInUser
    });
  };

  // Controlled DatePicker helper
  const renderDatePicker = (fieldName: keyof PurchaseFormValues) => {
    const value = activeForm.getFieldValue(fieldName);
    return (
      <DatePicker
        style={{ width: "100%" }}
        value={value || null}
        onChange={(date) => activeForm.setFieldsValue({ [fieldName]: date })}
      />
    );
  };

  return (
    <>
      <Form<PurchaseFormValues> layout="vertical" form={activeForm} onFinish={handleSubmit}>
        {/* Row 1 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="orderId" label="Order ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="date" label="Date">
              {renderDatePicker("date")}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="salesPerson" label="Sales Person">
              <Input disabled style={{ background: "#f5f5f5" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="clientName" label="Client Name">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="osgPiNo" label="OSG PI No">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="osgPiDate" label="OSG PI Date">
              {renderDatePicker("osgPiDate")}
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="poStatus" label="PO Status">
              <Select placeholder="Select">
                <Option value="PO Received">PO Received</Option>
                <Option value="PO Confirmed on Phone">PO Confirmed on Phone</Option>
                <Option value="On Call">On Call</Option>
                <Option value="On Mail">On Mail</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="clientPoNo" label="Client PO No">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="poDate" label="PO Date">
              {renderDatePicker("poDate")}
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="dispatchType" label="No Of Dispatch">
              <Radio.Group>
                <Radio value="Single">Single</Radio>
                <Radio value="Multiple">Multiple</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="clientAddress" label="Client Address">
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="clientContact" label="Client Point of Contact">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Items Table */}
        <ParentComponent />

        {/* Row 5 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="dispatchPlanDate" label="Dispatch Plan Date">
              {renderDatePicker("dispatchPlanDate")}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="siteLocation" label="Site Location">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="onSiteSupport" label="On Site Support Required">
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
                <Radio value="Maybe">Maybe</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="confirmDispatchDate" label="Confirm Dispatch Date">
              {renderDatePicker("confirmDispatchDate")}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="paymentStatus" label="Payment Receipt Status">
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

          <Col span={8}>
            <Form.Item name="remarks" label="Remark">
              <Input.TextArea rows={1} placeholder="Enter remarks..." />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit */}
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#6a1b9a",
                borderColor: "#6a1b9a",
                borderRadius: 8
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Submitted */}
      {submittedData && (
        <Card
          title="Submitted"
          style={{
            marginTop: 24,
            whiteSpace: "pre-wrap",
            borderRadius: 10,
            borderColor: "#6a1b9a"
          }}
        >
          <pre style={{ fontSize: 14 }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </Card>
      )}
    </>
  );
};

export default PurchaseDetailsForm;
