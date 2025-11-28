import React, { useState } from "react";
import { Button, message } from "antd";
import ModalWarrantyCertificate from "./Modals/ModalWarrantyCertificate";
import WarrantyCertificateTable from "./WarrantyCertificateTable";

const WarrantyCertificate: React.FC = () => {

    // ⭐ Your requested naming style
    const [warrantyCertificateOpen, setWarrantyCertificateOpen] = useState(false);
    const [warrantyCertificateData, setWarrantyCertificateData] = useState<any[]>([]);
    const [warrantyCertificateEditingRecord, setWarrantyCertificateEditingRecord] = useState<any | null>(null);

    const handleAdd = () => {
        setWarrantyCertificateEditingRecord(null);
        setWarrantyCertificateOpen(true);
    };

    const handleSubmit = (values: any) => {
        const items = values.selectedItems.map((item: string) => ({
            key: Date.now() + Math.random(),
            certificateNo: values.certificateNo,
            issueDate: values.issueDate,
            startDate: values.startDate,
            endDate: values.endDate,
            sharedWithClient: values.sharedWithClient,
            remarks: values.remarks,
            itemName: item,
        }));

        if (warrantyCertificateEditingRecord) {
            setWarrantyCertificateData((prev) =>
                prev
                    .filter((d) => d.key !== warrantyCertificateEditingRecord.key)
                    .concat(items)
            );
            message.success("Record updated successfully");
        } else {
            setWarrantyCertificateData([...warrantyCertificateData, ...items]);
            message.success("Record added successfully");
        }

        setWarrantyCertificateOpen(false);
    };

    const handleEdit = (record: any) => {
        const relatedRows = warrantyCertificateData.filter(
            (d) => d.certificateNo === record.certificateNo
        );

        const editRecord = {
            ...relatedRows[0],
            selectedItems: relatedRows.map((r) => r.itemName),
        };

        setWarrantyCertificateEditingRecord(editRecord);
        setWarrantyCertificateOpen(true);
    };

    const handleDelete = (key: number) => {
        setWarrantyCertificateData(
            warrantyCertificateData.filter((item) => item.key !== key)
        );
        message.success("Record deleted");
    };

    return (
        <div>
            <Button type="primary" onClick={handleAdd}>
                Add Warranty Certificate
            </Button>

            <WarrantyCertificateTable
                data={warrantyCertificateData}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ModalWarrantyCertificate
                open={warrantyCertificateOpen}
                editingRecord={warrantyCertificateEditingRecord}
                onClose={() => setWarrantyCertificateOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default WarrantyCertificate;
