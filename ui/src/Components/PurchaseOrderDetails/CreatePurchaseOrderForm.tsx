import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  InputNumber,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hook";
import { addPO, POData, POItem } from "../../store/poSlice";
import dayjs from "dayjs";
import PurchaseOrderItemTable from "./PurchaseOrderItemTable";

const { Title } = Typography;

interface ItemDetail {
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  warranty: string;
}

const CreatePurchaseOrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
   const dispatch = useAppDispatch();

  const poStatusOptions = [
    { value: "po_received", label: "PO received" },
    { value: "po_confirmed_phone", label: "PO confirmed on Phone" },
    { value: "on_call", label: "on Call" },
    { value: "on_mail", label: "on Mail" },
  ];

  const dispatchOptions = [
    { value: "single", label: "Single" },
    { value: "multiple", label: "Multiple" },
  ];

  const oscSupportOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "maybe", label: "Maybe" },
  ];

  const paymentStatusOptions = [
    { value: "advanced", label: "Advanced" },
    { value: "received", label: "Received" },
    { value: "pending", label: "Pending" },
    { value: "15_dc", label: "15 DC" },
    { value: "30_dc", label: "30 DC" },
    { value: "lc", label: "LC" },
  ];

  const onFinish = (values: Record<string, unknown>) => {
    // Generate unique PO ID
    const poId = `PO-${Date.now().toString().slice(-6)}`;

    // Format dates to string
    const formatDate = (date: dayjs.Dayjs | undefined) => {
      return date ? dayjs(date).format("YYYY-MM-DD") : "";
    };

    const poData: POData = {
      id: poId,
      date: formatDate(values.date as dayjs.Dayjs),
      clientName: values.clientName as string,
      osgPiNo: values.osgPiNo as number,
      osgPiDate: formatDate(values.osgPiDate as dayjs.Dayjs),
      clientPoNo: values.clientPoNo as number,
      clientPoDate: formatDate(values.clientPoDate as dayjs.Dayjs),
      poStatus: values.poStatus as string,
      noOfDispatch: values.noOfDispatch as string,
      clientAddress: values.clientAddress as string,
      clientContact: values.clientContact as string,
      poItems: values.poItems as POItem[],
      dispatchPlanDate: formatDate(values.dispatchPlanDate as dayjs.Dayjs),
      siteLocation: values.siteLocation as string,
      oscSupport: values.oscSupport as string,
      confirmDateOfDispatch: formatDate(
        values.confirmDateOfDispatch as dayjs.Dayjs
      ),
      paymentStatus: values.paymentStatus as string,
      remarks: values.remarks as string,
      createdAt: new Date().toISOString(),
    };

    console.log("Form Data:", poData);

    // Dispatch to Redux store
    dispatch(addPO(poData));

    // Reset form
    form.resetFields();

    // Navigate to dashboard
    navigate("/dashboard");
  };

  const textFieldRules = [
    { required: true, message: "This field is required" },
    { min: 3, message: "Minimum 3 characters required" },
  ];

  const numberFieldRules = [
    { required: true, message: "This field is required" },
  ];

  const selectFieldRules = [
    { required: true, message: "Please select an option" },
  ];

  const dateFieldRules = [{ required: true, message: "Please select a date" }];

  // Validation for at least 1 PO item with min 1 quantity
  const poItemsValidator = async (_: unknown, value: ItemDetail[]) => {
    if (!value || value.length === 0) {
      return Promise.reject(new Error("At least 1 PO item is required"));
    }
    const hasValidQuantity = value.some((item) => item?.quantity >= 1);
    if (!hasValidQuantity) {
      return Promise.reject(
        new Error("At least 1 PO item must have quantity >= 1")
      );
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        padding: "1rem",
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <Title level={3} style={{ marginBottom: "1.5rem" }}>
        Create Purchase Order
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ poItems: [] }}
      >
        {/* Row 1: Date, Client Name */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="date" label="Date" rules={dateFieldRules}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientName"
              label="Client Name"
              rules={textFieldRules}
            >
              <Input placeholder="Enter client name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: OSG PI No, OSG PI Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="osgPiNo"
              label="OSG PI No"
              rules={numberFieldRules}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="Enter OSG PI number"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="osgPiDate"
              label="OSG PI Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Client PO No, Client PO Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="clientPoNo"
              label="Client PO No"
              rules={numberFieldRules}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="Enter Client PO number"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientPoDate"
              label="Client PO Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: PO Status, No of Dispatch */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="poStatus"
              label="PO Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select PO status"
                options={poStatusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="noOfDispatch"
              label="No of Dispatch"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select dispatch type"
                options={dispatchOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Client Address, Client Contact */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="clientAddress"
              label="Client Address"
              rules={textFieldRules}
            >
              <Input placeholder="Enter client address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientContact"
              label="Client Contact"
              rules={textFieldRules}
            >
              <Input placeholder="Enter client contact" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Add Item Details Button & Table with validation */}
        <Form.Item
          name="poItems"
          rules={[{ validator: poItemsValidator }]}
          style={{ marginBottom: 0 }}
        >
          <PurchaseOrderItemTable form={form} />
        </Form.Item>

        {/* Row 7: Dispatch Plan Date, Site Location */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dispatchPlanDate"
              label="Dispatch Plan Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="siteLocation"
              label="Site Location"
              rules={textFieldRules}
            >
              <Input placeholder="Enter site location" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 8: OSC Support, Confirm Date of Dispatch */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="oscSupport"
              label="OSC Support"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select OSC support"
                options={oscSupportOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmDateOfDispatch"
              label="Confirm Date of Dispatch"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 9: Payment Status, Remarks */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select payment status"
                options={paymentStatusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="remarks" label="Remarks" rules={textFieldRules}>
              <Input placeholder="Enter remarks" />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button - Centered with disabled state based on form validity */}
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {() => (
            <Row justify="center" style={{ marginTop: "1.5rem" }}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                  style={{
                    backgroundColor: "#4b6cb7",
                    borderRadius: 8,
                    fontWeight: 600,
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  }}
                >
                  Create PO
                </Button>
              </Col>
            </Row>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePurchaseOrderForm;
