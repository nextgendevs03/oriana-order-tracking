import React from "react";
import { Table, Button } from "antd";
import { ItemFormValues } from "./ItemModal";

interface Props {
  data: ItemFormValues[];
  onDelete: (index: number) => void; // ← added onDelete prop
}

const ItemTable: React.FC<Props> = ({ data, onDelete }) => {
  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "OEM Name", dataIndex: "oemName", key: "oemName" },
    { title: "Product Model", dataIndex: "productModel", key: "productModel" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Spare Qty", dataIndex: "spareQty", key: "spareQty" },
    { title: "Total Qty", dataIndex: "totalQty", key: "totalQty" },
    { title: "Payment Status", dataIndex: "paymentStatus", key: "paymentStatus" },
    { title: "Warranty", dataIndex: "warranty", key: "warranty" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Action",
      key: "action",
      render: (_: any, __: any, index: number) => (
        <Button danger onClick={() => onDelete(index)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={(_, i) => i?.toString() ?? "0"} 
      pagination={false}
    />
  );
};

export default ItemTable;
