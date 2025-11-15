
///update////
import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: LoginData) => {
    localStorage.setItem("loggedUser", values.username);

    message.success("Login Successful!");
    navigate("/dashboard"); 
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
        <Title level={3}>Login</Title>

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
            Login
          </Button>

          {/* NEW SIGNUP LINK */}
          <div style={{ marginTop: 15, textAlign: "center" }}>
            <Text>New user? </Text>
            <Link to="/signup">Create an account</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;



