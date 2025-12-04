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

interface WarrantyCertificateFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  editData?: PreCommissioning | null;
}

const WarrantyCertificateFormModal: React.FC<WarrantyCertificateFormModalProps> = ({
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

  // Get serial numbers from records with commissioningStatus === "Done"
  const serialOptions = useMemo(() => {
    return preCommissioningDetails
      .filter(
        (pc) =>
          pc.poId === poId &&
          pc.commissioningStatus === "Done" &&
          // Exclude already warranty-processed items unless editing that specific item
          (!pc.warrantyStatus || pc.id === editData?.id)
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

  // Warranty Status options
  const warrantyStatusOptions = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
    { value: "Hold", label: "Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      // Initialize file list from existing documents
      if (editData.warrantyDocuments && editData.warrantyDocuments.length > 0) {
        const existingFiles: UploadFile[] = editData.warrantyDocuments.map((doc) => ({
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
        warrantyCertificateNo: editData.warrantyCertificateNo,
        issueDate: editData.warrantyIssueDate
          ? dayjs(editData.warrantyIssueDate)
          : undefined,
        warrantyStartDate: editData.warrantyStartDate
          ? dayjs(editData.warrantyStartDate)
          : undefined,
        warrantyEndDate: editData.warrantyEndDate
          ? dayjs(editData.warrantyEndDate)
          : undefined,
        warrantyStatus: editData.warrantyStatus,
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
      const warrantyDocuments: DispatchDocument[] = fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        type: file.type || "",
        size: file.size || 0,
        url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
        uploadedAt: new Date().toISOString(),
      }));

      // Get selected pre-commissioning IDs (can be multiple in add mode)
      const selectedIds: string[] = values.preCommissioningIds;

      // Update each selected record with warranty data
      selectedIds.forEach((pcId: string) => {
        const preCommRecord = preCommissioningDetails.find(
          (pc) => pc.id === pcId
        );

        if (preCommRecord) {
          const updatedRecord: PreCommissioning = {
            ...preCommRecord,
            warrantyCertificateNo: values.warrantyCertificateNo || "",
            warrantyIssueDate: values.issueDate?.format("YYYY-MM-DD") || "",
            warrantyStartDate: values.warrantyStartDate?.format("YYYY-MM-DD") || "",
            warrantyEndDate: values.warrantyEndDate?.format("YYYY-MM-DD") || "",
            warrantyStatus: values.warrantyStatus || "",
            warrantyDocuments: warrantyDocuments,
            warrantyUpdatedAt: new Date().toISOString(),
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
          ? "Edit Warranty Details"
          : "Update Warranty Details"
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
                placeholder="Select serial numbers from commissioning (Done status)"
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

        {/* Row 2: Warranty Certificate No */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="warrantyCertificateNo"
              label="Warranty Certificate No"
              rules={textFieldRules}
            >
              <Input placeholder="Enter warranty certificate number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Issue Date, Warranty Start Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="issueDate"
              label="Issue Date"
              rules={[{ required: true, message: "Please select issue date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="warrantyStartDate"
              label="Warranty Start Date"
              rules={[{ required: true, message: "Please select warranty start date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Warranty End Date, Warranty Status */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="warrantyEndDate"
              label="Warranty End Date"
              rules={[{ required: true, message: "Please select warranty end date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="warrantyStatus"
              label="Warranty Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select warranty status"
                options={warrantyStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Upload Documents */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Upload Documents (Warranty certificate shared with client)"
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

export default WarrantyCertificateFormModal;

