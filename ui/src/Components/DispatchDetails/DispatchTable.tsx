import React from "react";
import { Table, Button, Popconfirm, Space } from "antd";
import { DispatchFormData } from "./Modals/DispatchModal";

interface DispatchTableProps {
  data: DispatchFormData[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const DispatchTable: React.FC<DispatchTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const tableData = data.map((item, idx) => ({
    key: idx,
    product: item.product,
    projectName: item.projectName,
    projectLocation: item.projectLocation,
    deliveryQuantity: item.deliveryQuantity,
    dispatchDate: item.confirmDispatchDate.format("YYYY-MM-DD"),
  }));

  const columns = [
    { title: "Product", dataIndex: "product", width: 120 },
    { title: "Project Name", dataIndex: "projectName", width: 150 },
    { title: "Project Location", dataIndex: "projectLocation", width: 150 },
    { title: "Quantity", dataIndex: "deliveryQuantity", width: 100 },
    { title: "Dispatch Date", dataIndex: "dispatchDate", width: 150 },

    {
      title: "Actions",
      width: 180,
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button type="link" onClick={() => onEdit(index)}>
            Edit
          </Button>

          <Popconfirm
            title=" Are you sure Delete this record?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(index)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      bordered
      pagination={{ pageSize: 5 }}
      style={{ width: "100%", background: "#fff" }}
    />
  );
};

export default DispatchTable;
