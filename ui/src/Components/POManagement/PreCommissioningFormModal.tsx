import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Row, Col, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addMultiplePreCommissioning,
  updatePreCommissioning,
  DispatchDetail,
  PreCommissioning,
  DispatchDocument,
} from "../../store/poSlice";
import { selectPreCommissioningDetails } from "../../store/poSelectors";
import type { UploadFile } from "antd/es/upload/interface";
import FileUpload from "./FileUpload";
import { formatLabel, textFieldRules, selectFieldRules } from "../../utils";

interface SerialOption {
  value: string;
  label: string;
  dispatchId: string;
  product: string;
}

interface PreCommissioningFormModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  dispatches: DispatchDetail[];
  editData?: PreCommissioning | null;
}

const PreCommissioningFormModal: React.FC<PreCommissioningFormModalProps> = ({
  visible,
  onClose,
  poId,
  dispatches,
  editData = null,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const preCommissioningDetails = useAppSelector(selectPreCommissioningDetails);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isEditMode = !!editData;

  // Get all serial numbers from dispatches with deliveryStatus === "done"
  // Exclude serials that already have pre-commissioning entries (unless editing)
  const serialOptions = useMemo((): SerialOption[] => {
    const options: SerialOption[] = [];
    const existingSerials = (preCommissioningDetails ?? [])
      .filter(
        (pc: PreCommissioning) => pc.poId === poId && pc.id !== editData?.id
      )
      .map((pc: PreCommissioning) => pc.serialNumber);

    dispatches
      .filter((d) => d.deliveryStatus === "done")
      .forEach((d) => {
        d.dispatchedItems.forEach((item) => {
          if (item.serialNumbers) {
            const serials = item.serialNumbers
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== "");

            serials.forEach((serial) => {
              const isAlreadyUsed = existingSerials.includes(serial);
              if (!isAlreadyUsed || serial === editData?.serialNumber) {
                options.push({
                  value: `${d.id}__${item.product}__${serial}`,
                  label: `${serial} (${formatLabel(item.product)} - ${d.id})`,
                  dispatchId: d.id,
                  product: item.product,
                });
              }
            });
          }
        });
      });

    return options;
  }, [dispatches, preCommissioningDetails, poId, editData]);

  // PPM Confirmation Status options
  const ppmConfirmationStatusOptions = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
    { value: "Hold", label: "Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Pre-commissioning Status options
  const preCommissioningStatusOptions = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
    { value: "Hold", label: "Hold" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Initialize form with edit data
  useEffect(() => {
    if (visible && editData) {
      // Initialize file list from existing documents
      if (editData.ppmDocuments && editData.ppmDocuments.length > 0) {
        const existingFiles: UploadFile[] = editData.ppmDocuments.map(
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
        serialNumbers: [
          `${editData.dispatchId}__${editData.product}__${editData.serialNumber}`,
        ],
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
    } else if (visible && !editData) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, editData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const timestamp = Date.now();

      // Convert file list to dispatch documents
      const ppmDocuments: DispatchDocument[] = fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        type: file.type || "",
        size: file.size || 0,
        url:
          file.url ||
          (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
        uploadedAt: new Date().toISOString(),
      }));

      if (isEditMode && editData) {
        // Update existing pre-commissioning entry
        const [dispatchId, product, serialNumber] =
          values.serialNumbers[0].split("__");

        const updatedPC: PreCommissioning = {
          ...editData,
          dispatchId,
          product,
          serialNumber,
          pcContact: values.pcContact,
          serviceEngineerAssigned: values.serviceEngineerAssigned,
          ppmChecklist: values.ppmChecklist,
          ppmSheetReceivedFromClient: values.ppmSheetReceivedFromClient,
          ppmChecklistSharedWithOem: values.ppmChecklistSharedWithOem,
          ppmTickedNoFromOem: values.ppmTickedNoFromOem,
          ppmConfirmationStatus: values.ppmConfirmationStatus,
          oemComments: values.oemComments || "",
          preCommissioningStatus: values.preCommissioningStatus || "",
          remarks: values.remarks || "",
          ppmDocuments: ppmDocuments,
        };

        dispatch(updatePreCommissioning(updatedPC));
      } else {
        // Create new pre-commissioning entries for each selected serial
        const newEntries: PreCommissioning[] = values.serialNumbers.map(
          (serialValue: string, index: number) => {
            const [dispatchId, product, serialNumber] = serialValue.split("__");

            return {
              id: `PC-${(timestamp + index).toString().slice(-8)}`,
              poId: poId,
              dispatchId,
              product,
              serialNumber,
              pcContact: values.pcContact,
              serviceEngineerAssigned: values.serviceEngineerAssigned,
              ppmChecklist: values.ppmChecklist,
              ppmSheetReceivedFromClient: values.ppmSheetReceivedFromClient,
              ppmChecklistSharedWithOem: values.ppmChecklistSharedWithOem,
              ppmTickedNoFromOem: values.ppmTickedNoFromOem,
              ppmConfirmationStatus: values.ppmConfirmationStatus,
              oemComments: values.oemComments || "",
              preCommissioningStatus: values.preCommissioningStatus || "",
              remarks: values.remarks || "",
              ppmDocuments: ppmDocuments,
              createdAt: new Date().toISOString(),
            };
          }
        );

        dispatch(addMultiplePreCommissioning(newEntries));
      }

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
          ? "Edit Pre-Commissioning Details"
          : "Update Pre-Commissioning Details"
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
        {/* Row 1: Serial Numbers */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="serialNumbers"
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
                placeholder="Select serial numbers from delivered dispatches"
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

        {/* Row 2: PC Contact, Service Engineer Assigned */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="pcContact"
              label="PC Contact (Client side co-ordinator)"
              rules={textFieldRules}
            >
              <Input placeholder="Contact for Pre-commissioning" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="serviceEngineerAssigned"
              label="Service Engineer Assigned"
              rules={textFieldRules}
            >
              <Input placeholder="Enter service engineer name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: PPM/Checklist, PPM Sheet Received */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="ppmChecklist"
              label="PPM/Checklist"
              rules={textFieldRules}
            >
              <Input placeholder="Enter PPM/Checklist details" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ppmSheetReceivedFromClient"
              label="PPM Sheet Received from Client"
              rules={textFieldRules}
            >
              <Input placeholder="Enter PPM sheet received details" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: PPM Shared with OEM, PPM Ticked No */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="ppmChecklistSharedWithOem"
              label="PPM/Checklist Sheet Shared with OEM"
              rules={textFieldRules}
            >
              <Input placeholder="Enter details" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ppmTickedNoFromOem"
              label="PPM Ticked No from OEM"
              rules={textFieldRules}
            >
              <Input placeholder="Enter PPM ticked no from OEM" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: PPM Confirmation Status, Pre-commissioning Status */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="ppmConfirmationStatus"
              label="PPM Confirmation Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select PPM confirmation status"
                options={ppmConfirmationStatusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="preCommissioningStatus"
              label="Pre-commissioning Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select pre-commissioning status"
                options={preCommissioningStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Comment from OEM (Optional) */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="oemComments" label="Comment from OEM">
              <Input.TextArea
                placeholder="Enter comments from OEM (optional)"
                rows={2}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 7: Remarks */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea placeholder="Enter remarks" rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 8: Upload Documents */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Upload Documents (PPM Sheet from client)"
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

export default PreCommissioningFormModal;
