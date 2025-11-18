import React, { useState } from "react";
import { Button, Collapse, Card, Descriptions } from "antd";
import ModalDispatch from "./Modals/ModalDispatch";

const { Panel } = Collapse;

const DispatchForm = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dispatches, setDispatches] = useState([]);

  const handleAddDispatch = (formData) => {
    setDispatches([...dispatches, formData]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Dispatch
      </Button>

      <ModalDispatch
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDispatch}
        products={products}
      />

      <div style={{ marginTop: 20 }}>
        <Collapse accordion>
          {dispatches.map((dispatch, index) => (
            <Panel
              header={`Dispatch #${index + 1} - Product: ${dispatch.product}`}
              key={index}
            >
              <Card>
                <Descriptions column={1}>
                  <Descriptions.Item label="Product">
                    {dispatch.product}
                  </Descriptions.Item>
                  <Descriptions.Item label="Project Name">
                    {dispatch.projectName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Project Location">
                    {dispatch.projectLocation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Delivery Address">
                    {dispatch.deliveryAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Google Map Link">
                    {dispatch.googleMapLink || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Delivery Quantity">
                    {dispatch.deliveryQuantity}
                  </Descriptions.Item>
                  <Descriptions.Item label="Confirm Dispatch Date">
                    {dispatch.confirmDispatchDate.format("YYYY-MM-DD")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Delivery Contact">
                    {dispatch.deliveryContact}
                  </Descriptions.Item>
                  <Descriptions.Item label="Remarks">
                    {dispatch.remarks || "-"}
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

export default DispatchForm;
