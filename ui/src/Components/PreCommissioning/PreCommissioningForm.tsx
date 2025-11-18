import React, { useState } from "react";
import { Button, Collapse, Card, Descriptions } from "antd";
import ModalPreCommissioning from "./Modals/ModalPreCommissioning";

const { Panel } = Collapse;

interface PreCommissionData {
  serialNumber: string;
  contactPerson: string;
  sheetSharedClient: string;
  sheetReceivedClient: string;
  sheetSharedOEM: string;
  ticketNo: string;
  status: string;
  remarks?: string;
}

interface Props {
  serialNumbers: string[];    // auto-populated list of serials
}

const PreCommissioningForm: React.FC<Props> = ({ serialNumbers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<PreCommissionData[]>([]);

  const handleAddRecord = (data: PreCommissionData) => {
    setRecords([...records, data]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Add Button */}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Pre-Commissioning
      </Button>

      {/* Modal */}
      <ModalPreCommissioning
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRecord}
        serialNumbers={serialNumbers}
      />

      {/* Collapsible Records */}
      <div style={{ marginTop: 20 }}>
        <Collapse accordion>
          {records.map((item, index) => (
            <Panel header={`Serial: ${item.serialNumber}`} key={index}>
              <Card>
                <Descriptions column={1}>
                  <Descriptions.Item label="Contact Person">
                    {item.contactPerson}
                  </Descriptions.Item>

                  <Descriptions.Item label="PPM Shared With Client">
                    {item.sheetSharedClient}
                  </Descriptions.Item>

                  <Descriptions.Item label="PPM Received From Client">
                    {item.sheetReceivedClient}
                  </Descriptions.Item>

                  <Descriptions.Item label="PPM Shared With OEM">
                    {item.sheetSharedOEM}
                  </Descriptions.Item>

                  <Descriptions.Item label="OEM Ticket No">
                    {item.ticketNo}
                  </Descriptions.Item>

                  <Descriptions.Item label="Status">
                    {item.status}
                  </Descriptions.Item>

                  <Descriptions.Item label="Remarks">
                    {item.remarks || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default PreCommissioningForm;
