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
    <div style={{ padding: "1rem" }}>
      {/* Page Header - Centered Hero Style with Large Icon */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "2rem",
          background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)",
          borderRadius: 20,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative rings */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(139, 92, 246, 0.1)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <AppstoreOutlined style={{ fontSize: 36, color: "#fff" }} />
        </div>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.6rem", color: "#5b21b6", position: "relative", zIndex: 1 }}>
          Product Management
        </h2>
        <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.9rem", color: "#7c3aed", position: "relative", zIndex: 1 }}>
          Manage categories, OEMs, and product catalog
        </p>
      </div>

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
