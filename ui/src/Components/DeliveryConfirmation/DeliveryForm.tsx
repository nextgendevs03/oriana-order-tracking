import React, { useState } from "react";
import { Button, Table, Popconfirm, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import ModalDelivery from "./Modals/ModalDelivery";

export interface DeliveryFormData {
  deliveryDate: Dayjs;
  deliveryStatus: string;
  proofOfDelivery: string;
}

const DeliveryForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deliveries, setDeliveries] = useState<DeliveryFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddDelivery = (formData: DeliveryFormData) => {
    if (editingIndex !== null) {
      // Update existing delivery
      const updated = [...deliveries];
      updated[editingIndex] = formData;
      setDeliveries(updated);
      setEditingIndex(null);
    } else {
      // Add new delivery
      setDeliveries((prev) => [...prev, formData]);
    }

    setIsModalOpen(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeliveries((prev) => prev.filter((_, i) => i !== index));
    message.success("Deleted successfully");
  };

  const columns = [
    {
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (date: Dayjs) => date?.format("YYYY-MM-DD"),
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
    },
    {
      title: "Proof of Delivery",
      dataIndex: "proofOfDelivery",
      key: "proofOfDelivery",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, __: unknown, index: number) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(index)}
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(index)}
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
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Delivery
      </Button>

      <ModalDelivery
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }}


        


        onSubmit={handleAddDelivery}
        initialValues={editingIndex !== null ? deliveries[editingIndex] : null}
      />

      <div style={{ marginTop: 20 }}>
        <Table
          dataSource={deliveries.map((item, index) => ({ ...item, key: index }))}
          columns={columns}
          bordered
        />
      </div>
    </div>
  );
};

export default DeliveryForm;