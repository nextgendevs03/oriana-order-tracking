import React, { useEffect, useMemo } from "react";
import { Modal, Form, Button, Input, Select, Spin, Checkbox } from "antd";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../../store/api/roleApi";
import { PermissionResponse, RoleResponse } from "@OrianaTypes";

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  roleToEdit?: RoleResponse | null;
  permissions: PermissionResponse[];
  isLoadingPermissions: boolean;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  open,
  onClose,
  roleToEdit,
  permissions,
  isLoadingPermissions,
}) => {
  const [form] = Form.useForm();

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const isLoading = isCreating || isUpdating;

  // Map permissions to Select options
  const permissionOptions = useMemo(() => {
    if (!permissions || permissions.length === 0) return [];
    return permissions.map((permission: PermissionResponse) => ({
      label: permission.permissionName,
      value: permission.permissionId,
      description: permission.description,
    }));
  }, [permissions]);

  // Get all permission IDs
  const allPermissionIds = useMemo(() => {
    return permissionOptions.map((option) => option.value);
  }, [permissionOptions]);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      form.setFieldValue("permissionIds", allPermissionIds);
    } else {
      form.setFieldValue("permissionIds", []);
    }
  };

  useEffect(() => {
    if (roleToEdit) {
      // Extract permissionIds from roleToEdit.permissions array
      const permissionIds = roleToEdit.permissions
        ? roleToEdit.permissions.map((p: PermissionResponse) => p.permissionId)
        : [];

      form.setFieldsValue({
        roleName: roleToEdit.roleName,
        description: roleToEdit.description,
        permissionIds: permissionIds,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ permissionIds: [] });
    }
  }, [roleToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (roleToEdit) {
        await updateRole({
          id: roleToEdit.roleId,
          data: values,
        }).unwrap();
      } else {
        await createRole(values).unwrap();
      }
      onClose();
      form.resetFields();
    } catch (err) {
      console.error("Error creating/updating role:", err);
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title={roleToEdit ? "Edit Role" : "Add Role"}
      open={open}
      onCancel={handleCancel}
      width={500}
      centered
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "20px 24px" }}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
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

        {/* PERMISSIONS Multi-Select */}
        <Form.Item
          name="permissionIds"
          label="Permissions"
          rules={[{ required: false }]}
        >
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.permissionIds !== currentValues.permissionIds
            }
          >
            {({ getFieldValue }) => {
              const selectedIds = getFieldValue("permissionIds") || [];
              const allSelected =
                allPermissionIds.length > 0 &&
                allPermissionIds.every((id) => selectedIds.includes(id));
              const indeterminate =
                selectedIds.length > 0 &&
                selectedIds.length < allPermissionIds.length;

              return (
                <Select
                  mode="multiple"
                  placeholder="Select permissions"
                  style={{ width: "100%" }}
                  loading={isLoadingPermissions}
                  notFoundContent={
                    isLoadingPermissions ? (
                      <Spin size="small" />
                    ) : (
                      "No permissions found"
                    )
                  }
                  optionLabelProp="label"
                  options={permissionOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                    title: option.description || option.label,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  maxTagCount="responsive"
                  dropdownRender={(menu) => (
                    <>
                      <div
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #f0f0f0",
                          background: "#fafafa",
                        }}
                      >
                        <Checkbox
                          checked={allSelected}
                          indeterminate={indeterminate}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          style={{ fontWeight: 500 }}
                        >
                          Select All ({allPermissionIds.length} permissions)
                        </Checkbox>
                      </div>
                      {menu}
                    </>
                  )}
                />
              );
            }}
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;
