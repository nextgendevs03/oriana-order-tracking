import React, { useEffect, useMemo, useState, useRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Button, DatePicker, Spin, Alert } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import S3FileUpload, { S3FileUploadRef } from "./S3FileUpload";
import { formatLabel, selectFieldRules } from "../../utils";
import dayjs from "dayjs";
import {
  useGetEligibleCommissioningsQuery,
  useCreateWarrantyCertificateMutation,
  useUpdateWarrantyCertificateMutation,
} from "../../store/api/warrantyCertificateApi";
import { useToast } from "../../hooks/useToast";
import type { WarrantyCertificateResponse } from "@OrianaTypes";

interface WarrantyCertificateFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  editData?: WarrantyCertificateResponse | null;
}

const WarrantyCertificateFormModal: React.FC<WarrantyCertificateFormModalProps> = ({
  visible,
  onClose,
  poId,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileUploadRef = useRef<S3FileUploadRef>(null);

  const isEditMode = !!editData;

  const { data: eligibleCommissionings = [], isLoading: isLoadingEligible } =
    useGetEligibleCommissioningsQuery(poId, { skip: !visible || isEditMode });

  const [createWarrantyCertificate, { isLoading: isCreating }] = useCreateWarrantyCertificateMutation();
  const [updateWarrantyCertificate, { isLoading: isUpdating }] = useUpdateWarrantyCertificateMutation();

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Expired", label: "Expired" },
    { value: "Done", label: "Done" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const serialOptions = useMemo(() => {
    if (isEditMode && editData) {
      return [{
        value: `${editData.commissioningId}__${editData.serialNumber}`,
        label: `${editData.serialNumber} (${formatLabel(editData.productName || "")} - #${editData.dispatchId})`,
      }];
    }
    return eligibleCommissionings.map((c) => ({
      value: `${c.commissioningId}__${c.serialNumber}`,
      label: `${c.serialNumber} (${formatLabel(c.productName)} - #${c.dispatchId})`,
    }));
  }, [eligibleCommissionings, isEditMode, editData]);

  useEffect(() => {
    if (visible && editData) {
      if (editData.files?.length) {
        setFileList(editData.files.map((f) => ({
          uid: `existing-${f.fileId}`,
          name: f.originalFileName,
          status: "done" as const,
          size: f.fileSize,
        })));
      } else {
        setFileList([]);
      }
      form.setFieldsValue({
        serialNumbers: [`${editData.commissioningId}__${editData.serialNumber}`],
        certificateNo: editData.certificateNo,
        issueDate: editData.issueDate ? dayjs(editData.issueDate) : null,
        warrantyStartDate: editData.warrantyStartDate ? dayjs(editData.warrantyStartDate) : null,
        warrantyEndDate: editData.warrantyEndDate ? dayjs(editData.warrantyEndDate) : null,
        warrantyStatus: editData.warrantyStatus,
      });
    } else if (visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, editData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Upload files to S3 and get file IDs
      const fileIds = fileUploadRef.current 
        ? await fileUploadRef.current.uploadAndConfirm()
        : [];

      if (isEditMode && editData) {
        await updateWarrantyCertificate({
          id: editData.warrantyCertificateId,
          data: {
            certificateNo: values.certificateNo,
            issueDate: values.issueDate?.format("YYYY-MM-DD"),
            warrantyStartDate: values.warrantyStartDate?.format("YYYY-MM-DD"),
            warrantyEndDate: values.warrantyEndDate?.format("YYYY-MM-DD"),
            warrantyStatus: values.warrantyStatus,
            fileIds,
          },
        }).unwrap();
        toast.success("Warranty certificate updated successfully");
      } else {
        const items = values.serialNumbers.map((serialValue: string) => {
          const [commissioningId] = serialValue.split("__");
          return { commissioningId: parseInt(commissioningId, 10) };
        });
        await createWarrantyCertificate({
          items,
          certificateNo: values.certificateNo,
          issueDate: values.issueDate?.format("YYYY-MM-DD"),
          warrantyStartDate: values.warrantyStartDate?.format("YYYY-MM-DD"),
          warrantyEndDate: values.warrantyEndDate?.format("YYYY-MM-DD"),
          warrantyStatus: values.warrantyStatus,
          fileIds,
        }).unwrap();
        toast.success(`${items.length} warranty certificate(s) created`);
      }
      handleCancel();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to save warranty certificate");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const isSubmitting = isCreating || isUpdating || (fileUploadRef.current?.isUploading ?? false);

  return (
    <Modal
      title={isEditMode ? "Edit Warranty Certificate" : "Add Warranty Certificate"}
      open={visible}
      onCancel={handleCancel}
      width={800}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={isSubmitting}
          style={{ backgroundColor: "#4b6cb7" }}>
          {isEditMode ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      {isLoadingEligible && !isEditMode ? (
        <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /><p>Loading eligible commissionings...</p></div>
      ) : !isEditMode && serialOptions.length === 0 ? (
        <Alert type="info" message="No Eligible Commissionings"
          description="Commissionings become eligible when their status is 'Done'." showIcon />
      ) : (
        <Form form={form} layout="vertical" autoComplete="off" style={{ marginTop: "1rem" }}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="serialNumbers" label="Serial Numbers"
                rules={[{ required: true, message: "Select at least one serial" }]}>
                <Select mode={isEditMode ? undefined : "multiple"} placeholder="Select serials"
                  options={serialOptions} maxTagCount="responsive" disabled={isEditMode} showSearch
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="certificateNo" label="Certificate No"
                rules={[{ required: true, message: "Enter certificate number" }]}>
                <Input placeholder="Warranty certificate number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="issueDate" label="Issue Date"
                rules={[{ required: true, message: "Select issue date" }]}>
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="warrantyStartDate" label="Warranty Start Date"
                rules={[{ required: true, message: "Select start date" }]}>
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="warrantyEndDate" label="Warranty End Date"
                rules={[{ required: true, message: "Select end date" }]}>
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="warrantyStatus" label="Status" rules={selectFieldRules}>
                <Select placeholder="Select status" options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Upload Documents">
                <S3FileUpload
                  ref={fileUploadRef}
                  fileList={fileList}
                  onChange={setFileList}
                  maxFiles={5}
                  maxSizeMB={10}
                  buttonLabel="Upload Warranty Documents"
                  poId={poId}
                  entityType="warranty_certificate"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default WarrantyCertificateFormModal;
