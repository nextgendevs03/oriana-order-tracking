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
                    <Form.Item
                        name="selectedItems"
                        label="Select Items"
                        rules={[{ required: true, message: "Please select items" }]}
                    >
                        <Select mode="multiple" placeholder="Select warranty items" allowClear>
                            <Option value="Motor">Motor</Option>
                            <Option value="Pump">Pump</Option>
                            <Option value="Control Panel">Control Panel</Option>
                            <Option value="Cable">Cable</Option>
                            <Option value="Switch Gear">Switch Gear</Option>
                            <Option value="Starter">Starter</Option>
                            <Option value="Pipe">Pipe</Option>
                            <Option value="Valve">Valve</Option>
                            <Option value="Sensor">Sensor</Option>
                            <Option value="Relay">Relay</Option>
                        </Select>
                    </Form.Item>

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
