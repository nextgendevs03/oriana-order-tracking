
import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

interface SignupData {
  username: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: SignupData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Push new user
    users.push(values);
    localStorage.setItem("users", JSON.stringify(users));

    message.success("Registration Successful! Please login.");
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card style={{ width: 350 }}>
        <Title level={3}>Create Account</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Enter Username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter Password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Sign Up
          </Button>

          <div style={{ marginTop: 15, textAlign: "center" }}>
            <Link to="/">Already have an account? Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;

