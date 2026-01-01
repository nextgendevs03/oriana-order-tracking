import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../../../store/api/clientApi";
import type { ClientResponse } from "@OrianaTypes";
import { useToast } from "../../../hooks/useToast";

interface AddClientModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: (clientName: string) => void;
  initialClientName?: string;
  editingClient?: ClientResponse | null;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onCancel,
  onSuccess,
  initialClientName = "",
  editingClient = null,
}) => {
  const toast = useToast();
  const [form] = Form.useForm();
  const [clientName, setClientName] = useState(initialClientName);
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const isLoading = isCreating || isUpdating;
  const isEditing = !!editingClient;

  // Update form when editing client or initialClientName changes
  useEffect(() => {
    if (open) {
      if (editingClient) {
        form.setFieldsValue({
          clientName: editingClient.clientName,
          clientAddress: editingClient.clientAddress || "",
          clientContact: editingClient.clientContact || "",
          clientGST: editingClient.clientGST || "",
        });
        setClientName(editingClient.clientName);
      } else if (initialClientName) {
        setClientName(initialClientName);
        form.setFieldsValue({ clientName: initialClientName });
      }
    }
  }, [open, editingClient, initialClientName, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setClientName("");
    }
  }, [open, form]);

  const isSubmitDisabled = clientName.trim().length < 3 || isLoading;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && editingClient) {
        // Update existing client
        await updateClient({
          id: editingClient.clientId,
          data: {
            clientName: values.clientName.trim(),
            clientAddress: values.clientAddress?.trim() || undefined,
            clientContact: values.clientContact?.trim() || undefined,
            clientGST: values.clientGST?.trim() || undefined
          },
        }).unwrap();
        toast.success("Client updated successfully");
      } else {
        // Create new client
        await createClient({
          clientName: values.clientName.trim(),
          clientAddress: values.clientAddress?.trim() || undefined,
          clientContact: values.clientContact?.trim() || undefined,
          clientGST: values.clientGST?.trim() || undefined,
          isActive: true
        }).unwrap();
        toast.success("Client created successfully");
      }

      form.resetFields();
      setClientName("");
      onSuccess?.(values.clientName.trim());
      onCancel();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} client`
      );
    }
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
  };

  return (
    <Modal
      title={isEditing ? "Edit Client" : "Add New Client"}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          loading={isLoading}
        >
          {isEditing ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Client Name"
          name="clientName"
          rules={[
            { required: true, message: "Please enter client name" },
            { min: 3, message: "Client name must be at least 3 characters" },
          ]}
        >
          <Input
            placeholder="Enter client name (min 3 characters)"
            onChange={handleClientNameChange}
            maxLength={100}
          />
        </Form.Item>

        <Form.Item label="Client Address" name="clientAddress">
          <Input.TextArea
            placeholder="Enter client address"
            rows={3}
            maxLength={500}
          />
        </Form.Item>

        <Form.Item label="Client Contact" name="clientContact">
          <Input placeholder="Enter client contact" maxLength={100} />
        </Form.Item>

        <Form.Item label="Client GST" name="clientGST">
          <Input placeholder="Enter client GST number" maxLength={50} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClientModal;
