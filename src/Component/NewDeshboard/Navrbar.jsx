import React from "react";
import { Layout, Typography, Select, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Navbar = () => {
  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left Section */}
      <Title
        level={4}
        style={{ margin: 0, fontWeight: 700, color: "#001529" }}
      >
        Order Tracking System
      </Title>

      {/* Right Section */}
      <Space align="center">
      <Select
  defaultValue="Sales Person"
  style={{ width: 150 }}
  options={[
    { value: "salesperson", label: "Sales Person" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
  ]}
/>


        <Avatar
          style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
          icon={<UserOutlined />}
        >
          SP
        </Avatar>
      </Space>


    </Header>

  
  );
};

export default Navbar;
