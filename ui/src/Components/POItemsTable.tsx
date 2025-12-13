import { Table, Button, Form, InputNumber, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FormListFieldData, FormListOperation } from "antd/es/form";

interface ItemDetail {
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  gstPercent: number;
  finalPrice: number;
  warranty: string;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

interface POItemsTableProps {
  fields: FormListFieldData[];
  add: FormListOperation["add"];
  remove: FormListOperation["remove"];
  categoryOptions: DropdownOption[];
  oemNameOptions: DropdownOption[];
  productOptions: DropdownOption[];
  warrantyOptions: DropdownOption[];
  gstPercentOptions: DropdownOption[];
  onUpdateCalculatedFields: (index: number) => void;
}

const POItemsTable: React.FC<POItemsTableProps> = ({
  fields,
  add,
  remove,
  categoryOptions,
  oemNameOptions,
  productOptions,
  warrantyOptions,
  gstPercentOptions,
  onUpdateCalculatedFields,
}) => {
  const getItemColumns = (
    removeFn: (index: number | number[]) => void
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
              onChange={() => onUpdateCalculatedFields(record.name)}
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
              onChange={() => onUpdateCalculatedFields(record.name)}
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
              onChange={() => onUpdateCalculatedFields(record.name)}
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
        title: "GST %",
        dataIndex: "gstPercent",
        key: "gstPercent",
        width: 100,
        render: (_, record) => (
          <Form.Item
            name={[record.name, "gstPercent"]}
            rules={[{ required: true, message: "Required" }]}
            style={{ margin: 0 }}
          >
            <Select
              placeholder="Select"
              options={gstPercentOptions}
              onChange={() => onUpdateCalculatedFields(record.name)}
            />
          </Form.Item>
        ),
      },
      {
        title: "Final Price",
        dataIndex: "finalPrice",
        key: "finalPrice",
        width: 130,
        render: (_, record) => (
          <Form.Item name={[record.name, "finalPrice"]} style={{ margin: 0 }}>
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
            onClick={() => removeFn(record.name)}
          />
        ),
      },
    ];

  const handleAddItem = () => {
    add({
      category: undefined,
      oemName: undefined,
      product: undefined,
      quantity: undefined,
      spareQuantity: undefined,
      totalQuantity: 0,
      pricePerUnit: undefined,
      totalPrice: 0,
      gstPercent: undefined,
      finalPrice: 0,
      warranty: undefined,
    });
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddItem}
          style={{ width: "200px" }}
        >
          Add Item Details
        </Button>
      </div>

      {fields.length > 0 && (
        <Table
          columns={getItemColumns(remove) as ColumnsType<{
            key: number;
            name: number;
          }>}
          dataSource={fields.map((field) => ({
            ...field,
            key: field.key,
            name: field.name,
          }))}
          scroll={{ x: 1550 }}
          pagination={false}
          bordered
          size="small"
        />
      )}
    </>
  );
};

export default POItemsTable;
