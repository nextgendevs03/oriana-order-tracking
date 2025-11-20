import React, { useState } from "react";
import { Button, Table, Space, Popconfirm } from "antd";
import ModalPreCommissioning from "./Modals/ModalPreCommissioning";

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
  serialNumbers: string[];
}

const PreCommissioningForm: React.FC<Props> = ({ serialNumbers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<PreCommissionData[]>([]);

  const handleAddRecord = (data: PreCommissionData) => {
    // Add 'key' property in the table data, but keep the records strictly typed
    setRecords([...records, data]);
    setIsModalOpen(false);
  };

  const columns = [
    { title: "Serial Number", dataIndex: "serialNumber" },
    { title: "Contact Person", dataIndex: "contactPerson" },
    { title: "PPM Shared With Client", dataIndex: "sheetSharedClient" },
    { title: "PPM Received From Client", dataIndex: "sheetReceivedClient" },
    { title: "PPM Shared With OEM", dataIndex: "sheetSharedOEM" },
    { title: "OEM Ticket No", dataIndex: "ticketNo" },
    { title: "Status", dataIndex: "status" },
    { title: "Remarks", dataIndex: "remarks" },

    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link">Edit</Button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() =>
              setRecords(records.filter(r => r.serialNumber !== record.serialNumber))
            }
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Pre-Commissioning
      </Button>

      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={records}
        pagination={false}
      />

      <ModalPreCommissioning
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRecord}
        serialNumbers={serialNumbers}
        editingData={null}
      />
    </div>
  );
};

export default PreCommissioningForm;