import React, { useState } from "react";
import { Button } from "antd";
import PreCommissioningModal, {
  PreCommissionData,
} from "./Modals/PreCommissioningModal";
import PreCommissioningTable from "./PreCommissioningTable";

interface PreCommissioningProps {
  serialNumbers: string[];
}

const PreCommissioningForm: React.FC<PreCommissioningProps> = ({
  serialNumbers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<PreCommissionData[]>([]);
  const [editingData, setEditingData] = useState<PreCommissionData | null>(
    null
  );

  // Called by Modal when Add or Update happens
  const handleAddOrUpdate = (data: PreCommissionData) => {
    if (editingData) {
      // update existing record by serialNumber
      setRecords((prev) =>
        prev.map((r) =>
          r.serialNumber === editingData.serialNumber ? data : r
        )
      );
    } else {
      // add new
      setRecords((prev) => [...prev, data]);
    }

    setEditingData(null);
    setIsModalOpen(false);
  };

  // Called by Table when Edit is clicked
  const handleEdit = (record: PreCommissionData) => {
    setEditingData(record);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        onClick={() => {
          setEditingData(null);
          setIsModalOpen(true);
        }}
      >
        Add Pre-Commissioning
      </Button>

      <PreCommissioningTable
        records={records}
        setRecords={setRecords}
        onEdit={handleEdit}
      />

      <PreCommissioningModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleAddOrUpdate}
        serialNumbers={serialNumbers}
        editingData={editingData}
      />
    </div>
  );
};

export default PreCommissioningForm;
