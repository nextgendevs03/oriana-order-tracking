import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";

const { Title } = Typography;
interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: LoginData) => {
    try {
      const data = await login({
        username: values.username,
        password: values.password,
      }).unwrap();

      if (data.success === true) {
        localStorage.setItem("loggedUser", values.username);
        localStorage.setItem("isLoggedIn", "true");
        message.success("Login Successful!");
        navigate("/dashboard");
      } else {
        // Show error message from backend
        const errorMessage =
          data.message || "Login failed. Please check your credentials.";
        message.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle RTK Query error format
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      message.error(errorMessage);
    }
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

          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
