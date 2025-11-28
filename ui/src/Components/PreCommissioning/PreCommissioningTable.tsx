import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";
import type { PreCommissionData } from "./Modals/PreCommissioningModal";

interface PreCommissioningProps {
  records: PreCommissionData[];
  setRecords: React.Dispatch<React.SetStateAction<PreCommissionData[]>>;
  onEdit: (record: PreCommissionData) => void;
}

const PreCommissioningTable: React.FC<PreCommissioningProps> = ({
  records,
  setRecords,
  onEdit,
}) => {
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
      render: (_: any, record: PreCommissionData) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() =>
              setRecords((prev) =>
                prev.filter((r) => r.serialNumber !== record.serialNumber)
              )
            }
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
    <Table
      style={{ marginTop: 20 }}
      columns={columns}
      dataSource={records}
      rowKey="serialNumber" // important so AntD passes the right record
      pagination={false}
    />
  );
};

export default PreCommissioningTable;
