import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import {
  useCreateOEMMutation,
  useUpdateOEMMutation,
} from "../../../store/api/oemApi";

interface Props {
  open: boolean;
  onCancel: () => void;
  initialValues?: any;
}

const AddOEMModal: React.FC<Props> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [createOEM] = useCreateOEMMutation();
  const [updateOEM] = useUpdateOEMMutation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        isActive: initialValues.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (initialValues) {
        await updateOEM({
          id: initialValues.oemId,
          data: values,
        }).unwrap();
      } else {
        await createOEM(values).unwrap();
      }
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Error submitting OEM:", error);
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit OEM" : "Add OEM"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="OEM Name"
          name="name"
          rules={[{ required: true, message: "Enter OEM Name" }]}
        >
          <Input placeholder="Enter OEM Name" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          rules={[{ required: true, message: "Select status" }]}
        >
          <Select
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOEMModal;
