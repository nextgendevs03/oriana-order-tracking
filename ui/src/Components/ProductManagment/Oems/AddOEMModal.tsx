import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: (newOEM: { name: string; status: "Active" | "Inactive" }) => void;
  initialValues?: { name: string; status: "Active" | "Inactive" };
}

const AddOEMModal: React.FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = (values: any) => {
    onSuccess(values);
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? "Edit OEM" : "Add OEM"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="OEM Name"
          name="name"
          rules={[{ required: true, message: "Enter OEM name" }]}
        >
          <Input placeholder="Enter OEM name" />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddOEMModal;
