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
        // map selectedItems into separate rows
        const items = values.selectedItems.map((item: string) => ({
            key: Date.now() + Math.random(), // unique key for each row
            certificateNo: values.certificateNo,
            issueDate: values.issueDate,
            startDate: values.startDate,
            endDate: values.endDate,
            sharedWithClient: values.sharedWithClient,
            remarks: values.remarks,
            itemName: item, // individual item
        }));

        if (editingRecord) {
            // remove old rows of this certificate
            setData((prev) =>
                prev.filter((d) => d.key !== editingRecord.key).concat(items)
            );
            message.success("Record updated successfully");
        } else {
            setData([...data, ...items]);
            message.success("Record added successfully");
        }

        setOpen(false);
    };

    const handleEdit = (record: any) => {
        // Prepare editing record: collect all rows of this certificate
        const relatedRows = data.filter(
            (d) => d.certificateNo === record.certificateNo
        );
        const editRecord = {
            ...relatedRows[0],
            selectedItems: relatedRows.map((r) => r.itemName),
        };
        setEditingRecord(editRecord);
        setOpen(true);
    };

    const handleDelete = (key: number) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Record deleted");
    };

    const columns = [
        { title: "Item Name", dataIndex: "itemName" },
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
