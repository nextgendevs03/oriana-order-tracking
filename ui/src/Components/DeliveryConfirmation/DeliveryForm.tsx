import React, { useState } from "react";
import { Button, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import DeliveryModal from "./Modals/DeliveryModal";
import DeliveryTable from "./DeliveryTable";

export interface DeliveryFormData {
  deliveryDate: Dayjs;
  deliveryStatus: string;
  proofOfDelivery: string;
}

const DeliveryForm: React.FC = () => {
  const [DeliveryModalOpen, setDeliveryModalOpen] = useState<boolean>(false);
  const [deliveries, setDeliveries] = useState<DeliveryFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddDelivery = (formData: DeliveryFormData) => {
    if (editingIndex !== null) {
      const updated = [...deliveries];
      updated[editingIndex] = formData;
      setDeliveries(updated);
      setEditingIndex(null);
    } else {
      setDeliveries((prev) => [...prev, formData]);
    }
    setDeliveryModalOpen(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDeliveryModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeliveries((prev) => prev.filter((_, i) => i !== index));
    message.success("Deleted successfully");
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setDeliveryModalOpen(true)}>
        Add Delivery
      </Button>

      <DeliveryModal
        open={DeliveryModalOpen}
        onClose={() => {
          setDeliveryModalOpen(false);
          setEditingIndex(null);
        }}
        onSubmit={handleAddDelivery}
        initialValues={editingIndex !== null ? deliveries[editingIndex] : null}
      />

      <div style={{ marginTop: 20 }}>
        <DeliveryTable
          deliveries={deliveries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default DeliveryForm;
