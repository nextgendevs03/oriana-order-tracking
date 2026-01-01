import { Result, Button } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { colors, shadows } from "../styles/theme";

/**
 * 404 Not Found Page
 *
 * Displays when user navigates to a non-existent route.
 * Provides options to go back or return to dashboard.
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          width: "100%",
          maxWidth: 600,
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="primary"
                  icon={<HomeOutlined />}
                  size="large"
                  onClick={() => navigate("/dashboard")}
                  style={{
                    borderRadius: 8,
                    height: 40,
                    paddingLeft: 24,
                    paddingRight: 24,
                    background:
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    border: "none",
                    boxShadow: shadows.md,
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  onClick={() => navigate(-1)}
                  style={{
                    borderRadius: 8,
                    height: 40,
                    paddingLeft: 24,
                    paddingRight: 24,
                    borderColor: colors.gray300,
                  }}
                >
                  Go Back
                </Button>
              </div>
            </motion.div>
          }
        />
      </motion.div>
    </div>
  );
};

export default NotFound;
