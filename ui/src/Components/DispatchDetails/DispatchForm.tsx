import React, { useState } from "react";
import { Button, Table, Popconfirm, Space } from "antd";
import ModalDispatch, { DispatchFormData } from "./Modals/ModalDispatch";

interface DispatchFormProps {
  products: string[];
}

const DispatchForm: React.FC<DispatchFormProps> = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatches, setDispatches] = useState<DispatchFormData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: DispatchFormData) => {
    if (editIndex !== null) {
      const updated = [...dispatches];
      updated[editIndex] = data;
      setDispatches(updated);
    } else {
      setDispatches([...dispatches, data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (index: number) => {
    setDispatches(dispatches.filter((_, i) => i !== index));
  };

  const tableData = dispatches.map((item, idx) => ({
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
          <Button
            type="link"
            onClick={() => {
              setEditIndex(index);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this record?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(index)}
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
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 15 }}>
        Add Dispatch
      </Button>

      {/* TABLE FIXED HEIGHT + FULL WIDTH */}
      <Table
        columns={columns}
        dataSource={tableData}
        bordered
        pagination={{ pageSize: 5 }}
        style={{ width: "100%", background: "#fff" }}
      />

      <ModalDispatch
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        products={products}
        editData={editIndex !== null ? dispatches[editIndex] : null}
      />
    </div>
  );
};

export default DispatchForm;
