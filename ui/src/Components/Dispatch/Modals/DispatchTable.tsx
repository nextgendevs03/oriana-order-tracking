// import React from "react";
// import { Table, Button } from "antd";
// import ItemFormValues from "./ItemModal";

// interface Props {
//   data: typeof ItemFormValues[];
//   onDelete: (index: number) => void;
// }

// const ItemTable: React.FC<Props> = ({ data, onDelete }) => {
//   const columns = [
//     { title: "Product Name", dataIndex: "productName", key: "productName" },
//     { title: "Project Name", dataIndex: "projectName", key: "projectName" },
//     { title: "Project Location", dataIndex: "projectLocation", key: "projectLocation" },
//     { title: "Delivery Address", dataIndex: "deliveryAddress", key: "deliveryAddress" },
//     { title: "Google Map Link", dataIndex: "googleMapLink", key: "googleMapLink" },
//     { title: "Delivery Quantity", dataIndex: "deliveryQty", key: "deliveryQty" },
//     { title: "Confirm Dispatch Date", dataIndex: "confirmDispatchDate", key: "confirmDispatchDate" },
//     { title: "Delivery Contact", dataIndex: "deliveryContact", key: "deliveryContact" },
//     { title: "Remarks", dataIndex: "remarks", key: "remarks" },
//     {
//       title: "Action",
//       key: "action",
//       render: (_: any, __: any, index: number) => (
//         <Button danger onClick={() => onDelete(index)}>
//           Delete
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Table
//       dataSource={data}
//       columns={columns}
//       rowKey={(_, i) => i?.toString() ?? "0"} // TypeScript safe
//       pagination={false}
//     />
//   );
// };

// export default ItemTable;

// import React from "react";
// import { Table } from "antd";

// interface DispatchTableProps {
//   dispatchList: any[];
// }

// const DispatchTable: React.FC<DispatchTableProps> = ({ dispatchList }) => {
//   const columns = [
//     { title: "Product", dataIndex: "product" },
//     { title: "Project Name", dataIndex: "projectName" },
//     { title: "Location", dataIndex: "projectLocation" },
//     { title: "Quantity", dataIndex: "deliveryQty" },
//     { title: "Dispatch Date", dataIndex: "confirmDate" },
//     { title: "Contact", dataIndex: "deliveryContact" },
//   ];

//   return (
//     <Table
//       columns={columns}
//       dataSource={dispatchList.map((item, index) => ({
//         key: index,
//         ...item,
//         confirmDate: item.confirmDate?.format("DD-MM-YYYY"),
//       }))}
//       bordered
//     />
//   );
// };

// export default DispatchTable;



import React from "react";
import { Table } from "antd";

export interface DispatchItem {
  product: string;
  projectName: string;
  projectLocation: string;
  deliveryAddress: string;
  mapLink: string;
  quantity: number;
  dispatchDate: string;
  contact: string;
  remarks?: string;
}

interface Props {
  data: DispatchItem[];
}

const DispatchTable: React.FC<Props> = ({ data }) => {
  const columns = [
    { title: "Product", dataIndex: "product" },
    { title: "Project Name", dataIndex: "projectName" },
    { title: "Project Location", dataIndex: "projectLocation" },
    { title: "Delivery Address", dataIndex: "deliveryAddress" },
    { title: "Google Map", dataIndex: "mapLink" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Dispatch Date", dataIndex: "dispatchDate" },
    { title: "Contact", dataIndex: "contact" },
    { title: "Remarks", dataIndex: "remarks" },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default DispatchTable;
