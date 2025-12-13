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
    initialValues ? form.setFieldsValue(initialValues) : form.resetFields();
  });

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (initialValues) {
      await updateOEM({
        id: initialValues.oemId,
        data: values,
      });
    } else {
      await createOEM(values);
    }

    form.resetFields();
    onCancel();
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

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOEMModal;
