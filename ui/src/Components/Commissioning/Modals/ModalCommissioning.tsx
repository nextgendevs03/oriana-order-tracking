// import React, { useEffect } from "react";
// import { Modal, Form, Input, DatePicker, Select } from "antd";
// import dayjs from "dayjs";
// import { CommissioningDataType } from "../CommissioningForm";

// const { TextArea } = Input;

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CommissioningDataType) => void;
//   editRecord: CommissioningDataType | null;
// }

// const ModalCommissioning: React.FC<Props> = ({
//   open,
//   onClose,
//   onSubmit,
//   editRecord,
// }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (editRecord) {
//       form.setFieldsValue({
//         ...editRecord,
//         expectedDate: editRecord.expectedDate
//           ? dayjs(editRecord.expectedDate)
//           : undefined,
//         confirmedDate: editRecord.confirmedDate
//           ? dayjs(editRecord.confirmedDate)
//           : undefined,
//         commissioningDate: editRecord.commissioningDate
//           ? dayjs(editRecord.commissioningDate)
//           : undefined,
//       });
//     } else {
//       // If adding new or editRecord cleared, reset form
//       form.resetFields();
//     }
//   }, [editRecord, form, open]);

//   // Make sure modal close resets form as well
//   useEffect(() => {
//     if (!open) {
//       form.resetFields();
//     }
//   }, [open, form]);

//   // onFinish will be called only when validation passes
//   const handleFinish = (values: any) => {
//     onSubmit({
//       key: editRecord?.key || Date.now(),
//       expectedDate: values.expectedDate
//         ? values.expectedDate.format("YYYY-MM-DD")
//         : "",
//       ticketNo: values.ticketNo || "",
//       engineer: values.engineer || "",
//       confirmedDate: values.confirmedDate
//         ? values.confirmedDate.format("YYYY-MM-DD")
//         : "",
//       issues: values.issues || "",
//       solution: values.solution || "",
//       commissioningDate: values.commissioningDate
//         ? values.commissioningDate.format("YYYY-MM-DD")
//         : "",
//       status: values.status || "",
//       remarks: values.remarks || "",
//     });

//     // parent already closes modal in handleSubmit, but reset here to be safe
//     form.resetFields();
//   };

//   return (
//     <Modal
//       open={open}
//       title={
//         editRecord ? "Edit Commissioning Details" : "Add Commissioning Details"
//       }
//       onCancel={() => {
//         onClose();
//         form.resetFields();
//       }}
//       onOk={() => form.submit()} // triggers Form onFinish after validation
//       okText={editRecord ? "Update" : "Submit"}
//     >
//       <Form form={form} layout="vertical" onFinish={handleFinish}>
//         <Form.Item
//           label="Expected Commissioning Date"
//           name="expectedDate"
//           rules={[{ required: true, message: "Please select expected date" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item
//           label="Service Ticket No (OEM)"
//           name="ticketNo"
//           rules={[{ required: true, message: "Please enter ticket no" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Service Engineer Assigned"
//           name="engineer"
//           rules={[{ required: true, message: "Please enter engineer name" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Confirmed Commissioning Date"
//           name="confirmedDate"
//           rules={[{ required: true, message: "Please select confirmed date" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item label="Issues Arising During Commissioning" name="issues">
//           <TextArea rows={3} />
//         </Form.Item>

//         <Form.Item label="Solution for Issues" name="solution">
//           <TextArea rows={3} />
//         </Form.Item>

//         <Form.Item label="Commissioning Date" name="commissioningDate">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item label="Commissioning Status" name="status">
//           <Select
//             options={[
//               { value: "Pending", label: "Pending" },
//               { value: "In-Progress", label: "In-Progress" },
//               { value: "Completed", label: "Completed" },
//             ]}
//           />
//         </Form.Item>

//         <Form.Item label="Remarks" name="remarks">
//           <TextArea rows={2} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default ModalCommissioning;


import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Row, Col } from "antd";
import dayjs from "dayjs";
import { CommissioningDataType } from "../CommissioningForm";

const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CommissioningDataType) => void;
  editRecord: CommissioningDataType | null;
}

const ModalCommissioning: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editRecord,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editRecord) {
      form.setFieldsValue({
        ...editRecord,
        expectedDate: editRecord.expectedDate
          ? dayjs(editRecord.expectedDate)
          : undefined,
        confirmedDate: editRecord.confirmedDate
          ? dayjs(editRecord.confirmedDate)
          : undefined,
        commissioningDate: editRecord.commissioningDate
          ? dayjs(editRecord.commissioningDate)
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editRecord, form, open]);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleFinish = (values: any) => {
    onSubmit({
      key: editRecord?.key || Date.now(),
      expectedDate: values.expectedDate?.format("YYYY-MM-DD") || "",
      ticketNo: values.ticketNo || "",
      engineer: values.engineer || "",
      confirmedDate: values.confirmedDate?.format("YYYY-MM-DD") || "",
      issues: values.issues || "",
      solution: values.solution || "",
      commissioningDate: values.commissioningDate?.format("YYYY-MM-DD") || "",
      status: values.status || "",
      remarks: values.remarks || "",
    });

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      width={700} // Smaller modal width
      title={editRecord ? "Edit Commissioning Details" : "Add Commissioning Details"}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText={editRecord ? "Update" : "Submit"}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        size="small"   // compact
        onFinish={handleFinish}
      >
        {/* First Row */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Expected Date"
              name="expectedDate"
              rules={[{ required: true, message: "Please select expected date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ticket No"
              name="ticketNo"
              rules={[{ required: true, message: "Please enter ticket no" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Second Row */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Engineer"
              name="engineer"
              rules={[{ required: true, message: "Please enter engineer name" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Confirmed Date"
              name="confirmedDate"
              rules={[{ required: true, message: "Please select confirmed date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Third Row */}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Commissioning Date" name="commissioningDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "In-Progress", label: "In-Progress" },
                  { value: "Completed", label: "Completed" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Issues */}
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item label="Issues" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} name="issues">
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Solution */}
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label="Solution"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              name="solution"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Remarks */}
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label="Remarks"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              name="remarks"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCommissioning;
