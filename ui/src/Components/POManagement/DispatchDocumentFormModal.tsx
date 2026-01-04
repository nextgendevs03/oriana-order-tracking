import React, { useEffect, useMemo, useState, useRef } from "react";
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
  message,
} from "antd";
import { useUpdateDispatchDocumentsMutation } from "../../store/api/dispatchApi";
import type { DispatchResponse, DispatchedItemResponse } from "@OrianaTypes";
import dayjs from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";
import S3FileUpload, { S3FileUploadRef } from "./S3FileUpload";
import {
  formatLabel,
  noDuesClearanceOptions,
  dispatchStatusOptions,
  textFieldRules,
  selectFieldRules,
  dateFieldRules,
} from "../../utils";

const { Text } = Typography;

interface DispatchDocumentFormModalProps {
  visible: boolean;
  onClose: () => void;
  dispatches: DispatchResponse[];
  editData?: DispatchResponse | null;
  poId?: string;
}

const DispatchDocumentFormModal: React.FC<DispatchDocumentFormModalProps> = ({
  visible,
  onClose,
  dispatches,
  editData = null,
  poId,
}) => {
  const [form] = Form.useForm();
  const selectedDispatchId = Form.useWatch("dispatchId", form);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileUploadRef = useRef<S3FileUploadRef>(null);

  // API mutation
  const [updateDispatchDocuments, { isLoading: isUpdating }] = useUpdateDispatchDocumentsMutation();

  const isEditMode = !!editData;

  // Get dispatch options - disable if already has document (check dispatchStatus field)
  const dispatchOptions = useMemo(() => {
    return dispatches.map((d) => ({
      value: d.dispatchId,
      label: `Dispatch #${d.dispatchId}`,
      disabled: !!d.dispatchStatus && d.dispatchId !== editData?.dispatchId,
    }));
  }, [dispatches, editData]);

  // Get selected dispatch's items for serial number fields
  const selectedDispatch = useMemo(() => {
    return dispatches.find((d) => d.dispatchId === selectedDispatchId);
  }, [dispatches, selectedDispatchId]);

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      const serialNumbers: Record<number, string> = {};
      editData.dispatchedItems?.forEach((item) => {
        serialNumbers[item.productId] = item.serialNumbers || "";
      });

      setFileList([]);

      form.setFieldsValue({
        dispatchId: editData.dispatchId,
        noDuesClearance: editData.noDuesClearance,
        osgPiNo: editData.docOsgPiNo,
        osgPiDate: editData.docOsgPiDate
          ? dayjs(editData.docOsgPiDate)
          : undefined,
        taxInvoiceNumber: editData.taxInvoiceNumber,
        invoiceDate: editData.invoiceDate
          ? dayjs(editData.invoiceDate)
          : undefined,
        ewayBill: editData.ewayBill,
        deliveryChallan: editData.deliveryChallan,
        dispatchDate: editData.dispatchDate
          ? dayjs(editData.dispatchDate)
          : undefined,
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const targetDispatch = dispatches.find((d) => d.dispatchId === values.dispatchId);

      if (!targetDispatch) {
        message.error("Dispatch not found");
        return;
      }

      // Build serial numbers map (productId -> serialNumbers)
      const serialNumbers: Record<number, string> = {};
      if (targetDispatch.dispatchedItems && Array.isArray(targetDispatch.dispatchedItems)) {
        targetDispatch.dispatchedItems.forEach((item) => {
          serialNumbers[item.productId] = values.serialNumbers?.[item.productId] || "";
        });
      }

      // Upload files to S3 if any new files
      if (fileUploadRef.current && fileList.some(f => f.originFileObj)) {
        try {
          await fileUploadRef.current.uploadAndConfirm();
        } catch (error) {
          console.error("File upload failed:", error);
          message.error("Failed to upload files. Please try again.");
          return;
        }
      }

      // Update dispatch documents via API
      await updateDispatchDocuments({
        id: targetDispatch.dispatchId,
        data: {
          noDuesClearance: values.noDuesClearance,
          docOsgPiNo: values.osgPiNo,
          docOsgPiDate: values.osgPiDate
            ? dayjs(values.osgPiDate).format("YYYY-MM-DD")
            : undefined,
          taxInvoiceNumber: values.taxInvoiceNumber,
          invoiceDate: values.invoiceDate
            ? dayjs(values.invoiceDate).format("YYYY-MM-DD")
            : undefined,
          ewayBill: values.ewayBill,
          deliveryChallan: values.deliveryChallan,
          dispatchDate: values.dispatchDate
            ? dayjs(values.dispatchDate).format("YYYY-MM-DD")
            : undefined,
          packagingList: values.packagingList || undefined,
          dispatchFromLocation: values.dispatchFromLocation,
          dispatchStatus: values.dispatchStatus,
          dispatchLrNo: values.dispatchLrNo,
          dispatchRemarks: values.dispatchRemarks || undefined,
          serialNumbers: serialNumbers,
        },
      }).unwrap();

      message.success("Dispatch documents updated successfully");
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
      message.error("Failed to update dispatch documents. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  // Serial number validator - checks if comma-separated count matches quantity
  const getSerialNumberValidator = (quantity: number) => {
    return async (_: unknown, value: string) => {
      if (!value || value.trim() === "") {
        return Promise.reject(new Error("Serial numbers are required"));
      }

      const serialNumbersList = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      if (serialNumbersList.length !== quantity) {
        return Promise.reject(
          new Error(
            `Please enter exactly ${quantity} serial number${quantity > 1 ? "s" : ""}. You entered ${serialNumbersList.length}.`
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
        <Button key="cancel" onClick={handleCancel} disabled={isUpdating}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isUpdating}
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
            <Form.Item name="osgPiNo" label="OSG PI No" rules={textFieldRules}>
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
            <Form.Item name="packagingList" label="Packaging List (Optional)">
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
              {selectedDispatch.dispatchedItems.map((item: DispatchedItemResponse) => (
                <Col span={12} key={item.productId}>
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
                        {formatLabel(item.productName || "")} (Qty: {item.quantity})
                      </Text>
                    </div>
                    <Form.Item
                      name={["serialNumbers", item.productId]}
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
            <Form.Item
              name="dispatchRemarks"
              label="Dispatch Remarks (Optional)"
            >
              <Input.TextArea placeholder="Enter dispatch remarks" rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Upload Dispatch Documents */}
        <Form.Item
          label="Upload Dispatch Documents (OSG PI, Tax Invoice, E-way bill, Delivery Challan, LR Copy)"
          tooltip="Upload up to 5 documents. Supported formats: Images, PDF, Word, Excel"
        >
          <S3FileUpload
            ref={fileUploadRef}
            fileList={fileList}
            onChange={setFileList}
            minFiles={0}
            maxFiles={5}
            maxSizeMB={10}
            buttonLabel="Click to Upload Documents"
            helperText="Supported formats: Images (JPG, PNG, GIF, SVG), PDF, Excel, Word documents."
            poId={poId}
            entityType="dispatch_document"
            entityId={selectedDispatchId?.toString()}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DispatchDocumentFormModal;
