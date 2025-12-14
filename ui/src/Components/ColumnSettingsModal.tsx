import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Switch, Space } from "antd";
import {
  SettingOutlined,
  AppstoreOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export interface ColumnConfig {
  key: string;
  title: string;
  defaultVisible?: boolean;
}

interface ColumnSettingsModalProps {
  columns: ColumnConfig[];
  storageKey: string;
  onVisibilityChange: (visibleColumns: string[]) => void;
}

const PRIMARY_COLOR = "#4b6cb7";

const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  columns,
  storageKey,
  onVisibilityChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedColumns(parsed);
        onVisibilityChange(parsed);
      } catch {
        const defaults = columns
          .filter((col) => col.defaultVisible !== false)
          .map((col) => col.key);
        setSelectedColumns(defaults);
        onVisibilityChange(defaults);
      }
    } else {
      const defaults = columns
        .filter((col) => col.defaultVisible !== false)
        .map((col) => col.key);
      setSelectedColumns(defaults);
      onVisibilityChange(defaults);
    }
  }, [columns, storageKey, onVisibilityChange]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSelectedColumns(JSON.parse(saved));
      } catch {
        // Keep current selection
      }
    }
    setIsModalOpen(false);
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(selectedColumns));
    onVisibilityChange(selectedColumns);
    setIsModalOpen(false);
  };

  const handleToggle = (key: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, key]);
    } else {
      setSelectedColumns(selectedColumns.filter((k) => k !== key));
    }
  };

  const handleSelectAll = () => {
    const allKeys = columns.map((col) => col.key);
    setSelectedColumns(allKeys);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const visibleCount = selectedColumns.length;
  const totalCount = columns.length;

  return (
    <>
      <Button
        icon={<AppstoreOutlined />}
        onClick={handleOpenModal}
        style={{
          borderRadius: 8,
          height: 38,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Columns
        <span
          style={{
            background: visibleCount === totalCount ? "#f0f0f0" : PRIMARY_COLOR,
            color: visibleCount === totalCount ? "#595959" : "#fff",
            borderRadius: 10,
            padding: "2px 8px",
            fontSize: 11,
            fontWeight: 600,
            marginLeft: 2,
          }}
        >
          {visibleCount}
        </span>
      </Button>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={400}
        centered
        styles={{
          body: { padding: 0 },
          content: { borderRadius: 16, overflow: "hidden" },
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #182848 100%)`,
            padding: "24px 28px",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppstoreOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                Column Settings
              </div>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                {visibleCount} of {totalCount} columns visible
              </Text>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#8c8c8c", fontSize: 12, fontWeight: 500 }}>
            QUICK ACTIONS
          </Text>
          <Space size={8}>
            <Button
              size="small"
              onClick={handleSelectAll}
              style={{ borderRadius: 6, fontSize: 12 }}
            >
              Show All
            </Button>
            <Button
              size="small"
              onClick={handleDeselectAll}
              style={{ borderRadius: 6, fontSize: 12 }}
            >
              Hide All
            </Button>
          </Space>
        </div>

        {/* Column List */}
        <div
          style={{
            maxHeight: 360,
            overflowY: "auto",
            padding: "8px 16px",
          }}
        >
          {columns.map((col, index) => {
            const isVisible = selectedColumns.includes(col.key);
            return (
              <div
                key={col.key}
                onClick={() => handleToggle(col.key, !isVisible)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  marginBottom: index === columns.length - 1 ? 0 : 4,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: isVisible ? "#f8faff" : "#fff",
                  border: isVisible
                    ? `1px solid ${PRIMARY_COLOR}20`
                    : "1px solid transparent",
                }}
                className="column-item"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: isVisible ? `${PRIMARY_COLOR}15` : "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isVisible ? (
                      <EyeOutlined
                        style={{ color: PRIMARY_COLOR, fontSize: 14 }}
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        style={{ color: "#bfbfbf", fontSize: 14 }}
                      />
                    )}
                  </div>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      color: isVisible ? "#262626" : "#8c8c8c",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {col.title}
                  </Text>
                </div>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: isVisible
                      ? `2px solid ${PRIMARY_COLOR}`
                      : "2px solid #d9d9d9",
                    background: isVisible ? PRIMARY_COLOR : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isVisible && (
                    <CheckOutlined style={{ color: "#fff", fontSize: 10 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <Button
            onClick={handleCancel}
            style={{ borderRadius: 8, height: 40, paddingLeft: 20, paddingRight: 20 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            style={{
              borderRadius: 8,
              height: 40,
              paddingLeft: 24,
              paddingRight: 24,
              background: PRIMARY_COLOR,
              border: "none",
              fontWeight: 500,
            }}
          >
            Apply Changes
          </Button>
        </div>

        <style>{`
          .column-item:hover {
            background: #f5f7fa !important;
          }
        `}</style>
      </Modal>
    </>
  );
};

export default ColumnSettingsModal;
