import React, { useState } from "react";
import { Card, Button, Table, Space, Popconfirm } from "antd";
import ModalCommissioning from "./Modals/ModalCommissioning";
export interface CommissioningDataType {
    key: number;
    expectedDate: string;
    ticketNo: string;
    engineer: string;
    confirmedDate: string;
    issues: string;
    solution: string;
    commissioningDate: string;
    status: string;
    remarks: string;
}

const CommissioningForm: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [records, setRecords] = useState<CommissioningDataType[]>([]);
    const [editRecord, setEditRecord] = useState<CommissioningDataType | null>(null);

    const handleAdd = () => {
        setEditRecord(null);
        setModalOpen(true);
    };

    const handleSubmit = (data: CommissioningDataType) => {
        if (editRecord) {
            // Edit mode
            setRecords((prev) =>
                prev.map((item) =>
                    item.key === editRecord.key ? { ...editRecord, ...data } : item
                )
            );
        } else {
            // Add new, ensure key is not overwritten by data.key
            const { key, ...restData } = data;
            setRecords([...records, { key: Date.now(), ...restData }]);
        }

        setModalOpen(false);
        setEditRecord(null);
    };

    const handleEdit = (record: CommissioningDataType) => {
        setEditRecord(record);
        setModalOpen(true);
    };

    const handleDelete = (key: number) => {
        setRecords(records.filter((r) => r.key !== key));
    };

    const columns = [
        { title: "Expected Date", dataIndex: "expectedDate" },
        { title: "Ticket No", dataIndex: "ticketNo" },
        { title: "Engineer", dataIndex: "engineer" },
        { title: "Confirmed Date", dataIndex: "confirmedDate" },
        { title: "Issues", dataIndex: "issues" },
        { title: "Solution", dataIndex: "solution" },
        { title: "Commissioning Date", dataIndex: "commissioningDate" },
        { title: "Status", dataIndex: "status" },
        { title: "Remarks", dataIndex: "remarks" },
        {
            title: "Actions",
            render: (_: any, record: CommissioningDataType) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card>
            <Button type="primary" onClick={handleAdd}>
                Add Commissioning Details
            </Button>

            <Table
                style={{ marginTop: 20 }}
                dataSource={records}
                columns={columns}
                pagination={false}
            />

            <ModalCommissioning
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditRecord(null);
                }}
                onSubmit={handleSubmit}
                editRecord={editRecord}
            />
        </Card>
    );
}

export default CommissioningForm;
