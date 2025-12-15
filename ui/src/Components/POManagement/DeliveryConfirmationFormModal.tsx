import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button } from "antd";
import { useAppDispatch } from "../../store/hooks";
import {
  updateDispatchDetail,
  DispatchDetail,
  DispatchDocument,
} from "../../store/poSlice";
import dayjs from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";
import FileUpload from "./FileUpload";
import {
  deliveryStatusOptions,
  textFieldRules,
  selectFieldRules,
  dateFieldRules,
} from "../../utils";

interface DeliveryConfirmationFormModalProps {
  visible: boolean;
  onClose: () => void;
  dispatches: DispatchDetail[];
  editData?: DispatchDetail | null;
}

const DeliveryConfirmationFormModal: React.FC<
  DeliveryConfirmationFormModalProps
> = ({ visible, onClose, dispatches, editData = null }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditMode = !!editData;

  // Get dispatch options - only show dispatches where dispatchStatus is "done"
  // Disable if already has delivery confirmation (unless editing that dispatch)
  const dispatchOptions = useMemo(() => {
    return dispatches
      .filter((d) => d.dispatchStatus === "done")
      .map((d) => ({
        value: d.id,
        label: d.id,
        disabled: !!d.deliveryStatus && d.id !== editData?.id,
      }));
  }, [dispatches, editData]);

  // Initialize form with edit data (flat properties)
  useEffect(() => {
    if (visible && editData) {
      // Initialize file list from existing documents
      if (editData.deliveryDocuments && editData.deliveryDocuments.length > 0) {
        const existingFiles: UploadFile[] = editData.deliveryDocuments.map(
          (doc: DispatchDocument) => ({
            uid: doc.uid,
            name: doc.name,
            status: "done",
            url: doc.url,
            type: doc.type,
            size: doc.size,
          })
        );
        setFileList(existingFiles);
      } else {
        setFileList([]);
      }

      form.setFieldsValue({
        dispatchId: editData.id,
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

      const targetDispatch = dispatches.find((d) => d.id === values.dispatchId);

      if (!targetDispatch) {
        console.error("Dispatch not found");
        return;
      }

      // Convert file list to dispatch documents
      const deliveryDocuments: DispatchDocument[] = fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        type: file.type || "",
        size: file.size || 0,
        url:
          file.url ||
          (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
        uploadedAt: new Date().toISOString(),
      }));

      // Update the dispatch with flat delivery confirmation fields
      const updatedDispatch: DispatchDetail = {
        ...targetDispatch,
        dateOfDelivery: values.dateOfDelivery
          ? dayjs(values.dateOfDelivery).format("YYYY-MM-DD")
          : "",
        deliveryStatus: values.deliveryStatus,
        proofOfDelivery: values.proofOfDelivery,
        deliveryDocuments: deliveryDocuments,
        deliveryUpdatedAt: new Date().toISOString(),
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

export default DeliveryConfirmationFormModal;
