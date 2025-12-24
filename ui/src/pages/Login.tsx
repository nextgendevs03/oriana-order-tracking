import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";
import { addAuth, setIsLoggedIn } from "store/authSlice";
import { useDispatch } from "react-redux";
import { GeometricBackground } from "../Components/LoginBackgrounds";
import OSGLogo from "../OSG_Logo.png";
import "./Login.css";

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: LoginData) => {
    try {
      const loginPayload = {
        username: values.username,
        password: values.password,
      };
      const response = await login(loginPayload).unwrap();

      // Store the access token in sessionStorage
      if (response.accessToken) {
        sessionStorage.setItem("authToken", response.accessToken);
      }

      dispatch(addAuth({ username: values.username }));
      dispatch(setIsLoggedIn(true));

      message.success("Login Successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      message.error(errorMessage);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <GeometricBackground />

      {/* Login Card with Framer Motion */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Logo */}
        <motion.div
          className="login-logo-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img src={OSGLogo} alt="OSG Logo" className="login-logo" />
        </motion.div>

        {/* Welcome Text */}
        <motion.h1
          className="login-welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="login-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Sign in to continue to your dashboard
        </motion.p>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="login-form"
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Powered by <span>OSG Oriana India</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
