import React from "react";
import { Table, Button, Popconfirm } from "antd";
import { Dayjs } from "dayjs";
import { DeliveryFormData } from "./DeliveryForm";

interface DeliveryTableProps {
  deliveries: DeliveryFormData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  onEdit,
  onDelete,
}) => {
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
          <Button type="link" onClick={() => onEdit(index)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => onDelete(index)}
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
    <Table
      dataSource={deliveries.map((item, index) => ({ ...item, key: index }))}
      columns={columns}
      bordered
    />
  );
};

export default DeliveryTable;
