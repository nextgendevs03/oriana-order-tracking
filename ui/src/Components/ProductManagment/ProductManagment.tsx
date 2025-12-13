import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  TagsOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const ProductManagement = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Category Management",
      desc: "Manage product categories",
      icon: <TagsOutlined style={{ fontSize: 32, color: "#1976D2" }} />,
      bg: "#E3F2FD",
      route: "/product-management/categories",
    },
    {
      title: "OEM Management",
      desc: "Manage OEM partners",
      icon: <DatabaseOutlined style={{ fontSize: 32, color: "#43A047" }} />,
      bg: "#E8F5E9",
      route: "/product-management/oems",
    },
    {
      title: "Product Management",
      desc: "Manage product catalog",
      icon: <AppstoreOutlined style={{ fontSize: 32, color: "#8E24AA" }} />,
      bg: "#F3E5F5",
      route: "/product-management/products",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Product Management</h2>

      <Row gutter={[20, 20]}>
        {cards.map((card, index) => (
          <Col key={index} span={8}>
            <Card
              hoverable
              onClick={() => navigate(card.route)}
              style={{
                borderRadius: 12,
                height: 190,
                border: "1px solid #e6e6e6",
                transition: "0.3s",
              }}
              bodyStyle={{
                textAlign: "center",
                paddingTop: 30,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: card.bg,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                {card.icon}
              </div>

              <h3 style={{ marginTop: 20, fontSize: 16 }}>{card.title}</h3>
              <p style={{ marginTop: 4, opacity: 0.6, fontSize: 13 }}>
                {card.desc}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductManagement;
