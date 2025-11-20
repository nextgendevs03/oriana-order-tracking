import React, { useState } from "react";
import { Select, Button } from "antd";

interface Props {
  onSubmit: (items: any[]) => void;
}

const ItemModal: React.FC<Props> = ({ onSubmit }) => {
  const items = [
    { id: "ITEM-01", name: "Motor" },
    { id: "ITEM-02", name: "Pump" },
    { id: "ITEM-03", name: "Control Panel" },
    { id: "ITEM-04", name: "Cable" },
    { id: "ITEM-05", name: "Switch Gear" },
    { id: "ITEM-06", name: "Starter" },
    { id: "ITEM-07", name: "Pipe" },
    { id: "ITEM-08", name: "Valve" },
    { id: "ITEM-09", name: "Sensor" },
    { id: "ITEM-10", name: "Relay" }
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const handleNext = () => {
    const selectedItems = items.filter((item) =>
      selected.includes(item.id)
    );
    onSubmit(selectedItems);
  };

  return (
    <div style={{ padding: 10 }}>
      <Select
        mode="multiple"
        allowClear
        placeholder="Select Items"
        style={{ width: "100%" }}
        value={selected}
        onChange={(value) => setSelected(value)}
      >
        {items.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>

      <Button
        type="primary"
        style={{ marginTop: 20, width: "100%" }}
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default ItemModal;
