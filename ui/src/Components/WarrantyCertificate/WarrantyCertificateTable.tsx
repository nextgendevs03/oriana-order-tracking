import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";

interface WarrantyCertificateProps {
  data: any[];
  onEdit: (record: any) => void;
  onDelete: (key: number) => void;
}

const WarrantyCertificateTable: React.FC<WarrantyCertificateProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
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
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => onDelete(record.key)}
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
      dataSource={data}
      pagination={false}
    />
  );
};

export default WarrantyCertificateTable;
