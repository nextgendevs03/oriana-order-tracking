import React, { useEffect, useMemo, useState, useRef } from "react";
import { Modal, Form, Input, Select, Row, Col, Button, Spin, Alert } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import S3FileUpload, { S3FileUploadRef } from "./S3FileUpload";
import { formatLabel, textFieldRules, selectFieldRules } from "../../utils";
import {
  useGetEligibleSerialsQuery,
  useCreatePreCommissioningMutation,
  useUpdatePreCommissioningMutation,
} from "../../store/api/preCommissioningApi";
import { useToast } from "../../hooks/useToast";
import type {
  PreCommissioningResponse,
  DispatchResponse,
} from "@OrianaTypes";

interface PreCommissioningFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  dispatches: DispatchResponse[];
  editData?: PreCommissioningResponse | null;
}

const PreCommissioningFormModal: React.FC<PreCommissioningFormModalProps> = ({
  visible,
  onClose,
  poId,
  dispatches,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileUploadRef = useRef<S3FileUploadRef>(null);

  const isEditMode = !!editData;

  const { data: eligibleSerials = [], isLoading: isLoadingSerials } =
    useGetEligibleSerialsQuery(poId, { skip: !visible || isEditMode });

  const [createPreCommissioning, { isLoading: isCreating }] =
    useCreatePreCommissioningMutation();
  const [updatePreCommissioning, { isLoading: isUpdating }] =
    useUpdatePreCommissioningMutation();

  const statusOptions = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
    { value: "Hold", label: "Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const serialOptions = useMemo(() => {
    if (isEditMode && editData) {
      return [{
        value: `${editData.dispatchId}__${editData.productName}__${editData.serialNumber}`,
        label: `${editData.serialNumber} (${formatLabel(editData.productName)} - #${editData.dispatchId})`,
      }];
    }
    return eligibleSerials.map((s) => ({
      value: `${s.dispatchId}__${s.productName}__${s.serialNumber}`,
      label: `${s.serialNumber} (${formatLabel(s.productName)} - #${s.dispatchId})`,
    }));
  }, [eligibleSerials, isEditMode, editData]);

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
        serialNumbers: [`${editData.dispatchId}__${editData.productName}__${editData.serialNumber}`],
        pcContact: editData.pcContact,
        serviceEngineerAssigned: editData.serviceEngineerAssigned,
        ppmChecklist: editData.ppmChecklist,
        ppmSheetReceivedFromClient: editData.ppmSheetReceivedFromClient,
        ppmChecklistSharedWithOem: editData.ppmChecklistSharedWithOem,
        ppmTickedNoFromOem: editData.ppmTickedNoFromOem,
        ppmConfirmationStatus: editData.ppmConfirmationStatus,
        oemComments: editData.oemComments,
        preCommissioningStatus: editData.preCommissioningStatus,
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
        await updatePreCommissioning({
          id: editData.preCommissioningId,
          data: {
            pcContact: values.pcContact,
            serviceEngineerAssigned: values.serviceEngineerAssigned,
            ppmChecklist: values.ppmChecklist,
            ppmSheetReceivedFromClient: values.ppmSheetReceivedFromClient,
            ppmChecklistSharedWithOem: values.ppmChecklistSharedWithOem,
            ppmTickedNoFromOem: values.ppmTickedNoFromOem,
            ppmConfirmationStatus: values.ppmConfirmationStatus,
            oemComments: values.oemComments || "",
            preCommissioningStatus: values.preCommissioningStatus,
            remarks: values.remarks || "",
            fileIds,
          },
        }).unwrap();
        toast.success("Pre-commissioning updated successfully");
      } else {
        const items = values.serialNumbers.map((serialValue: string) => {
          const [dispatchId, productName, serialNumber] = serialValue.split("__");
          return { dispatchId: parseInt(dispatchId, 10), serialNumber, productName };
        });
        await createPreCommissioning({
          items,
          pcContact: values.pcContact,
          serviceEngineerAssigned: values.serviceEngineerAssigned,
          ppmChecklist: values.ppmChecklist,
          ppmSheetReceivedFromClient: values.ppmSheetReceivedFromClient,
          ppmChecklistSharedWithOem: values.ppmChecklistSharedWithOem,
          ppmTickedNoFromOem: values.ppmTickedNoFromOem,
          ppmConfirmationStatus: values.ppmConfirmationStatus,
          oemComments: values.oemComments || "",
          preCommissioningStatus: values.preCommissioningStatus,
          remarks: values.remarks || "",
          fileIds,
        }).unwrap();
        toast.success(`${items.length} pre-commissioning record(s) created`);
      }
      handleCancel();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to save pre-commissioning details");
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
      title={isEditMode ? "Edit Pre-Commissioning" : "Add Pre-Commissioning"}
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
      {isLoadingSerials && !isEditMode ? (
        <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /><p>Loading eligible serials...</p></div>
      ) : !isEditMode && serialOptions.length === 0 ? (
        <Alert type="info" message="No Eligible Serial Numbers"
          description="Serial numbers become eligible when dispatch delivery status is 'Done'." showIcon />
      ) : (
        <Form form={form} layout="vertical" autoComplete="off" style={{ marginTop: "1rem" }}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="serialNumbers" label="Serial Numbers"
                rules={[{ required: true, message: "Select at least one serial number" }]}>
                <Select mode={isEditMode ? undefined : "multiple"} placeholder="Select serial numbers"
                  options={serialOptions} maxTagCount="responsive" disabled={isEditMode} showSearch
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="pcContact" label="PC Contact" rules={textFieldRules}>
                <Input placeholder="Client side co-ordinator" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serviceEngineerAssigned" label="Service Engineer" rules={textFieldRules}>
                <Input placeholder="Service engineer name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="ppmChecklist" label="PPM/Checklist" rules={textFieldRules}>
                <Input placeholder="PPM/Checklist details" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ppmSheetReceivedFromClient" label="PPM Sheet Received" rules={textFieldRules}>
                <Input placeholder="PPM sheet received details" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="ppmChecklistSharedWithOem" label="PPM Shared with OEM" rules={textFieldRules}>
                <Input placeholder="Details" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ppmTickedNoFromOem" label="PPM Ticked No from OEM" rules={textFieldRules}>
                <Input placeholder="PPM ticked no" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="ppmConfirmationStatus" label="PPM Confirmation Status" rules={selectFieldRules}>
                <Select placeholder="Select status" options={statusOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="preCommissioningStatus" label="Pre-commissioning Status" rules={selectFieldRules}>
                <Select placeholder="Select status" options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="oemComments" label="Comment from OEM">
                <Input.TextArea placeholder="Optional" rows={2} />
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
                  buttonLabel="Upload PPM Documents"
                  poId={poId}
                  entityType="pre_commissioning"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default PreCommissioningFormModal;
