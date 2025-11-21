import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface ModalProps {
    open: boolean;
    editingRecord: any | null;
    onClose: () => void;
    onSubmit: (values: any) => void;
}

const ModalWarrantyCertificate: React.FC<ModalProps> = ({
    open,
    editingRecord,
    onClose,
    onSubmit,
}) => {
    const [form] = Form.useForm();

    const toDayjs = (dateStr: string | undefined) => (dateStr ? dayjs(dateStr) : null);

    useEffect(() => {
        if (editingRecord) {
            form.setFieldsValue({
                ...editingRecord,
                issueDate: toDayjs(editingRecord.issueDate),
                startDate: toDayjs(editingRecord.startDate),
                endDate: toDayjs(editingRecord.endDate),
            });
        } else {
            form.resetFields();
        }
    }, [editingRecord, form]);

    const handleFinish = (values: any) => {
        const formattedValues = {
            ...values,
            issueDate: values.issueDate ? values.issueDate.format("YYYY-MM-DD") : "",
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : "",
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : "",
        };

        onSubmit(formattedValues);
        form.resetFields();
    };

    return (
        <Modal
            title={editingRecord ? "Edit Warranty Certificate" : "Add Warranty Certificate"}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            width={600}
        >
            <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>
                <Form form={form} layout="vertical" onFinish={handleFinish}>

                    {/* ================= MULTI CHECKBOX DROPDOWN ================= */}
                    <Form.Item
                        name="selectedItems"
                        label="Select Items"
                        rules={[{ required: true, message: "Please select items" }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select warranty items"
                            allowClear
                            optionLabelProp="label"
                        >
                            <Option value="Motor" label="Motor">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Motor
                            </Option>

                            <Option value="Pump" label="Pump">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Pump
                            </Option>

                            <Option value="Control Panel" label="Control Panel">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Control Panel
                            </Option>

                            <Option value="Cable" label="Cable">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Cable
                            </Option>

                            <Option value="Switch Gear" label="Switch Gear">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Switch Gear
                            </Option>

                            <Option value="Starter" label="Starter">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Starter
                            </Option>

                            <Option value="Pipe" label="Pipe">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Pipe
                            </Option>

                            <Option value="Valve" label="Valve">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Valve
                            </Option>

                            <Option value="Sensor" label="Sensor">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Sensor
                            </Option>

                            <Option value="Relay" label="Relay">
                                <input type="checkbox" style={{ marginRight: 8 }} />
                                Relay
                            </Option>
                        </Select>
                    </Form.Item>

                    {/* ============================================================= */}

                    <Form.Item
                        label="Warranty Certificate No."
                        name="certificateNo"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Enter certificate number" />
                    </Form.Item>

                    <Form.Item
                        label="Issue Date"
                        name="issueDate"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Warranty Start Date"
                        name="startDate"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Warranty End Date"
                        name="endDate"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="sharedWithClient"
                        label="Warranty Certificate Shared with Client"
                    >
                        <Select placeholder="Select shared status">
                            <Option value="Done">Done</Option>
                            <Option value="Pending">Pending</Option>
                            <Option value="Hold">Hold</Option>
                            <Option value="Cancelled">Cancelled</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Remarks" name="remarks">
                        <Input.TextArea placeholder="Enter remarks" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingRecord ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </Modal>
    );
};

export default ModalWarrantyCertificate;
