import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import { CommissioningDataType } from "../CommissioningForm";

const { TextArea } = Input;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CommissioningDataType) => void;
    editRecord: CommissioningDataType | null;
}

const ModalCommissioning: React.FC<Props> = ({ open, onClose, onSubmit, editRecord }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editRecord) {
            form.setFieldsValue({
                ...editRecord,
            });
        } else {
            form.resetFields();
        }
    }, [editRecord, form]);

    const handleFinish = () => {
        const values = form.getFieldsValue();

        onSubmit({
            key: editRecord?.key || Date.now(),
            expectedDate: values.expectedDate?.format("YYYY-MM-DD"),
            ticketNo: values.ticketNo,
            engineer: values.engineer,
            confirmedDate: values.confirmedDate?.format("YYYY-MM-DD"),
            issues: values.issues,
            solution: values.solution,
            commissioningDate: values.commissioningDate?.format("YYYY-MM-DD"),
            status: values.status,
            remarks: values.remarks,
        });

        form.resetFields();
    };

    return (
        <Modal
            open={open}
            title={editRecord ? "Edit Commissioning Details" : "Add Commissioning Details"}
            onCancel={onClose}
            onOk={handleFinish}
            okText={editRecord ? "Update" : "Submit"}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Expected Commissioning Date" name="expectedDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Service Ticket No (OEM)" name="ticketNo" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Service Engineer Assigned" name="engineer" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Confirmed Commissioning Date" name="confirmedDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Issues Arising During Commissioning" name="issues">
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Solution for Issues" name="solution">
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item label="Commissioning Date" name="commissioningDate">
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Commissioning Status" name="status">
                    <Select
                        options={[
                            { value: "Pending", label: "Pending" },
                            { value: "In-Progress", label: "In-Progress" },
                            { value: "Completed", label: "Completed" },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Remarks" name="remarks">
                    <TextArea rows={2} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCommissioning;

