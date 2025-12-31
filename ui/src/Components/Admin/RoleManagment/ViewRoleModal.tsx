import React from "react";
import { Modal, Descriptions, Tag, Space, Button } from "antd";
import { RoleResponse, PermissionResponse } from "@OrianaTypes";

interface ViewRoleModalProps {
  open: boolean;
  onClose: () => void;
  role: RoleResponse | null;
}

const ViewRoleModal: React.FC<ViewRoleModalProps> = ({
  open,
  onClose,
  role,
}) => {
  if (!role) return null;

  return (
    <Modal
      title="Role Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={600}
      centered
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Role Name">
          <strong>{role.roleName}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {role.description || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={role.isActive ? "green" : "red"}>
            {role.isActive ? "Active" : "Inactive"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Permissions">
          {role.permissions && role.permissions.length > 0 ? (
            <Space wrap>
              {role.permissions.map((permission: PermissionResponse) => (
                <Tag key={permission.permissionId} color="blue">
                  {permission.permissionName}
                </Tag>
              ))}
            </Space>
          ) : (
            <span style={{ color: "#8c8c8c" }}>No permissions assigned</span>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Total Permissions">
          <Tag color="blue">{role.permissions?.length || 0}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewRoleModal;

