import { Form, Select, Button, Table, InputNumber, FormInstance, Col, Row } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";

interface ItemDetail {
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  warranty: string;
}

const PurchaseOrderItemTable = ({ form }: { form: FormInstance }) => {
  const warrantyOptions = [
    { value: "3_years", label: "3 Years" },
    { value: "5_years", label: "5 Years" },
    { value: "7_years", label: "7 Years" },
  ];

  // Item detail dropdown options
  const categoryOptions = [
    { value: "module", label: "Module" },
    { value: "invertor", label: "Invertor" },
  ];

  const oemNameOptions = [
    { value: "solis", label: "Solis" },
    { value: "jio", label: "Jio" },
    { value: "dummy1", label: "Dummy1" },
  ];

  const productOptions = [
    { value: "product1", label: "Product1" },
    { value: "product2", label: "Product2" },
  ];

  const updateCalculatedFields = (index: number) => {
    const poItems = form.getFieldValue("poItems") || [];
    const item = poItems[index];
    if (item) {
      const quantity = item.quantity || 0;
      const spareQuantity = item.spareQuantity || 0;
      const pricePerUnit = item.pricePerUnit || 0;
      const totalQuantity = quantity + spareQuantity;
      const totalPrice = quantity * pricePerUnit;

      const newItems = [...poItems];
      newItems[index] = {
        ...newItems[index],
        totalQuantity,
        totalPrice,
      };
      form.setFieldsValue({ poItems: newItems });
    }
  };

  const getItemColumns = (
    remove: (index: number | number[]) => void
  ): ColumnsType<ItemDetail & { name: number }> => [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "category"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={categoryOptions} />
        </Form.Item>
      ),
    },
    {
      title: "OEM Name",
      dataIndex: "oemName",
      key: "oemName",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "oemName"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={oemNameOptions} />
        </Form.Item>
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "product"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={productOptions} />
        </Form.Item>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "quantity"]}
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 1, message: "Min 1 required" },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Spare Quantity",
      dataIndex: "spareQuantity",
      key: "spareQuantity",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "spareQuantity"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      width: 120,
      render: (_, record) => (
        <Form.Item name={[record.name, "totalQuantity"]} style={{ margin: 0 }}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Price per Unit",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "pricePerUnit"]}
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 1, message: "Min 1 required" },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            onChange={() => updateCalculatedFields(record.name)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (_, record) => (
        <Form.Item name={[record.name, "totalPrice"]} style={{ margin: 0 }}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Warranty",
      dataIndex: "warranty",
      key: "warranty",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "warranty"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select placeholder="Select" options={warrantyOptions} />
        </Form.Item>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      fixed: "right",
      width: 70,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(record.name)}
        />
      ),
    },
  ];
  return (
    <Form.List name="poItems">
            {(fields, { add, remove }) => (
              <>
                <Row style={{ marginBottom: "1rem" }}>
                  <Col span={24}>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        add({
                          category: undefined,
                          oemName: undefined,
                          product: undefined,
                          quantity: undefined,
                          spareQuantity: undefined,
                          totalQuantity: 0,
                          pricePerUnit: undefined,
                          totalPrice: 0,
                          warranty: undefined,
                        })
                      }
                      style={{ width: "200px" }}
                    >
                      Add Item Details
                    </Button>
                  </Col>
                </Row>

                {/* Item Details Table */}
                {fields.length > 0 && (
                  <Row style={{ marginBottom: "1.5rem" }}>
                    <Col span={24}>
                      <Table
                        columns={
                          getItemColumns(remove) as ColumnsType<{
                            key: number;
                            name: number;
                          }>
                        }
                        dataSource={fields.map((field) => ({
                          ...field,
                          key: field.key,
                          name: field.name,
                        }))}
                        scroll={{ x: 1300 }}
                        pagination={false}
                        bordered
                        size="small"
                      />
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Form.List>
  );
};

export default PurchaseOrderItemTable;
