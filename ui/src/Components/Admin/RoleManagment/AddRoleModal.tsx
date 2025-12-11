import React, { useEffect } from "react";
import { Modal, Form, Checkbox, Button, Divider, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { closeModal } from "../../../store/roleSlice";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation
} from "../../../store/api/roleApi";

type PermissionItem = { key: string; label: string; desc?: string };
type PermissionGroup = { group: string; items: PermissionItem[] };

const permissionsData: PermissionGroup[] = [
  {
    group: "Users",
    items: [
      {
        key: "user.view",
        label: "View Users",
        desc: "Can view user list and details",
      },
      {
        key: "user.create",
        label: "Create Users",
        desc: "Can create new users",
      },
      {
        key: "user.edit",
        label: "Edit Users",
        desc: "Can edit existing users",
      },
      { key: "user.delete", label: "Delete Users", desc: "Can delete users" },
      {
        key: "user.toggle",
        label: "Toggle User Status",
        desc: "Can activate/deactivate users",
      },
    ],
  },
];

const AddRoleModal: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const isModalOpen = useSelector((state: RootState) => state.role.isModalOpen);
  const roleToEdit = useSelector((state: RootState) => state.role.roleToEdit);

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  useEffect(() => {
    if (roleToEdit) {
      form.setFieldsValue({
        roleName: roleToEdit.roleName,
        description: roleToEdit.description,
        permissions: roleToEdit.permissions || []
      });
    } else {
      form.resetFields();
    }
  }, [roleToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (roleToEdit) {
        await updateRole({ id: roleToEdit.roleId, data: values }).unwrap();
      } else {
        await createRole(values).unwrap();
      }
      dispatch(closeModal());
      form.resetFields();
    } catch (err) {
      console.error("Error creating/updating role:", err);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
    form.resetFields();
  };

  const getSelected = (): string[] => {
    const v = form.getFieldValue("permissions");
    return Array.isArray(v) ? v : [];
  };

  return (
    <Modal
      title={roleToEdit ? "Edit Role" : "Add Role"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={500}
      centered
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "20px 24px" }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {roleToEdit ? "Update" : "Create"}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>

        {/* ROLE NAME Input */}
        <Form.Item
          name="roleName"
          label="Role Name"
          rules={[{ required: true, message: "Role name is required" }]}
        >
          <Input placeholder="Enter Role Name" />
        </Form.Item>

        {/* DESCRIPTION Input */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input placeholder="Enter Description" />
        </Form.Item>

        <Divider>Permissions</Divider>

        <Form.Item name="permissions" initialValue={[]}>
          <Checkbox.Group
            value={form.getFieldValue("permissions") || []}
            onChange={(checkedValues: any[]) =>
              form.setFieldsValue({ permissions: checkedValues })
            }
          >
            {permissionsData.map((group) => {
              const selected = getSelected();
              const groupKeys = group.items.map((i) => i.key);
              const allChecked = group.items.every((i) =>
                selected.includes(i.key)
              );
              const someChecked =
                !allChecked &&
                group.items.some((i) => selected.includes(i.key));

              return (
                <div
                  key={group.group}
                  style={{
                    marginBottom: 12,
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    background: "#fff",
                    padding: 10,
                  }}
                >
                  <Checkbox
                    indeterminate={someChecked}
                    checked={allChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = getSelected();
                      const newValues = checked
                        ? Array.from(new Set([...current, ...groupKeys]))
                        : current.filter((v) => !groupKeys.includes(v));
                      form.setFieldsValue({ permissions: newValues });
                    }}
                    style={{ fontWeight: 600, marginBottom: 8 }}
                  >
                    {group.group} ({group.items.length})
                  </Checkbox>

                  {group.items.map((item) => (
                    <div
                      key={item.key}
                      style={{ marginLeft: 20, marginBottom: 6 }}
                    >
                      <Checkbox value={item.key}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 500 }}>{item.label}</span>
                          {item.desc && (
                            <span
                              style={{
                                fontSize: 12,
                                color: "#8c8c8c",
                                marginTop: 2,
                              }}
                            >
                              {item.desc}
                            </span>
                          )}
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;
