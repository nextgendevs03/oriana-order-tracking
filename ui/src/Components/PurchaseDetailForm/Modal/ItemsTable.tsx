import React from "react";
import { Table, Button, Space } from "antd";
import { ItemFormValues } from "./ItemModal";

interface Props {
  data: ItemFormValues[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;   // ⭐ NEW: Edit support
}

const ItemTable: React.FC<Props> = ({ data, onDelete, onEdit }) => {
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

    // ⭐ NEW — Price / Unit
    { title: "Price", dataIndex: "pricePerUnit", key: "pricePerUnit" },

    // ⭐ NEW — Total Price Auto Calculation
    {
      title: "Total Price",
      key: "totalPrice",
      render: (_: any, record: ItemFormValues) =>
        (record.totalQty * (record.pricePerUnit || 0)).toFixed(2),
    },

    // ⭐ ACTION (EDIT + DELETE)
    {
      title: "Action",
      key: "action",
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(index)}>
            Edit
          </Button>

          <Button danger onClick={() => onDelete(index)}>
            Delete
          </Button>
        </Space>
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
