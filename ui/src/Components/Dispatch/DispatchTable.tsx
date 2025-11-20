import React from "react";
import { Table } from "antd";
import { DispatchData } from "./Modals/dispatch.type";

interface Props {
  data: DispatchData[];
}

const DispatchTable: React.FC<Props> = ({ data }) => {
  const columns = [
    { title: "Product", dataIndex: "product" },
    { title: "Project Name", dataIndex: "projectName" },
    { title: "Location", dataIndex: "projectLocation" },
    { title: "Qty", dataIndex: "deliveryQty" },
    { title: "Date", dataIndex: "confirmDate" },
    { title: "Contact", dataIndex: "deliveryContact" },
  ];

  return <Table columns={columns} dataSource={data} rowKey="confirmDate" />;
};

export default DispatchTable;
