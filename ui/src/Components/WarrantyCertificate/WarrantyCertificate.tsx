import React, { useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import ModalWarrantyCertificate from "./Modals/ModalWarrantyCertificate";

const WarrantyCertificate: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [editingRecord, setEditingRecord] = useState<any | null>(null);

    const handleAdd = () => {
        setEditingRecord(null);
        setOpen(true);
    };

    const handleSubmit = (values: any) => {
        // ✅ Convert Dates to String before saving
        const formattedValues = {
            ...values,
            issueDate: values.issueDate ? values.issueDate.format("YYYY-MM-DD") : "",
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : "",
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : "",
        };

        if (editingRecord) {
            // Update record
            setData((prev) =>
                prev.map((item) =>
                    item.key === editingRecord.key ? { ...item, ...formattedValues } : item
                )
            );
            message.success("Record updated successfully");
        } else {
            // Add new record
            setData([...data, { key: Date.now(), ...formattedValues }]);
            message.success("Record added successfully");
        }
        setOpen(false);
    };

    const handleEdit = (record: any) => {
        setEditingRecord(record);
        setOpen(true);
    };

    const handleDelete = (key: number) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Record deleted");
    };

    const columns = [
        { title: "Certificate No.", dataIndex: "certificateNo" },
        { title: "Issue Date", dataIndex: "issueDate" },
        { title: "Start Date", dataIndex: "startDate" },
        { title: "End Date", dataIndex: "endDate" },
        { title: "Shared With Client", dataIndex: "sharedWithClient" },
        { title: "Remarks", dataIndex: "remarks" },

        {
            title: "Actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>

                    <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd}>
                Add Warranty Certificate
            </Button>

            <Table
                style={{ marginTop: 20 }}
                columns={columns}
                dataSource={data}
                pagination={false}
            />

            <ModalWarrantyCertificate
                open={open}
                editingRecord={editingRecord}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default WarrantyCertificate;
