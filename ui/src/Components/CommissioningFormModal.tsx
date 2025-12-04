import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updatePreCommissioning,
  PreCommissioning,
  DispatchDocument,
} from "../store/poSlice";
import type { UploadFile } from "antd/es/upload/interface";
import FileUpload from "./FileUpload";

interface CommissioningFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  editData?: PreCommissioning | null;
}

const CommissioningFormModal: React.FC<CommissioningFormModalProps> = ({
  visible,
  onClose,
  poId,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const preCommissioningDetails = useAppSelector(
    (state) => state.po.preCommissioningDetails
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditMode = !!editData;

  // Get serial numbers from pre-commissioning records with "Done" preCommissioningStatus
  const serialOptions = useMemo(() => {
    return preCommissioningDetails
      .filter(
        (pc) =>
          pc.poId === poId &&
          pc.preCommissioningStatus === "Done" &&
          // Exclude already commissioned items unless editing that specific item
          (!pc.commissioningStatus || pc.id === editData?.id)
      )
      .map((pc) => ({
        value: pc.id,
        label: `${pc.serialNumber} (${pc.product})`,
      }));
  }, [preCommissioningDetails, poId, editData]);

  const textFieldRules = [
    { required: true, message: "This field is required" },
  ];

  const selectFieldRules = [
    { required: true, message: "Please select an option" },
  ];

  // Commissioning Status options
  const commissioningStatusOptions = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
    { value: "Hold", label: "Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      // Initialize file list from existing documents
      if (editData.commissioningDocuments && editData.commissioningDocuments.length > 0) {
        const existingFiles: UploadFile[] = editData.commissioningDocuments.map((doc) => ({
          uid: doc.uid,
          name: doc.name,
          status: "done",
          url: doc.url,
          type: doc.type,
          size: doc.size,
        }));
        setFileList(existingFiles);
      } else {
        setFileList([]);
      }

      form.setFieldsValue({
        preCommissioningIds: [editData.id],
        ecdFromClient: editData.commissioningEcdFromClient,
        serviceTicketNo: editData.commissioningServiceTicketNo,
        ccdFromClient: editData.commissioningCcdFromClient,
        issuesInCommissioning: editData.commissioningIssues,
        solutionOnIssues: editData.commissioningSolution,
        infoGenerated: editData.commissioningInfoGenerated,
        commissioningDate: editData.commissioningDate
          ? dayjs(editData.commissioningDate)
          : undefined,
        commissioningStatus: editData.commissioningStatus,
        remarks: editData.commissioningRemarks,
      });
    } else if (visible && !editData) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, editData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert file list to documents
      const commissioningDocuments: DispatchDocument[] = fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        type: file.type || "",
        size: file.size || 0,
        url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
        uploadedAt: new Date().toISOString(),
      }));

      // Get selected pre-commissioning IDs (can be multiple in add mode)
      const selectedIds: string[] = values.preCommissioningIds;

      // Update each selected pre-commissioning record with commissioning data
      selectedIds.forEach((pcId: string) => {
        const preCommRecord = preCommissioningDetails.find(
          (pc) => pc.id === pcId
        );

        if (preCommRecord) {
          const updatedRecord: PreCommissioning = {
            ...preCommRecord,
            commissioningEcdFromClient: values.ecdFromClient || "",
            commissioningServiceTicketNo: values.serviceTicketNo || "",
            commissioningCcdFromClient: values.ccdFromClient || "",
            commissioningIssues: values.issuesInCommissioning || "",
            commissioningSolution: values.solutionOnIssues || "",
            commissioningInfoGenerated: values.infoGenerated || "",
            commissioningDate: values.commissioningDate?.format("YYYY-MM-DD") || "",
            commissioningStatus: values.commissioningStatus || "",
            commissioningRemarks: values.remarks || "",
            commissioningDocuments: commissioningDocuments,
            commissioningUpdatedAt: new Date().toISOString(),
          };

          dispatch(updatePreCommissioning(updatedRecord));
        }
      });

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

  return (
    <Modal
      title={
        isEditMode
          ? "Edit Commissioning Details"
          : "Update Commissioning Details"
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
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
        {/* Row 1: Serial Numbers (Multi-select) */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="preCommissioningIds"
              label="Serial Numbers"
              rules={[
                {
                  required: true,
                  message: "Please select at least one serial number",
                },
              ]}
            >
              <Select
                mode={isEditMode ? undefined : "multiple"}
                placeholder="Select serial numbers from pre-commissioning (Done status)"
                options={serialOptions}
                maxTagCount="responsive"
                disabled={isEditMode}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: ECD from Client, Service Ticket No */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="ecdFromClient"
              label="ECD from Client"
              rules={textFieldRules}
            >
              <Input placeholder="Expected Commissioning date from client" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="serviceTicketNo"
              label="Service Ticket No from OEM"
              rules={textFieldRules}
            >
              <Input placeholder="Enter service ticket number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: CCD from Client, Info Generated */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="ccdFromClient"
              label="CCD from Client"
              rules={textFieldRules}
            >
              <Input placeholder="Confirm Commissioning date from client" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="infoGenerated"
              label="Information Generated"
              rules={textFieldRules}
            >
              <Input placeholder="Enter information generated" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Issues in Commissioning */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="issuesInCommissioning"
              label="Issues in Commissioning"
              rules={textFieldRules}
            >
              <Input.TextArea
                placeholder="Enter issues in commissioning"
                rows={2}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Solution on Issues */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="solutionOnIssues"
              label="Solution on Issues"
              rules={textFieldRules}
            >
              <Input.TextArea
                placeholder="Enter solution on issues"
                rows={2}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Commissioning Date, Status */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="commissioningDate"
              label="Commissioning Date"
              rules={[{ required: true, message: "Please select commissioning date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="commissioningStatus"
              label="Commissioning Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select commissioning status"
                options={commissioningStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 7: Remarks (Optional) */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea placeholder="Enter remarks (optional)" rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 8: Upload Documents */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Upload Documents (Info document During Commissioning)"
              tooltip="Upload 1-5 documents. Supported formats: Images, PDF, Word, Excel"
            >
              <FileUpload
                fileList={fileList}
                onChange={setFileList}
                minFiles={1}
                maxFiles={5}
                maxSizeMB={10}
                buttonLabel="Click to Upload"
                helperText="Supported: Images (JPG, PNG, GIF, SVG), PDF, Word, Excel."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CommissioningFormModal;

