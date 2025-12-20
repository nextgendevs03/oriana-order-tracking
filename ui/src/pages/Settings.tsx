import { useState } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Switch,
  Divider,
  Space,
  Avatar,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  BellOutlined,
  LockOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const username = localStorage.getItem("loggedUser") || "Guest";

  const onFinish = (values: any) => {
    console.log("Settings saved:", values);
    message.success("Settings saved successfully!");
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      {/* Page Header - Neumorphic Soft Style */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1.5rem 2rem",
          background: "#f0f0f3",
          borderRadius: 20,
          boxShadow: "8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#f0f0f3",
              boxShadow: "inset 4px 4px 8px #d1d1d4, inset -4px -4px 8px #ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingOutlined style={{ fontSize: 26, color: "#6366f1" }} spin={false} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.5rem", color: "#374151" }}>
              Settings
            </h2>
            <p style={{ margin: "0.3rem 0 0 0", fontSize: "0.875rem", color: "#9ca3af" }}>
              Manage your account preferences and configurations
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>Profile Settings</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space align="center">
            <Avatar
              size={80}
              style={{
                backgroundColor: "#4b6cb7",
                fontSize: 32,
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {username}
              </Title>
              <Text type="secondary">Administrator</Text>
            </div>
          </Space>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              displayName: username,
              email: "",
            }}
          >
            <Form.Item label="Display Name" name="displayName">
              <Input prefix={<UserOutlined />} placeholder="Enter display name" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input prefix={<MailOutlined />} placeholder="Enter email address" />
            </Form.Item>
          </Form>
        </Space>
      </Card>

      {/* Notification Settings */}
      <Card
        title={
          <Space>
            <BellOutlined />
            <span>Notification Settings</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>Email Notifications</Text>
              <br />
              <Text type="secondary">Receive email updates for PO status changes</Text>
            </div>
            <Switch defaultChecked />
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>Push Notifications</Text>
              <br />
              <Text type="secondary">Receive browser notifications</Text>
            </div>
            <Switch />
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>Weekly Summary</Text>
              <br />
              <Text type="secondary">Receive weekly PO summary reports</Text>
            </div>
            <Switch defaultChecked />
          </div>
        </Space>
      </Card>

      {/* Security Settings */}
      <Card
        title={
          <Space>
            <LockOutlined />
            <span>Security Settings</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Form layout="vertical">
          <Form.Item label="Current Password" name="currentPassword">
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item label="New Password" name="newPassword">
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item label="Confirm New Password" name="confirmPassword">
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Button type="default" icon={<LockOutlined />}>
            Change Password
          </Button>
        </Form>
      </Card>

      {/* Save Button */}
      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          onClick={() => form.submit()}
          onMouseEnter={() => setIsSaveHovered(true)}
          onMouseLeave={() => setIsSaveHovered(false)}
          style={{
            backgroundColor: isSaveHovered ? "#3d5a9f" : "#4b6cb7",
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: isSaveHovered
              ? "0 6px 20px rgba(75, 108, 183, 0.45)"
              : "0 2px 8px rgba(75, 108, 183, 0.25)",
            transform: isSaveHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.3s ease",
          }}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;

