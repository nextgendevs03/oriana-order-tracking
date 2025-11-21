import React, { useState } from "react";
import { Button, Card } from "antd";
import ItemModal, { ItemFormValues } from "./PurchaseItemModal";
import ItemTable from "./PurchaseItemsTable";

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<ItemFormValues[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Add or update item
  const handleAddOrUpdateItem = (item: ItemFormValues) => {
    if (editingIndex !== null) {
      const newItems = [...items];
      newItems[editingIndex] = item;
      setItems(newItems);
      setEditingIndex(null);
    } else {
      setItems([...items, item]);
    }
    setIsModalOpen(false);
  };

  // Delete item by index
  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Edit item
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
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
        <ItemTable data={items} onDelete={handleDelete} onEdit={handleEdit} />
      </Card>

      <ItemModal
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }}
        onSubmit={handleAddOrUpdateItem}
      />
    </div>
  );
};

export default ParentComponent;
