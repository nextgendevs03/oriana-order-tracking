import { Table, Select, InputNumber, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

export interface ItemFormValues {
  category: string;
  oemName: string;
  productModel: string;
  quantity?: number;
  spareQty?: number;
  totalQty?: number;
  pricePerUnit?: number;
  totalPrice?: number;
  warranty: string;
}

const inputStyle: React.CSSProperties = {
  width: 120,
};

const selectStyle: React.CSSProperties = {
  width: 150,
};

const PurchaseItemTable = ({ data, onUpdate, onDelete }: any) => {
  const handleChange = (
    index: number,
    field: keyof ItemFormValues,
    value: any
  ) => {
    const row = { ...data[index], [field]: value };

    row.totalQty = (row.quantity || 0) + (row.spareQty || 0);
    row.totalPrice = (row.totalQty || 0) * (row.pricePerUnit || 0);

    onUpdate(index, row);
  };

  const columns: any = [
    {
      title: "Category",
      width: 150,
      render: (_: any, row: ItemFormValues, index: number) => (
        <Select
          style={selectStyle}
          placeholder="Select"
          value={row.category}
          onChange={(v) => handleChange(index, "category", v)}
        >
          <Option value="Inverter">Inverter</Option>
            <Option value="Panel">Panel</Option>
            <Option value="DC Cable">DC Cable</Option>
            <Option value="AC Cable">AC Cable</Option>
            <Option value="MC4 Connector">MC4 Connector</Option>
            <Option value="SPD">SPD</Option>
            <Option value="Earthing Kit">Earthing Kit</Option>
            <Option value="Display Unit">Display Unit</Option>         
        </Select>
      ),
    },

    {
      title: "OEM Name",
      width: 150,
      render: (_: any, row: ItemFormValues, index: number) => (
        <Select
          style={selectStyle}
          placeholder="Select"
          value={row.oemName}
          onChange={(v) => handleChange(index, "oemName", v)}
        >
          <Option value="Sieneng">Sieneng</Option>
          <Option value="Solis">Solis</Option>
          <Option value="Jio">Jio</Option>
        </Select>
      ),
    },

    {
      title: "Product",
      width: 150,
      render: (_: any, row: ItemFormValues, index: number) => (
        <Select
          style={selectStyle}
          placeholder="Select"
          value={row.productModel}
          onChange={(v) => handleChange(index, "productModel", v)}
        >
          <Option value="SPD Type 1">SPD Type 1</Option>
            <Option value="SPD Type 2">SPD Type 2</Option>
            <Option value="ACDB">ACDB</Option>
            <Option value="DCDB">DCDB</Option>
            <Option value="MC4 Connector">MC4 Connector</Option>
            <Option value="WiFi Dongle">WiFi Dongle</Option>
            <Option value="Display Unit">Display Unit</Option>
        </Select>
      ),
    },

    {
      title: "Quantity",
      width: 120,
      render: (_: any, row: ItemFormValues, index: number) => (
        <InputNumber
          style={inputStyle}
          min={1}
          value={row.quantity ?? undefined}
          placeholder=""
          onChange={(v) => handleChange(index, "quantity", v)}
        />
      ),
    },

    {
      title: "Spare Quantity",
      width: 140,
      render: (_: any, row: ItemFormValues, index: number) => (
        <InputNumber
          style={inputStyle}
          min={0}
          value={row.spareQty ?? undefined}
          placeholder=""
          onChange={(v) => handleChange(index, "spareQty", v)}
        />
      ),
    },

    {
      title: "Total Quantity",
      width: 140,
      render: (_: any, row: ItemFormValues) => (
        <InputNumber
          style={inputStyle}
          value={row.totalQty ?? undefined}
          disabled
        />
      ),
    },

    {
      title: "Price per Unit",
      width: 140,
      render: (_: any, row: ItemFormValues, index: number) => (
        <InputNumber
          style={inputStyle}
          min={0}
          value={row.pricePerUnit ?? undefined}
          placeholder=""
          onChange={(v) => handleChange(index, "pricePerUnit", v)}
        />
      ),
    },

    {
      title: "Total Price",
      width: 140,
      render: (_: any, row: ItemFormValues) => (
        <InputNumber
          style={inputStyle}
          value={row.totalPrice ?? undefined}
          disabled
        />
      ),
    },

    {
      title: "Warranty",
      width: 150,
      render: (_: any, row: ItemFormValues, index: number) => (
        <Select
          style={selectStyle}
          placeholder="Select"
          value={row.warranty}
          onChange={(v) => handleChange(index, "warranty", v)}
        >
          <Option value="1 Year">1 Year</Option>
          <Option value="2 Years">2 Years</Option>
          <Option value="3 Years">3 Years</Option>
        </Select>
      ),
    },

    {
      title: "Delete",
      width: 80,
      render: (_: any, __: any, i: number) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(i)}
        />
      ),
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey={(_, i) => String(i)}
      scroll={{ x: 1500 }}
      style={{ borderRadius: 8 }}
    />
  );
};

export default PurchaseItemTable;
