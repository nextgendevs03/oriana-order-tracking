import React from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import { CommissioningData } from "../CommissioningForm";

const { TextArea } = Input;

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CommissioningData) => void;
}

const ModalCommissioning: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [form] = Form.useForm();

    const handleFinish = () => {
        const values = form.getFieldsValue();

        onSubmit({
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
            title="Add Commissioning Details"
            onCancel={onClose}
            onOk={handleFinish}
            okText="Submit"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Expected Commissioning Date from Client"
                    name="expectedDate"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Service Ticket No. from OEM"
                    name="ticketNo"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Service Engineer Assigned"
                    name="engineer"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Confirmed Commissioning Date from Client"
                    name="confirmedDate"
                    rules={[{ required: true, message: "Required" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Issues Arises During Commissioning"
                    name="issues"
                >
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label="Solution on Issues Arises During Commissioning"
                    name="solution"
                >
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    label="Commissioning Date"
                    name="commissioningDate"
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Commissioning Status"
                    name="status"
                >
                    <Select
                        placeholder="Select Status"
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
