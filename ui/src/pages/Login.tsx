import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";
import { addAuth, setIsLoggedIn } from "store/authSlice";
import { useDispatch } from "react-redux";

const { Title } = Typography;
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
      await login(loginPayload).unwrap();

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
