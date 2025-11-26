import React, { useState } from "react";
import { Card, Button } from "antd";
import CommissioningModal from "./Modals/CommissioningModal";
import CommissioningTable from "./CommissioningTable";
export interface CommissioningDataType {
  key: number;
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

const CommissioningForm: React.FC = () => {
  const [CommissioningmodalOpen, setCommissioningModalOpen] = useState(false);
  const [records, setRecords] = useState<CommissioningDataType[]>([]);
  const [editRecord, setEditRecord] = useState<CommissioningDataType | null>(
    null
  );

  const handleAdd = () => {
    setEditRecord(null);
    setCommissioningModalOpen(true);
  };

  const handleSubmit = (data: CommissioningDataType) => {
    if (editRecord) {
      // Edit mode
      setRecords((prev) =>
        prev.map((item) =>
          item.key === editRecord.key ? { ...editRecord, ...data } : item
        )
      );
    } else {
      // Add new, ensure key is not overwritten by data.key
      const { key, ...restData } = data;
      setRecords([...records, { key: Date.now(), ...restData }]);
    }

    setCommissioningModalOpen(false);
    setEditRecord(null);
  };

  const handleEdit = (record: CommissioningDataType) => {
    setEditRecord(record);
    setCommissioningModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setRecords(records.filter((r) => r.key !== key));
  };

  return (
    <Card>
      <Button type="primary" onClick={handleAdd}>
        Add Commissioning Details
      </Button>

      <CommissioningTable
        data={records}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <CommissioningModal
        open={CommissioningmodalOpen}
        onClose={() => {
          setCommissioningModalOpen(false);
          setEditRecord(null);
        }}
        onSubmit={handleSubmit}
        editRecord={editRecord}
      />
    </Card>
  );
};

export default CommissioningForm;
