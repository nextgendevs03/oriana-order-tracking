import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { DispatchData } from "./Modals/dispatch.type";

interface DispatchFormProps {
  products: { id: string; name: string }[];
  onAddDispatch: (data: DispatchData) => void;
}

const DispatchForm: React.FC<DispatchFormProps> = ({ products, onAddDispatch }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const disablePastDates = (current: any) => {
    return current && current < dayjs().endOf("day");
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formatted: DispatchData = {
        ...values,
        confirmDate: values.confirmDate.format("YYYY-MM-DD"),
      };

      onAddDispatch(formatted);
      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Dispatch
      </Button>

      <Modal
        title="Add Dispatch Details"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Submit"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="product" label="Select Product">
            <Select placeholder="Choose product">
              {products.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="projectName"
            label="Project Name"
            rules={[{ required: true, message: "Project name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="projectLocation"
            label="Project Location"
            rules={[{ required: true, message: "Project location is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="deliveryAddress"
            label="Delivery Address"
            rules={[{ required: true, message: "Delivery address is required" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="googleMapLink" label="Google Map Link">
            <Input />
          </Form.Item>

          <Form.Item
            name="deliveryQty"
            label="Delivery Quantity"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="confirmDate"
            label="Confirm Dispatch Date"
            rules={[{ required: true, message: "Select date" }]}
          >
            <DatePicker style={{ width: "100%" }} disabledDate={disablePastDates} />
          </Form.Item>

          <Form.Item
            name="deliveryContact"
            label="Delivery Contact"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DispatchForm;
