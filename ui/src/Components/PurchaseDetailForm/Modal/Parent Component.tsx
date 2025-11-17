import React, { useState } from "react";
import { Button, Card } from "antd";
import ItemModal, { ItemFormValues } from "./ItemModal";
import ItemTable from "./ItemsTable";

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
        <ItemTable data={items} onDelete={handleDelete} />
      </Card>

      <ItemModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  );
};

export default ParentComponent;
