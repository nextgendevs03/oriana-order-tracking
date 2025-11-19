import React, { useState } from "react";
import { Button, Modal, Table, Popconfirm } from "antd";
import ItemModal from "./ItemModal";
import WarrantyModal from "./WarrantyModal";

const WarrantyParent: React.FC = () => {
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [warrantyData, setWarrantyData] = useState<any[]>([]);

  const handleItemsSelected = (items: any[]) => {
    setSelectedItems(items);
    setItemModalOpen(false);
    setWarrantyModalOpen(true);
  };

  const handleWarrantySubmit = (formValues: any) => {
    const mapped = selectedItems.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      quantity: item.qty || 1,
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
      remark: formValues.remark || ""
    }));

    setWarrantyData((prev) => [...prev, ...mapped]);
    setWarrantyModalOpen(false);
  };

  // Delete row by itemId
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
      )
    }
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setItemModalOpen(true)}
        style={{ marginBottom: 20 }}
      >
        Add Item
      </Button>

      <Table
        dataSource={warrantyData}
        columns={columns}
        rowKey="itemId"
        bordered
      />

      {/* Item Selection Modal */}
      <Modal
        title="Select Items"
        open={itemModalOpen}
        centered
        footer={null}
        width={400}
        onCancel={() => setItemModalOpen(false)}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto", paddingRight: "10px" }}
      >
        <ItemModal onSubmit={handleItemsSelected} />
      </Modal>

      {/* Warranty Form Modal */}
      <Modal
        // title="Warranty Form"
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
