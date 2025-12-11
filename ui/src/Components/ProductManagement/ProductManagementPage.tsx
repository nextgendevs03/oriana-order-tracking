import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  AppstoreOutlined,
  TagsOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface MenuCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  icon,
  title,
  description,
  onClick,
  color,
}) => (
  <Card
    hoverable
    onClick={onClick}
    style={{
      height: "100%",
      borderRadius: 12,
      border: "1px solid #f0f0f0",
      transition: "all 0.3s ease",
    }}
    styles={{
      body: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      },
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      <span style={{ fontSize: 36, color }}>{icon}</span>
    </div>
    <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
      {title}
    </Title>
    <Text type="secondary">{description}</Text>
  </Card>
);

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <TagsOutlined />,
      title: "Category Management",
      description: "Manage product categories",
      path: "/product-management/categories",
      color: "#1890ff",
    },
    {
      icon: <ShopOutlined />,
      title: "OEM Management",
      description: "Manage OEM partners",
      path: "/product-management/oems",
      color: "#52c41a",
    },
    {
      icon: <AppstoreOutlined />,
      title: "Product Management",
      description: "Manage products catalog",
      path: "/product-management/products",
      color: "#722ed1",
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 32 }}>
        Product Management
      </Title>

      <Row gutter={[24, 24]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.path}>
            <MenuCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              onClick={() => navigate(item.path)}
              color={item.color}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductManagementPage;

