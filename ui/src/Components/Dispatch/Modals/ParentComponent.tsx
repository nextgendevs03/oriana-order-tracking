import React, { useState } from "react";
import { Button, Card } from "antd";
import ItemModal from "./ItemModal";
// @ts-ignore
import ItemsTable from "./ItemsTable";
// import DispatchForm from "../DispatchForm";
type ItemFormValues = {
  // Replace these fields with your actual item form values
  name: string;
  quantity: number;
  [key: string]: any;
};

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<ItemFormValues[]>([]);

  // Add new item
  const handleAddItem = (item: ItemFormValues) => {
    setItems([...items, item]);
  };

  // Delete item by index
  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Card
        title="Item Details"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add Item
          </Button>
        }
      >
        <ItemsTable data={items} onDelete={handleDelete} />
      </Card>

      {isModalOpen && React.isValidElement(<ItemModal />) && (
        React.cloneElement(
          <ItemModal />,
          {
            onClose: () => setIsModalOpen(false),
            onSubmit: handleAddItem
          }
        )
      )}
      </div>
  );
};

export default ParentComponent;
