import React, { useState } from "react";
import { Button } from "antd";
import DocumentModal, { DocumentFormValues } from "./Modals/DocumentModal";
import DocumentTable from "./DocumentTable";

const DocumentForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentFormValues[]>([]);
  const [editingRecord, setEditingRecord] = useState<DocumentFormValues | null>(
    null
  );

  const handleSubmit = (data: DocumentFormValues) => {
    if (editingRecord) {
      setDocuments((prev) =>
        prev.map((item) => (item.key === data.key ? data : item))
      );
    } else {
      setDocuments((prev) => [...prev, data]);
    }

    setEditingRecord(null);
    setOpen(false);
  };

  const handleEdit = (record: DocumentFormValues) => {
    setEditingRecord(record);
    setOpen(true);
  };

  const handleDelete = (key: number | undefined) => {
    setDocuments((prev) => prev.filter((item) => item.key !== key));
  };

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

      <DocumentTable
        documents={documents}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <DocumentModal
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
