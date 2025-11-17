import React, { useState } from "react";
import { Button, Collapse, Card, Descriptions } from "antd";
import ModalDelivery from "./Modals/ModalDelivery";

const { Panel } = Collapse;

const DeliveryForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);

  const handleAddDelivery = (formData) => {
    setDeliveries([...deliveries, formData]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Delivery
      </Button>

      <ModalDelivery
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDelivery}
      />

      <div style={{ marginTop: 20 }}>
        <Collapse accordion>
          {deliveries.map((delivery, index) => (
            <Panel
              header={`Delivery #${index + 1} - Status: ${delivery.deliveryStatus}`}
              key={index}
            >
              <Card>
                <Descriptions column={1}>
                  <Descriptions.Item label="Date of Delivery">
                    {delivery.deliveryDate.format("YYYY-MM-DD")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Delivery Status">
                    {delivery.deliveryStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Proof of Delivery">
                    {delivery.proofOfDelivery}
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

export default DeliveryForm;
