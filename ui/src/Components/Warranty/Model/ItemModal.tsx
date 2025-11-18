import React, { useState } from "react";
import { Checkbox, Button } from "antd";

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

  const [selected, setSelected] = useState<any[]>([]);

  return (
    <div>
      <Checkbox.Group
        style={{ width: "100%" }}
        onChange={(values) =>
          setSelected(items.filter((item) => values.includes(item.id)))
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <Checkbox key={item.id} value={item.id}>
              {item.name}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>

      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={() => onSubmit(selected)}
      >
        Next
      </Button>
    </div>
  );
};

export default ItemModal;
