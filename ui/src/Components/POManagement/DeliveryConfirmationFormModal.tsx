import React, { useEffect, useMemo, useState, useRef } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button, message } from "antd";
import { useUpdateDeliveryConfirmationMutation } from "../../store/api/dispatchApi";
import type { DispatchResponse } from "@OrianaTypes";
import dayjs from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";
import S3FileUpload, { S3FileUploadRef } from "./S3FileUpload";
import {
  deliveryStatusOptions,
  textFieldRules,
  selectFieldRules,
  dateFieldRules,
} from "../../utils";

interface DeliveryConfirmationFormModalProps {
  visible: boolean;
  onClose: () => void;
  dispatches: DispatchResponse[];
  editData?: DispatchResponse | null;
  poId?: string;
}

const DeliveryConfirmationFormModal: React.FC<
  DeliveryConfirmationFormModalProps
> = ({ visible, onClose, dispatches, editData = null, poId }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileUploadRef = useRef<S3FileUploadRef>(null);
  const selectedDispatchId = Form.useWatch("dispatchId", form);

  // API mutation
  const [updateDeliveryConfirmation, { isLoading: isUpdating }] = useUpdateDeliveryConfirmationMutation();

  const isEditMode = !!editData;

  // Get dispatch options - only show dispatches where dispatchStatus is "done"
  // Disable if already has delivery confirmation (unless editing that dispatch)
  const dispatchOptions = useMemo(() => {
    return dispatches
      .filter((d) => d.dispatchStatus === "done")
      .map((d) => ({
        value: d.dispatchId,
        label: `Dispatch #${d.dispatchId}`,
        disabled: !!d.deliveryStatus && d.dispatchId !== editData?.dispatchId,
      }));
  }, [dispatches, editData]);

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      setFileList([]);

      form.setFieldsValue({
        dispatchId: editData.dispatchId,
        dateOfDelivery: editData.dateOfDelivery
          ? dayjs(editData.dateOfDelivery)
          : undefined,
        deliveryStatus: editData.deliveryStatus,
        proofOfDelivery: editData.proofOfDelivery,
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

      // Update delivery confirmation via API
      await updateDeliveryConfirmation({
        id: targetDispatch.dispatchId,
        data: {
          dateOfDelivery: values.dateOfDelivery
            ? dayjs(values.dateOfDelivery).format("YYYY-MM-DD")
            : undefined,
          deliveryStatus: values.deliveryStatus,
          proofOfDelivery: values.proofOfDelivery,
        },
      }).unwrap();

      message.success("Delivery confirmation updated successfully");
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
      message.error("Failed to update delivery confirmation. Please try again.");
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
          ? "Edit Delivery Confirmation"
          : "Update Delivery Information"
      }
      open={visible}
      onCancel={handleCancel}
      width={700}
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
          <Col span={24}>
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
        </Row>

        {/* Row 2: Date of Delivery, Delivery Status */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dateOfDelivery"
              label="Date of Delivery"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deliveryStatus"
              label="Delivery Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select delivery status"
                options={deliveryStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Proof of Delivery */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="proofOfDelivery"
              label="Proof of Delivery"
              rules={textFieldRules}
            >
              <Input.TextArea
                placeholder="Enter proof of delivery details"
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Upload Documents */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Upload Document (Proof of delivery)"
              tooltip="Upload 1-5 documents. Supported formats: Images, PDF, Word, Excel"
            >
              <S3FileUpload
                ref={fileUploadRef}
                fileList={fileList}
                onChange={setFileList}
                minFiles={0}
                maxFiles={5}
                maxSizeMB={10}
                buttonLabel="Click to Upload"
                helperText="Supported: Images (JPG, PNG, GIF, SVG), PDF, Word, Excel."
                poId={poId}
                entityType="delivery_confirmation"
                entityId={selectedDispatchId?.toString()}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeliveryConfirmationFormModal;
