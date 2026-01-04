import React, { useEffect, useMemo, useState, useRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Button, DatePicker, Spin, Alert } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import S3FileUpload, { S3FileUploadRef } from "./S3FileUpload";
import { formatLabel, selectFieldRules } from "../../utils";
import dayjs from "dayjs";
import {
  useGetEligiblePreCommissioningsQuery,
  useCreateCommissioningMutation,
  useUpdateCommissioningMutation,
} from "../../store/api/commissioningApi";
import { useToast } from "../../hooks/useToast";
import type { CommissioningResponse } from "@OrianaTypes";

interface CommissioningFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  editData?: CommissioningResponse | null;
}

const CommissioningFormModal: React.FC<CommissioningFormModalProps> = ({
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

  const { data: eligiblePreCommissionings = [], isLoading: isLoadingEligible } =
    useGetEligiblePreCommissioningsQuery(poId, { skip: !visible || isEditMode });

  const [createCommissioning, { isLoading: isCreating }] = useCreateCommissioningMutation();
  const [updateCommissioning, { isLoading: isUpdating }] = useUpdateCommissioningMutation();

  const statusOptions = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
    { value: "Hold", label: "Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const serialOptions = useMemo(() => {
    if (isEditMode && editData) {
      return [{
        value: `${editData.preCommissioningId}__${editData.serialNumber}`,
        label: `${editData.serialNumber} (${formatLabel(editData.productName || "")} - #${editData.dispatchId})`,
      }];
    }
    return eligiblePreCommissionings.map((pc) => ({
      value: `${pc.preCommissioningId}__${pc.serialNumber}`,
      label: `${pc.serialNumber} (${formatLabel(pc.productName)} - #${pc.dispatchId})`,
    }));
  }, [eligiblePreCommissionings, isEditMode, editData]);

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
        serialNumbers: [`${editData.preCommissioningId}__${editData.serialNumber}`],
        ecdFromClient: editData.ecdFromClient,
        serviceTicketNo: editData.serviceTicketNo,
        ccdFromClient: editData.ccdFromClient,
        issues: editData.issues,
        solution: editData.solution,
        infoGenerated: editData.infoGenerated,
        commissioningDate: editData.commissioningDate ? dayjs(editData.commissioningDate) : null,
        commissioningStatus: editData.commissioningStatus,
        remarks: editData.remarks,
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
        await updateCommissioning({
          id: editData.commissioningId,
          data: {
            ecdFromClient: values.ecdFromClient || "",
            serviceTicketNo: values.serviceTicketNo || "",
            ccdFromClient: values.ccdFromClient || "",
            issues: values.issues || "",
            solution: values.solution || "",
            infoGenerated: values.infoGenerated || "",
            commissioningDate: values.commissioningDate?.format("YYYY-MM-DD"),
            commissioningStatus: values.commissioningStatus,
            remarks: values.remarks || "",
            fileIds,
          },
        }).unwrap();
        toast.success("Commissioning updated successfully");
      } else {
        const items = values.serialNumbers.map((serialValue: string) => {
          const [preCommissioningId] = serialValue.split("__");
          return { preCommissioningId: parseInt(preCommissioningId, 10) };
        });
        await createCommissioning({
          items,
          ecdFromClient: values.ecdFromClient || "",
          serviceTicketNo: values.serviceTicketNo || "",
          ccdFromClient: values.ccdFromClient || "",
          issues: values.issues || "",
          solution: values.solution || "",
          infoGenerated: values.infoGenerated || "",
          commissioningDate: values.commissioningDate?.format("YYYY-MM-DD"),
          commissioningStatus: values.commissioningStatus,
          remarks: values.remarks || "",
          fileIds,
        }).unwrap();
        toast.success(`${items.length} commissioning record(s) created`);
      }
      handleCancel();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to save commissioning details");
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
      title={isEditMode ? "Edit Commissioning" : "Add Commissioning"}
      open={visible}
      onCancel={handleCancel}
      width={900}
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
        <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /><p>Loading eligible pre-commissionings...</p></div>
      ) : !isEditMode && serialOptions.length === 0 ? (
        <Alert type="info" message="No Eligible Pre-Commissionings"
          description="Pre-commissionings become eligible when their status is 'Done'." showIcon />
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
              <Form.Item name="ecdFromClient" label="ECD From Client">
                <Input placeholder="Expected commissioning date from client" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serviceTicketNo" label="Service Ticket No">
                <Input placeholder="Service ticket number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="ccdFromClient" label="CCD From Client">
                <Input placeholder="Confirmed commissioning date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="commissioningDate" label="Commissioning Date">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="infoGenerated" label="Info Generated">
                <Input placeholder="Info details" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="commissioningStatus" label="Status" rules={selectFieldRules}>
                <Select placeholder="Select status" options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="issues" label="Issues">
                <Input.TextArea placeholder="Issues faced" rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="solution" label="Solution">
                <Input.TextArea placeholder="Solution provided" rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea placeholder="Enter remarks" rows={2} />
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
                  buttonLabel="Upload Commissioning Documents"
                  poId={poId}
                  entityType="commissioning"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default CommissioningFormModal;
