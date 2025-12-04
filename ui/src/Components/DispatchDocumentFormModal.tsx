import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Card,
  Typography,
} from "antd";
import { useAppDispatch } from "../store/hooks";
import {
  updateDispatchDetail,
  DispatchDetail,
  DispatchedItem,
  DispatchDocument,
} from "../store/poSlice";
import dayjs from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";
import FileUpload from "./FileUpload";

const { Text } = Typography;

interface DispatchDocumentFormModalProps {
  visible: boolean;
  onClose: () => void;
  dispatches: DispatchDetail[];
  editData?: DispatchDetail | null;
}

const DispatchDocumentFormModal: React.FC<DispatchDocumentFormModalProps> = ({
  visible,
  onClose,
  dispatches,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const selectedDispatchId = Form.useWatch("dispatchId", form);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditMode = !!editData;

  // Dropdown options
  const noDuesClearanceOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "on_hold", label: "On Hold" },
  ];

  const dispatchStatusOptions = [
    { value: "done", label: "Done" },
    { value: "pending", label: "Pending" },
    { value: "hold", label: "Hold" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Get dispatch options - disable if already has document (check dispatchStatus field)
  const dispatchOptions = useMemo(() => {
    return dispatches.map((d) => ({
      value: d.id,
      label: d.id,
      disabled: !!d.dispatchStatus && d.id !== editData?.id,
    }));
  }, [dispatches, editData]);

  // Get selected dispatch's items for serial number fields
  const selectedDispatch = useMemo(() => {
    return dispatches.find((d) => d.id === selectedDispatchId);
  }, [dispatches, selectedDispatchId]);

  // Initialize form with edit data (flat properties)
  useEffect(() => {
    if (visible && editData) {
      const serialNumbers: Record<string, string> = {};
      editData.dispatchedItems?.forEach((item) => {
        serialNumbers[item.product] = item.serialNumbers || "";
      });

      // Initialize file list from existing documents
      if (editData.dispatchDocuments && editData.dispatchDocuments.length > 0) {
        const existingFiles: UploadFile[] = editData.dispatchDocuments.map((doc) => ({
          uid: doc.uid,
          name: doc.name,
          status: 'done',
          url: doc.url,
          type: doc.type,
          size: doc.size,
        }));
        setFileList(existingFiles);
      } else {
        setFileList([]);
      }

      form.setFieldsValue({
        dispatchId: editData.id,
        noDuesClearance: editData.noDuesClearance,
        osgPiNo: editData.docOsgPiNo,
        osgPiDate: editData.docOsgPiDate ? dayjs(editData.docOsgPiDate) : undefined,
        taxInvoiceNumber: editData.taxInvoiceNumber,
        invoiceDate: editData.invoiceDate ? dayjs(editData.invoiceDate) : undefined,
        ewayBill: editData.ewayBill,
        deliveryChallan: editData.deliveryChallan,
        dispatchDate: editData.dispatchDate ? dayjs(editData.dispatchDate) : undefined,
        packagingList: editData.packagingList,
        dispatchFromLocation: editData.dispatchFromLocation,
        dispatchStatus: editData.dispatchStatus,
        dispatchLrNo: editData.dispatchLrNo,
        dispatchRemarks: editData.dispatchRemarks,
        serialNumbers: serialNumbers,
      });
    } else if (visible && !editData) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, editData, form]);

  const formatLabel = (value: string) => {
    if (!value) return "";
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const targetDispatch = dispatches.find(
        (d) => d.id === values.dispatchId
      );

      if (!targetDispatch) {
        console.error("Dispatch not found");
        return;
      }

      // Build updated dispatchedItems with serial numbers
      const updatedDispatchedItems: DispatchedItem[] =
        targetDispatch.dispatchedItems.map((item) => ({
          ...item,
          serialNumbers: values.serialNumbers?.[item.product] || "",
        }));

      // Convert file list to dispatch documents
      const dispatchDocuments: DispatchDocument[] = fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        type: file.type || '',
        size: file.size || 0,
        url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''),
        uploadedAt: new Date().toISOString(),
      }));

      // Update the dispatch with flat document fields
      const updatedDispatch: DispatchDetail = {
        ...targetDispatch,
        dispatchedItems: updatedDispatchedItems,
        // Document fields (flat)
        noDuesClearance: values.noDuesClearance,
        docOsgPiNo: values.osgPiNo,
        docOsgPiDate: values.osgPiDate
          ? dayjs(values.osgPiDate).format("YYYY-MM-DD")
          : "",
        taxInvoiceNumber: values.taxInvoiceNumber,
        invoiceDate: values.invoiceDate
          ? dayjs(values.invoiceDate).format("YYYY-MM-DD")
          : "",
        ewayBill: values.ewayBill,
        deliveryChallan: values.deliveryChallan,
        dispatchDate: values.dispatchDate
          ? dayjs(values.dispatchDate).format("YYYY-MM-DD")
          : "",
        packagingList: values.packagingList || "",
        dispatchFromLocation: values.dispatchFromLocation,
        dispatchStatus: values.dispatchStatus,
        dispatchLrNo: values.dispatchLrNo,
        dispatchRemarks: values.dispatchRemarks || "",
        dispatchDocuments: dispatchDocuments,
        documentUpdatedAt: new Date().toISOString(),
      };

      dispatch(updateDispatchDetail(updatedDispatch));

      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const textFieldRules = [
    { required: true, message: "This field is required" },
  ];

  const selectFieldRules = [
    { required: true, message: "Please select an option" },
  ];

  const dateFieldRules = [{ required: true, message: "Please select a date" }];

  // Serial number validator - checks if comma-separated count matches quantity
  const getSerialNumberValidator = (quantity: number) => {
    return async (_: unknown, value: string) => {
      if (!value || value.trim() === "") {
        return Promise.reject(new Error("Serial numbers are required"));
      }

      // Split by comma and filter out empty values
      const serialNumbers = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      if (serialNumbers.length !== quantity) {
        return Promise.reject(
          new Error(
            `Please enter exactly ${quantity} serial number${quantity > 1 ? "s" : ""}. You entered ${serialNumbers.length}.`
          )
        );
      }

      return Promise.resolve();
    };
  };

  return (
    <Modal
      title={isEditMode ? "Edit Dispatch Document" : "Update Dispatch Document"}
      open={visible}
      onCancel={handleCancel}
      width={1000}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#4b6cb7",
          }}
        >
          {isEditMode ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: "1rem" }}
      >
        {/* Row 1: Select Dispatch */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dispatchId"
              label="Select Dispatch"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select dispatch"
                options={dispatchOptions}
                disabled={isEditMode}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="noDuesClearance"
              label="No Dues Clearance"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select status"
                options={noDuesClearanceOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: OSG PI No, OSG PI Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="osgPiNo"
              label="OSG PI No"
              rules={textFieldRules}
            >
              <Input placeholder="Enter OSG PI No" />
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

        {/* Row 3: Tax Invoice Number, Invoice Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="taxInvoiceNumber"
              label="Tax Invoice Number"
              rules={textFieldRules}
            >
              <Input placeholder="Enter tax invoice number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="invoiceDate"
              label="Invoice Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: E-way Bill, Delivery Challan */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="ewayBill"
              label="E-way Bill"
              rules={textFieldRules}
            >
              <Input placeholder="Enter e-way bill" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deliveryChallan"
              label="Delivery Challan"
              rules={textFieldRules}
            >
              <Input placeholder="Enter delivery challan" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Dispatch Date, Packaging List */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dispatchDate"
              label="Dispatch Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="packagingList"
              label="Packaging List (Optional)"
            >
              <Input placeholder="Enter packaging list" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Dispatch From Location */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dispatchFromLocation"
              label="Dispatch From Location"
              rules={textFieldRules}
            >
              <Input placeholder="Enter dispatch from location" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dispatchStatus"
              label="Dispatch Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select dispatch status"
                options={dispatchStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Serial Numbers Section - Dynamic based on selected dispatch */}
        {selectedDispatch && selectedDispatch.dispatchedItems.length > 0 && (
          <Card
            title="Serial Numbers (Comma separated for each quantity)"
            size="small"
            style={{ marginBottom: "1rem" }}
          >
            <Row gutter={[16, 8]}>
              {selectedDispatch.dispatchedItems.map((item) => (
                <Col span={12} key={item.product}>
                  <div
                    style={{
                      padding: "12px",
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <Text strong>
                        {formatLabel(item.product)} (Qty: {item.quantity})
                      </Text>
                    </div>
                    <Form.Item
                      name={["serialNumbers", item.product]}
                      rules={[
                        { validator: getSerialNumberValidator(item.quantity) },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input.TextArea
                        placeholder={`Enter ${item.quantity} serial number${item.quantity > 1 ? "s" : ""} (comma separated)`}
                        rows={2}
                      />
                    </Form.Item>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* Row 7: Dispatch LR No, Dispatch Remarks */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dispatchLrNo"
              label="Dispatch LR No. / Ref No."
              rules={textFieldRules}
            >
              <Input placeholder="Enter dispatch LR No. / Ref No." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dispatchRemarks" label="Dispatch Remarks (Optional)">
              <Input.TextArea placeholder="Enter dispatch remarks" rows={2} />
            </Form.Item>
          </Col>
        </Row>
        {/* Upload Dispatch Documents */}
        <Form.Item
          label="Upload Dispatch Documents (OSG PI, Tax Invoice, E-way bill, Delivery Challan, LR Copy)"
          tooltip="Upload up to 5 documents. Supported formats: Images, PDF, Word, Excel"
        >
          <FileUpload
            fileList={fileList}
            onChange={setFileList}
            minFiles={5}
            maxFiles={5}
            maxSizeMB={10}
            buttonLabel="Click to Upload Documents"
            helperText="Supported formats: Images (JPG, PNG, GIF, SVG), PDF, Excel, Word documents."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DispatchDocumentFormModal;

