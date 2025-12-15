import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useCreateClientMutation } from "../../store/api/clientApi";

interface AddClientModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: (clientName: string) => void;
  initialClientName?: string;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onCancel,
  onSuccess,
  initialClientName = "",
}) => {
  const [form] = Form.useForm();
  const [clientName, setClientName] = useState(initialClientName);
  const [createClient, { isLoading }] = useCreateClientMutation();

  // Update clientName when initialClientName changes or modal opens
  useEffect(() => {
    if (open && initialClientName) {
      setClientName(initialClientName);
      form.setFieldsValue({ clientName: initialClientName });
    }
  }, [open, initialClientName, form]);

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

      await createClient({
        clientName: values.clientName.trim(),
        isActive: true,
        createdBy: "admin", // TODO: Get from auth context
      }).unwrap();

      message.success("Client created successfully");
      form.resetFields();
      setClientName("");
      onSuccess?.(values.clientName.trim());
      onCancel();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create client");
    }
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
  };

  return (
    <Modal
      title="Add New Client"
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
          Submit
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
      </Form>
    </Modal>
  );
};

export default AddClientModal;
