import { useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Typography,
  Empty,
  Spin,
  Tooltip,
} from "antd";
import { UserOutlined, EditOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAppSelector } from "../store/hooks";
import { selectAuth } from "../store/authSlice";
import { colors, shadows } from "../styles/theme";
import UpdateProfileModal from "../Components/Profile/UpdateProfileModal";

const { Title } = Typography;

const Profile: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  // Show empty state if user is not logged in
  if (!auth.username) {
    return (
      <div
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Empty description="User information not available" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        background: "#f5f5f5",
        minHeight: "100%",
      }}
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
          borderRadius: 16,
          border: `1px solid ${colors.gray200}`,
          borderLeft: `4px solid ${colors.accent}`,
          boxShadow: shadows.card,
          padding: "24px 28px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
            }}
          >
            <UserOutlined style={{ fontSize: 26, color: "#fff" }} />
          </div>
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              User Profile
            </Title>
            <p
              style={{
                margin: "6px 0 0 0",
                fontSize: "0.9rem",
                color: colors.gray500,
              }}
            >
              View and manage your account information
            </p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setIsUpdateModalVisible(true)}
          style={{
            borderRadius: 8,
            fontWeight: 500,
            height: 40,
            padding: "0 20px",
          }}
        >
          Update Profile
        </Button>
      </motion.div>

      {/* User Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card
          style={{
            borderRadius: 12,
            boxShadow: shadows.card,
            marginBottom: 24,
          }}
        >
          <Descriptions
            title="User Information"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            size="middle"
            labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa", width: "200px" }}
          >
            <Descriptions.Item label="User Name">
              {auth.username || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {auth.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              {auth.roleName ? (
                <Tag color="blue" style={{ fontSize: "0.875rem", padding: "2px 8px" }}>
                  {auth.roleName}
                </Tag>
              ) : (
                "N/A"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {auth.userId ? `#${auth.userId}` : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </motion.div>

      {/* Permissions Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card
          style={{
            borderRadius: 12,
            boxShadow: shadows.card,
          }}
          title={
            <Space>
              <SafetyCertificateOutlined />
              <span>Permissions</span>
              <Tag color="cyan">{auth.permissions?.length || 0}</Tag>
            </Space>
          }
        >
          {auth.permissions && auth.permissions.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {auth.permissions.map((permission, index) => (
                <Tag
                  key={index}
                  color="geekblue"
                  style={{
                    fontSize: "0.875rem",
                    padding: "4px 12px",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                >
                  {permission}
                </Tag>
              ))}
            </div>
          ) : (
            <Empty
              description="No permissions assigned"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "2rem 0" }}
            />
          )}
        </Card>
      </motion.div>

      {/* Update Profile Modal */}
      <UpdateProfileModal
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        currentUser={{
          userId: auth.userId || undefined,
          username: auth.username,
          email: auth.email || "",
        }}
      />
    </div>
  );
};

export default Profile;

