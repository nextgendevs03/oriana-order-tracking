import { useState, useMemo, useEffect } from "react";
import { Modal, Form, Select, Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useGetUsersQuery } from "../../store/api/userApi";
import { useUpdatePOMutation } from "../../store/api/poApi";
import { useDebounce } from "../../hooks";
import { useToast } from "../../hooks/useToast";
import { usePermission } from "../../hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";

interface UpdateAssignDispatchToModalProps {
  visible: boolean;
  onClose: () => void;
  poId: string;
  currentAssignDispatchTo?: number | null;
  currentAssignedUserName?: string | null;
}

const UpdateAssignDispatchToModal: React.FC<
  UpdateAssignDispatchToModalProps
> = ({
  visible,
  onClose,
  poId,
  currentAssignDispatchTo,
  currentAssignedUserName,
}) => {
  const [form] = Form.useForm();
  const toast = useToast();

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const debouncedUserSearchTerm = useDebounce(userSearchTerm, 500);

  // Fetch users (active users only, limit 10 initially, with search)
  const { data: usersResponse, isError: usersError } = useGetUsersQuery({
    page: 1,
    limit: 10,
    searchKey: debouncedUserSearchTerm ? "username" : undefined,
    searchTerm: debouncedUserSearchTerm || undefined,
    sortBy: "username",
    sortOrder: "ASC",
  });

  const [updatePO, { isLoading: isUpdating }] = useUpdatePOMutation();

  // Transform users data to Select options (filter active users only)
  const userOptions = useMemo(() => {
    if (!usersResponse?.data || usersError) return [];
    return usersResponse.data
      .filter((user) => user.isActive)
      .map((user) => ({
        value: user.userId,
        label: user.username,
      }));
  }, [usersResponse?.data, usersError]);

  // Set initial form value when modal opens
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        assignDispatchTo: currentAssignDispatchTo || undefined,
      });
      setUserSearchTerm("");
    }
  }, [visible, currentAssignDispatchTo, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await updatePO({
        poId,
        assignDispatchTo: values.assignDispatchTo || null,
      }).unwrap();

      toast.success("Assign Dispatch To updated successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error("Failed to update Assign Dispatch To", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUserSearchTerm("");
    onClose();
  };

  return (
    <Modal
      title="Update Assign Dispatch To"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,

        <Button
          key="submit"
          type="primary"
          icon={<EditOutlined />}
          onClick={handleSubmit}
          loading={isUpdating}
        >
          Update
        </Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="assignDispatchTo"
          label="Assign Dispatch To"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            placeholder="Select person (optional)"
            options={userOptions}
            allowClear
            showSearch
            filterOption={false}
            onSearch={(value) => setUserSearchTerm(value)}
            style={{ width: "100%" }}
            notFoundContent={
              usersError
                ? "Error loading users"
                : debouncedUserSearchTerm
                  ? "No users found"
                  : "Type to search users"
            }
          />
        </Form.Item>
        {currentAssignedUserName && (
          <div style={{ marginTop: 8, color: "#666", fontSize: "0.875rem" }}>
            Current: {currentAssignedUserName}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateAssignDispatchToModal;
