import { Card, Button } from "antd";
import { useState } from "react";
import PurchaseItemModal from "./Modal/PurchaseItemModal";
import PurchaseItemTable, { ItemFormValues } from "./PurchaseItemTable";

const PurchaseItemForm: React.FC = () => {
  const [PurchaseDetailModalOpen, PurchaseDetailSetIsModalOpen] =
    useState(false);
  const [PurchaseDetailItems, PurchaseDetailSetItems] = useState<
    ItemFormValues[]
  >([]);
  const [PurchaseDetailEditingIndex, PurchaseDetailSetEditingIndex] = useState<
    number | null
  >(null);

  const handleAddOrUpdateItem = (item: ItemFormValues) => {
    if (PurchaseDetailEditingIndex !== null) {
      const updated = [...PurchaseDetailItems];
      updated[PurchaseDetailEditingIndex] = item;
      PurchaseDetailSetItems(updated);
      PurchaseDetailSetEditingIndex(null);
    } else {
      PurchaseDetailSetItems([...PurchaseDetailItems, item]);
    }
    PurchaseDetailSetIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    PurchaseDetailSetItems(PurchaseDetailItems.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    PurchaseDetailSetEditingIndex(index);
    PurchaseDetailSetIsModalOpen(true);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Card
        title="Item Details"
        extra={
          <Button
            type="primary"
            onClick={() => PurchaseDetailSetIsModalOpen(true)}
          >
            Add Item
          </Button>
        }
      >
        <PurchaseItemTable
          data={PurchaseDetailItems}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </Card>

      <PurchaseItemModal
        visible={PurchaseDetailModalOpen}
        editingData={
          PurchaseDetailEditingIndex !== null
            ? PurchaseDetailItems[PurchaseDetailEditingIndex]
            : null
        }
        onClose={() => {
          PurchaseDetailSetIsModalOpen(false);
          PurchaseDetailSetEditingIndex(null);
        }}
        onSubmit={handleAddOrUpdateItem}
      />
    </div>
  );
};

export default PurchaseItemForm;
