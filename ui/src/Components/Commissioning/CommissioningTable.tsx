import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";
import { CommissioningDataType } from "./CommissioningForm";

interface Props {
  data: CommissioningDataType[];
  handleEdit: (record: CommissioningDataType) => void;
  handleDelete: (key: number) => void;
}

const CommissioningTable: React.FC<Props> = ({
  data,
  handleEdit,
  handleDelete,
}) => {
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
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete?"
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
    <Table
      style={{ marginTop: 20 }}
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  );
};

export default CommissioningTable;
