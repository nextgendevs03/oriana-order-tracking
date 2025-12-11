import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Table,
  InputNumber,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { addPO, POData, PODocument } from "../store/poSlice";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import FileUpload from "../Components/FileUpload";

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
  gstPercent: number;
  finalPrice: number;
  warranty: string;
}

const CreatePO: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const assignDispatchToOptions = [
    { value: 1, label: "Aman" },
    { value: 2, label: "Rahul" },
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
    { value: "cancelled", label: "Cancelled" },
    { value: "15_dc", label: "15 DC" },
    { value: "30_dc", label: "30 DC" },
    { value: "45_dc", label: "45 DC" },
    { value: "60_dc", label: "60 DC" },
    { value: "15_lc", label: "15 LC" },
    { value: "30_lc", label: "30 LC" },
    { value: "45_lc", label: "45 LC" },
    { value: "60_lc", label: "60 LC" },
  ];

  // Item detail dropdown options
  const categoryOptions = [
    { value: "module", label: "Module" },
    { value: "invertor", label: "Invertor" },
  ];

  const oemNameOptions = [
    { value: "solis", label: "Solis" },
    { value: "jio", label: "Jio" },
    { value: "dummy1", label: "Dummy1" },
  ];

  const productOptions = [
    { value: "product1", label: "Product1" },
    { value: "product2", label: "Product2" },
  ];

  const warrantyOptions = [
    { value: "3_years", label: "3 Years" },
    { value: "5_years", label: "5 Years" },
    { value: "7_years", label: "7 Years" },
  ];

  const gstPercentOptions = [
    { value: 5, label: "5%" },
    { value: 9, label: "9%" },
    { value: 15, label: "15%" },
    { value: 18, label: "18%" },
  ];

  const updateCalculatedFields = (index: number) => {
    const poItems = form.getFieldValue("poItems") || [];
    const item = poItems[index];
    if (item) {
      const quantity = item.quantity || 0;
      const spareQuantity = item.spareQuantity || 0;
      const pricePerUnit = item.pricePerUnit || 0;
      const gstPercent = item.gstPercent || 0;
      const totalQuantity = quantity + spareQuantity;
      const totalPrice = quantity * pricePerUnit;
      const gstAmount = (totalPrice * gstPercent) / 100;
      const finalPrice = totalPrice + gstAmount;

      const newItems = [...poItems];
      newItems[index] = {
        ...newItems[index],
        totalQuantity,
        totalPrice,
        finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      };
      form.setFieldsValue({ poItems: newItems });
    }
  };

  const getItemColumns = (
    remove: (index: number | number[]) => void
  ): ColumnsType<ItemDetail & { name: number }> => [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "category"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={categoryOptions} />
        </Form.Item>
      ),
    },
    {
      title: "OEM Name",
      dataIndex: "oemName",
      key: "oemName",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "oemName"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={oemNameOptions} />
        </Form.Item>
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "product"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={productOptions} />
        </Form.Item>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "quantity"]}
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 1, message: "Min 1 required" },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Spare Quantity",
      dataIndex: "spareQuantity",
      key: "spareQuantity",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "spareQuantity"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      width: 120,
      render: (_, record) => (
        <Form.Item name={[record.name, "totalQuantity"]} style={{ margin: 0 }}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Price per Unit",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "pricePerUnit"]}
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 1, message: "Min 1 required" },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (_, record) => (
        <Form.Item name={[record.name, "totalPrice"]} style={{ margin: 0 }}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "GST %",
      dataIndex: "gstPercent",
      key: "gstPercent",
      width: 100,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "gstPercent"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select"
            options={gstPercentOptions}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Final Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
      width: 130,
      render: (_, record) => (
        <Form.Item name={[record.name, "finalPrice"]} style={{ margin: 0 }}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Warranty",
      dataIndex: "warranty",
      key: "warranty",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "warranty"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={warrantyOptions} />
        </Form.Item>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      fixed: "right",
      width: 70,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(record.name)}
        />
      ),
    },
  ];

  const onFinish = (values: Record<string, unknown>) => {
    // Generate unique PO ID
    const poId = `OSG-${Date.now().toString().slice(-6)}`;

    // Format dates to string
    const formatDate = (date: dayjs.Dayjs | undefined) => {
      return date ? dayjs(date).format("YYYY-MM-DD") : "";
    };

    // Map uploaded files to PODocument format
    const uploadedDocuments: PODocument[] = fileList.map((file) => ({
      uid: file.uid,
      name: file.name,
      type: file.type || "unknown",
      size: file.size || 0,
      url: file.thumbUrl || URL.createObjectURL(file.originFileObj as Blob),
      uploadedAt: new Date().toISOString(),
    }));

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
      assignDispatchTo: values.assignDispatchTo as number,
      clientAddress: values.clientAddress as string,
      clientContact: values.clientContact as string,
      poItems: values.poItems as POData["poItems"],
      dispatchPlanDate: formatDate(values.dispatchPlanDate as dayjs.Dayjs),
      siteLocation: values.siteLocation as string,
      oscSupport: values.oscSupport as string,
      confirmDateOfDispatch: formatDate(
        values.confirmDateOfDispatch as dayjs.Dayjs
      ),
      paymentStatus: values.paymentStatus as string,
      remarks: values.remarks as string,
      createdAt: new Date().toISOString(),
      uploadedDocuments: uploadedDocuments.length > 0 ? uploadedDocuments : undefined,
    };

    console.log("Form Data:", poData);

    // Dispatch to Redux store
    dispatch(addPO(poData));

    // Reset form and file list
    form.resetFields();
    setFileList([]);

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
        Order Punching
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

        {/* Row 5: Assign Dispatch To */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="assignDispatchTo"
              label="Assign Dispatch To"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select person"
                options={assignDispatchToOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Client Address, Client Contact */}
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

        {/* Row 7: Add Item Details Button & Table with validation */}
        <Form.Item
          name="poItems"
          rules={[{ validator: poItemsValidator }]}
          style={{ marginBottom: 0 }}
        >
          <Form.List name="poItems">
            {(fields, { add, remove }) => (
              <>
                <Row style={{ marginBottom: "1rem" }}>
                  <Col span={24}>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        add({
                          category: undefined,
                          oemName: undefined,
                          product: undefined,
                          quantity: undefined,
                          spareQuantity: undefined,
                          totalQuantity: 0,
                          pricePerUnit: undefined,
                          totalPrice: 0,
                          gstPercent: undefined,
                          finalPrice: 0,
                          warranty: undefined,
                        })
                      }
                      style={{ width: "200px" }}
                    >
                      Add Item Details
                    </Button>
                  </Col>
                </Row>

                {/* Item Details Table */}
                {fields.length > 0 && (
                  <Row style={{ marginBottom: "1.5rem" }}>
                    <Col span={24}>
                      <Table
                        columns={
                          getItemColumns(remove) as ColumnsType<{
                            key: number;
                            name: number;
                          }>
                        }
                        dataSource={fields.map((field) => ({
                          ...field,
                          key: field.key,
                          name: field.name,
                        }))}
                        scroll={{ x: 1550 }}
                        pagination={false}
                        bordered
                        size="small"
                      />
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Form.List>
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
        {/* Upload Documents */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Upload Documents (OSG PI, Client PO)"
              tooltip="Upload up to 2 documents. Supported formats: Images, PDF, Word, Excel"
            >
              <FileUpload
                fileList={fileList}
                onChange={setFileList}
                maxFiles={2}
                maxSizeMB={10}
                buttonLabel="Click to Upload"
                helperText="Supported: Images (JPG, PNG, GIF, SVG), PDF, Word, Excel."
              />
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

export default CreatePO;
