import React from "react";
import { Table, Button, Popconfirm, Tag } from "antd";
import { DocumentFormValues } from "./Modals/DocumentModal";

interface Props {
  documents: DocumentFormValues[];
  handleEdit: (record: DocumentFormValues) => void;
  handleDelete: (key: number | undefined) => void;
}

const DocumentTable: React.FC<Props> = ({
  documents,
  handleEdit,
  handleDelete,
}) => {
  const columns = [
    {
      title: "Invoice No",
      dataIndex: "taxInvoiceNo",
      key: "taxInvoiceNo",
    },
    {
      title: "Dispatch Date",
      dataIndex: "dispatchDate",
      key: "dispatchDate",
      render: (date: any) => date?.format("YYYY-MM-DD"),
    },
    {
      title: "Dispatch Count",
      dataIndex: "dispatchCount",
      key: "dispatchCount",
    },
    {
      title: "Status",
      dataIndex: "dispatchStatus",
      key: "dispatchStatus",
      render: (status: string) => {
        const color =
          status === "Delivered"
            ? "green"
            : status === "Dispatched"
            ? "blue"
            : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DocumentFormValues) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete this document?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      style={{ marginTop: 20 }}
      columns={columns}
      dataSource={documents}
      rowKey="key"
      bordered
    />
  );
};

export default DocumentTable;
