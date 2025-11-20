import React, { useState } from "react";
import { Button, Modal, Table, Popconfirm } from "antd";
import WarrantyModal from "./WarrantyModal";

const WarrantyParent: React.FC = () => {
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);

  const [warrantyData, setWarrantyData] = useState<any[]>([]);

  // Directly submit warranty form
  const handleWarrantySubmit = (formValues: any) => {
    const mapped = [
      {
        itemId: "AUTO", // You can replace this if needed
        itemName: "Warranty Item",
        quantity: 1,
        warrantyCertificateNo: formValues.warrantyCertificateNo || "",
        warrantyStartDate: formValues.warrantyStartDate
          ? formValues.warrantyStartDate.format("YYYY-MM-DD")
          : "",
        warrantyEndDate: formValues.warrantyEndDate
          ? formValues.warrantyEndDate.format("YYYY-MM-DD")
          : "",
        issueDate: formValues.issueDate
          ? formValues.issueDate.format("YYYY-MM-DD")
          : "",
        sharedStatus: formValues.sharedStatus || "",
        remark: formValues.remark || "",
      },
    ];

    setWarrantyData((prev) => [...prev, ...mapped]);
    setWarrantyModalOpen(false);
  };

  // Delete row
  const handleDelete = (itemId: string) => {
    setWarrantyData((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const columns = [
    { title: "Item ID", dataIndex: "itemId" },
    { title: "Item Name", dataIndex: "itemName" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Warranty Certificate", dataIndex: "warrantyCertificateNo" },
    { title: "Start Date", dataIndex: "warrantyStartDate" },
    { title: "End Date", dataIndex: "warrantyEndDate" },
    { title: "Issue Date", dataIndex: "issueDate" },
    { title: "Shared Status", dataIndex: "sharedStatus" },
    { title: "Remark", dataIndex: "remark" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <Popconfirm
          title="Are you sure to delete this item?"
          onConfirm={() => handleDelete(record.itemId)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
       <Button
        type="primary"
        onClick={() => setWarrantyModalOpen(true)}
        style={{ marginBottom: 20 }}
      >
         Warranty Detail 
      </Button> 

      <Table dataSource={warrantyData} columns={columns} rowKey="itemId" bordered />

      {/* Warranty Form Modal */}
      <Modal
        open={warrantyModalOpen}
        centered
        footer={null}
        width={500}
        onCancel={() => setWarrantyModalOpen(false)}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto", paddingRight: "10px" }}
      >
        <WarrantyModal onSubmit={handleWarrantySubmit} />
      </Modal>
    </div>
  );
};

export default WarrantyParent;
