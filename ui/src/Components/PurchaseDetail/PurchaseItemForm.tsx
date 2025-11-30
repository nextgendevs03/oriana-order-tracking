import { Card, Button, Form } from "antd";
import { useState } from "react";
import PurchaseItemTable, { ItemFormValues } from "./PurchaseItemTable";

const PurchaseItemForm: React.FC = () => {
  const [items, setItems] = useState<ItemFormValues[]>([]);
  const [form] = Form.useForm();

  const handleAdd = () => {
    const newItem: ItemFormValues = {
      category: "",
      oemName: "",
      productModel: "",
      quantity: undefined,
      spareQty: undefined,
      totalQty: undefined,
      pricePerUnit: undefined,
      totalPrice: undefined,
      warranty: "",
    };

    setItems([...items, newItem]);
  };

  const handleUpdate = (index: number, row: ItemFormValues) => {
    const updated = [...items];
    updated[index] = row;
    setItems(updated);
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Card
      bordered={false}
      style={{ background: "transparent", boxShadow: "none" }}
      bodyStyle={{ padding: 0 }}     // ✅ LEFT SPACE REMOVE
    >
      
      {/* ✅ Left Aligned Button */}
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
        <Button
          onClick={handleAdd}
          style={{
            background: "#fff",
            border: "1px solid #d9d9d9",
            color: "#000",
          }}
        >
          + Add Item Details
        </Button>
      </div>

      <Form form={form} layout="vertical">
        {items.length > 0 && (
          <PurchaseItemTable
            data={items}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            form={form}
          />
        )}
      </Form>
      
    </Card>
  );
};

export default PurchaseItemForm;
