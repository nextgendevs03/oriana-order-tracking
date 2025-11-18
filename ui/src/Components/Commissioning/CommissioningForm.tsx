import React, { useState } from "react";
import { Card, Button, Collapse } from "antd";

import ModalCommissioning from "./Modals/ModalCommissioning";

const { Panel } = Collapse;

export interface CommissioningData {
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

const CommissioningData: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [records, setRecords] = useState<CommissioningData[]>([]);

    const handleAdd = () => setModalOpen(true);

    const handleSubmit = (data: CommissioningData) => {
        setRecords([...records, data]);
        setModalOpen(false);
    };

    return (

        <Card>
            <Button type="primary" onClick={handleAdd}>
                Add Commissioning Details
            </Button>

            <Collapse style={{ marginTop: 20 }}>
                {records.map((item, index) => (
                    <Panel header={`Entry ${index + 1}`} key={index}>
                        <p><b>Expected Commissioning Date :</b> {item.expectedDate}</p>
                        <p><b>Service Ticket No :</b> {item.ticketNo}</p>
                        <p><b>Service Engineer Assigned :</b> {item.engineer}</p>
                        <p><b>Confirmed Commissioning Date :</b> {item.confirmedDate}</p>
                        <p><b>Issues :</b> {item.issues}</p>
                        <p><b>Solution :</b> {item.solution}</p>
                        <p><b>Commissioning Date :</b> {item.commissioningDate}</p>
                        <p><b>Status :</b> {item.status}</p>
                        <p><b>Remarks :</b> {item.remarks}</p>
                    </Panel>
                ))}
            </Collapse>

            <ModalCommissioning
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </Card>
    );
};

export default CommissioningData;
