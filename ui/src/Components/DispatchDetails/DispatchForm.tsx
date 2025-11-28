import React, { useState } from "react";
import { Button } from "antd";
import DispatchModal, { DispatchFormData } from "./Modals/DispatchModal";
import DispatchTable from "./DispatchTable";

interface DispatchFormProps {
  products: string[];
}

const DispatchForm: React.FC<DispatchFormProps> = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatches, setDispatches] = useState<DispatchFormData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: DispatchFormData) => {
    if (editIndex !== null) {
      const updated = [...dispatches];
      updated[editIndex] = data;
      setDispatches(updated);
    } else {
      setDispatches((prev) => [...prev, data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    setDispatches(dispatches.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 15 }}>
        Add Dispatch
      </Button>

      {/* ⬇ Reusable Table Component */}
      <DispatchTable
        data={dispatches}
        onEdit={(index) => {
          setEditIndex(index);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <DispatchModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        products={products}
        editData={editIndex !== null ? dispatches[editIndex] : null}
      />
    </div>
  );
};

export default DispatchForm;
