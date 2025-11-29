import React, { useState } from "react";
import { Table, Button, Empty, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DispatchModal from "./Modals/DispatchModal";
import { ColumnsType } from "antd/es/table";

import { deleteDispatchDetail } from "../../store/poSlice";
import type { DispatchDetail, POData } from "../../store/poSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useParams } from "react-router-dom";

const DispatchDetails: React.FC = () => {

  const dispatch = useAppDispatch();
  const [isDispatchModalVisible, setIsDispatchModalVisible] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState<any>(null);
  const { poId } = useParams<{ poId: string }>();
  const dispatchDetails = useAppSelector((state) => state.po.dispatchDetails);
  const poList = useAppSelector((state) => state.po.poList);
  const selectedPO = poList.find((po: POData) => po.id === poId);
  
  const formatLabel = (value: string) => {
    if (!value) return "";
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Filter dispatch details for current PO
  const currentPODispatches = dispatchDetails.filter(
    (dispatchItem) => dispatchItem.poId === poId
  );

  const handleEditDispatch = (record: any) => {
    setEditingDispatch(record);
    setIsDispatchModalVisible(true);
  };

  const handleDeleteDispatch = (dispatchId: string) => {
     dispatch(deleteDispatchDetail(dispatchId));
  };

  const handleCloseModal = () => {
    setIsDispatchModalVisible(false);
    setEditingDispatch(null);
  };

  const handleAddDispatch = () => {
    setEditingDispatch(null);
    setIsDispatchModalVisible(true);
  };

  const dispatchColumns: ColumnsType<any> = [
    {
      title: "Dispatch ID",
      dataIndex: "id",
      key: "id",
      width: 150,
      fixed: "left",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 120,
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      width: 150,
    },
    {
      title: "Project Location",
      dataIndex: "projectLocation",
      key: "projectLocation",
      width: 150,
    },
    {
      title: "Delivery Location",
      dataIndex: "deliveryLocation",
      key: "deliveryLocation",
      width: 150,
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Map Link",
      dataIndex: "googleMapLink",
      key: "googleMapLink",
      width: 100,
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            View Map
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Quantity",
      dataIndex: "deliveryQuantity",
      key: "deliveryQuantity",
      width: 100,
    },
    {
      title: "Dispatch Date",
      dataIndex: "confirmDispatchDate",
      key: "confirmDispatchDate",
      width: 130,
    },
    {
      title: "Contact",
      dataIndex: "deliveryContact",
      key: "deliveryContact",
      width: 130,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditDispatch(record)}
            style={{ padding: 0 }}
          />
          <Popconfirm
            title="Delete Dispatch"
            description="Are you sure you want to delete this dispatch?"
            onConfirm={() => handleDeleteDispatch(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddDispatch}
          style={{
            backgroundColor: "#4b6cb7",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Add Dispatch
        </Button>
      </div>

      {/* Dispatch Details Table or Empty State */}
      {currentPODispatches.length > 0 ? (
        <Table
          columns={dispatchColumns}
          dataSource={currentPODispatches.map((dispatchItem) => ({
            ...dispatchItem,
            key: dispatchItem.id,
          }))}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 1600 }}
        />
      ) : (
        <Empty description="No dispatch details available" />
      )}

      <DispatchModal
        visible={isDispatchModalVisible}
        onClose={handleCloseModal}
        poId={selectedPO?.id || ""}
        poItems={selectedPO?.poItems || []}
        editData={editingDispatch}
      />
    </>
  );
};

export default DispatchDetails;
