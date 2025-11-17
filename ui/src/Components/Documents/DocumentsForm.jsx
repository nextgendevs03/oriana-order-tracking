// import React, { useState } from "react";
// import { Button, Table } from "antd";
// import ModalDocuments from "./Modals/ModalDocuments";

// const DocumentForm = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [documents, setDocuments] = useState([]);

//   const handleAddDocument = (formData) => {
//     setDocuments([...documents, formData]);
//     setIsModalOpen(false);
//   };

//   const columns = [
//     {
//       title: "Dispatch Count",
//       dataIndex: "dispatchCount",
//       key: "dispatchCount",
//     },
//   ];

//   return (
//     <div>
//       <Button type="primary" onClick={() => setIsModalOpen(true)}>
//         Add Document
//       </Button>

//       <ModalDocuments
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleAddDocument}
//       />

//       <Table
//         dataSource={documents.map((doc, index) => ({
//           key: index,
//           dispatchCount: doc.dispatchCount,
//         }))}
//         columns={columns}
//         style={{ marginTop: 20 }}
//       />
//     </div>
//   );
// };

// export default DocumentForm;


import React, { useState } from "react";
import { Button, Collapse, Card, Descriptions } from "antd";
import ModalDocuments from "./Modals/ModalDocuments";

const { Panel } = Collapse;

const DocumentForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleAddDocument = (formData) => {
    setDocuments([...documents, formData]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Document
      </Button>

      <ModalDocuments
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDocument}
      />

      <div style={{ marginTop: 20 }}>
        <Collapse accordion>
          {documents.map((doc, index) => (
            <Panel
              header={`Document #${index + 1} - Dispatch Count: ${doc.dispatchCount}`}
              key={index}
            >
              <Card>
                <Descriptions column={1}>
                  <Descriptions.Item label="No Dues Clearance">
                    {doc.noDuesClearance}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tax Invoice No">
                    {doc.taxInvoiceNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="Invoice Date">
                    {doc.invoiceDate.format("YYYY-MM-DD")}
                  </Descriptions.Item>
                  <Descriptions.Item label="E-way Bill">
                    {doc.ewayBill}
                  </Descriptions.Item>
                  <Descriptions.Item label="Delivery Challan">
                    {doc.deliveryChallan}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dispatch Date">
                    {doc.dispatchDate.format("YYYY-MM-DD")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Packing List">
                    {doc.packingList}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dispatch From Location">
                    {doc.dispatchFromLocation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Inverter Serial Nos">
                    {doc.inverterSerialNos}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dispatch Status">
                    {doc.dispatchStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dispatch Remarks">
                    {doc.dispatchRemarks || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default DocumentForm;

