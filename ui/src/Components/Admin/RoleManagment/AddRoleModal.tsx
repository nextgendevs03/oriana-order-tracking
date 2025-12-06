import { Modal, Form, Select, Checkbox, Button, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Option } = Select;

const roleOptions = ["Super Admin", "Admin", "Manager", "Viewer", "Sales Person"];
const descriptionOptions = [
  "Full access to system",
  "Can manage users and roles",
  "Can view reports",
  "Can manage orders",
  "Read only access",
];
const permissionsData = [
  {
    group: "Users",
    items: [
      { key: "user.view", label: "View Users", desc: "Can view user list" },
      { key: "user.create", label: "Create Users", desc: "Can create new users" },
      { key: "user.edit", label: "Edit Users", desc: "Can edit users" },
      { key: "user.delete", label: "Delete Users", desc: "Can delete users" },
      { key: "user.toggle", label: "Toggle User Status", desc: "Activate/Deactivate users" },
    ],
  },
];

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  roleToEdit?: any;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ open, onClose, onSubmit, roleToEdit }) => {
  const [form] = Form.useForm();
  const [expandedGroup, setExpandedGroup] = useState<string>("Users");

  // Pre-fill values when editing
  useEffect(() => {
    if (roleToEdit) {
      form.setFieldsValue({
        roleName: roleToEdit.roleName,
        description: roleToEdit.description,
        permissions: roleToEdit.permissions || [],
      });
      setExpandedGroup("Users");
    } else {
      form.resetFields();
    }
  }, [roleToEdit, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={roleToEdit ? "Edit Role" : "Add New Role"}
      open={open}
      onCancel={onClose}
      width={600}
      centered
      footer={[
        <Button onClick={onClose} key="cancel">Cancel</Button>,
        <Button type="primary" onClick={handleSubmit} key="create">
          {roleToEdit ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>

        {/* Role Name */}
        <Form.Item
          label="Role Name"
          name="roleName"
          rules={[{ required: true, message: "Role name is required" }]}
        >
          <Select showSearch placeholder="Select role name" allowClear>
            {roleOptions.map((role) => (
              <Option key={role} value={role}>{role}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Select showSearch placeholder="Select description" allowClear>
            {descriptionOptions.map((desc) => (
              <Option key={desc} value={desc}>{desc}</Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        {/* Permissions */}
        <Form.Item name="permissions">
          <div style={{ maxHeight: 350, overflowY: "auto" }}> {/* Increased height */}
            {permissionsData.map((group) => {
              const groupValues = form.getFieldValue("permissions") || [];
              const allChecked = group.items.every(item => groupValues.includes(item.key));
              const indeterminate = !allChecked && group.items.some(item => groupValues.includes(item.key));

              return (
                <div key={group.group} style={{ marginBottom: 12 }}>
                  {/* Group Header */}
                  <div
                    onClick={() => setExpandedGroup(expandedGroup === group.group ? "" : group.group)}
                    style={{
                      fontWeight: 600,
                      padding: 8,
                      background: "#fafafa",
                      borderRadius: 6,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      indeterminate={indeterminate}
                      checked={allChecked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newValues = checked
                          ? Array.from(new Set([...groupValues, ...group.items.map(i => i.key)]))
                          : groupValues.filter((v: string) => !group.items.map(i => i.key).includes(v));
                        form.setFieldsValue({ permissions: newValues });
                      }}
                    >
                      {group.group} <span style={{ color: "#1677ff" }}>{group.items.length}</span>
                    </Checkbox>
                    <DownOutlined />
                  </div>

                  {/* Inner Checkboxes */}
                  {expandedGroup === group.group && (
                    <div style={{ marginLeft: 24, marginTop: 8 }}>
                      <Checkbox.Group style={{ display: "flex", flexDirection: "column" }}>
                        {group.items.map((item) => (
                          <div key={item.key} style={{ marginBottom: 4 }}>
                            <Checkbox value={item.key}>
                              <b>{item.label}</b>
                            </Checkbox>
                            <div style={{ fontSize: 12, color: "#999", marginLeft: 24 }}>
                              {item.key} - {item.desc}
                            </div>
                          </div>
                        ))}
                      </Checkbox.Group>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default AddRoleModal;
