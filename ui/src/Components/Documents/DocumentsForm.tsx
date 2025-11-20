import React, { useState } from "react";
import { Button, Table, Popconfirm, Tag } from "antd";
import ModalDocuments, { DocumentFormValues } from "./Modals/ModalDocuments";

const DocumentForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentFormValues[]>([]);
  const [editingRecord, setEditingRecord] = useState<DocumentFormValues | null>(null);

  const handleSubmit = (data: DocumentFormValues) => {
    if (editingRecord) {
      // 🔥 Update existing row
      setDocuments((prev) =>
        prev.map((item) => (item.key === data.key ? data : item))
      );
    } else {
      // Add new record
      setDocuments((prev) => [...prev, data]);
    }

    setEditingRecord(null);
    setOpen(false);
  };

  const handleDelete = (key: number | undefined) => {
    setDocuments((prev) => prev.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: "Invoice No",
      dataIndex: "taxInvoiceNo",
    },
    {
      title: "Dispatch Date",
      dataIndex: "dispatchDate",
      render: (date: any) => date?.format("YYYY-MM-DD"),
    },
    {
      title: "Dispatch Count",
      dataIndex: "dispatchCount",
    },
    {
      title: "Status",
      dataIndex: "dispatchStatus",
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
      render: (_: any, record: DocumentFormValues) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingRecord(record);
              setOpen(true);
            }}
          >
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
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        onClick={() => {
          setEditingRecord(null);
          setOpen(true);
        }}
      >
        Add Document
      </Button>

      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        dataSource={documents}
        rowKey="key"
        bordered
      />

      <ModalDocuments
        open={open}
        editingRecord={editingRecord}
        onClose={() => {
          setEditingRecord(null);
          setOpen(false);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DocumentForm;



