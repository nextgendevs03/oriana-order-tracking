import { useState, useEffect, useCallback } from "react";
import { Table, Button, Form, InputNumber, Select, Spin, notification } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FormListFieldData, FormListOperation, FormInstance } from "antd/es/form";
import { useLazyGetFilteredProductsQuery } from "../../store/api/productApi";

interface ItemDetail {
  categoryId: string;
  oemId: string;
  productId: string;
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
  form: FormInstance;
  categoryOptions: DropdownOption[];
  oemNameOptions: DropdownOption[];
  warrantyOptions: DropdownOption[];
  gstPercentOptions: DropdownOption[];
  onUpdateCalculatedFields: (index: number) => void;
}

// Track product options per row
interface RowProductState {
  options: DropdownOption[];
  isLoading: boolean;
}

const POItemsTable: React.FC<POItemsTableProps> = ({
  fields,
  add,
  remove,
  form,
  categoryOptions,
  oemNameOptions,
  warrantyOptions,
  gstPercentOptions,
  onUpdateCalculatedFields,
}) => {
  // Track product options for each row by index
  const [rowProducts, setRowProducts] = useState<Record<number, RowProductState>>({});

  // Lazy query for fetching filtered products
  const [fetchProducts] = useLazyGetFilteredProductsQuery();

  // Load products when category AND OEM are selected for a specific row
  const loadProductsForRow = useCallback(
    async (rowIndex: number, categoryId: string, oemId: string) => {
      if (!categoryId || !oemId) {
        // Clear products if either is not selected
        setRowProducts((prev) => ({
          ...prev,
          [rowIndex]: { options: [], isLoading: false },
        }));
        return;
      }

      // Set loading state
      setRowProducts((prev) => ({
        ...prev,
        [rowIndex]: { options: prev[rowIndex]?.options || [], isLoading: true },
      }));

      try {
        const result = await fetchProducts({
          categoryId,
          oemId,
          isActive: true,
        }).unwrap();

        const options = result.map((product) => ({
          value: product.productId,
          label: product.productName,
        }));

        setRowProducts((prev) => ({
          ...prev,
          [rowIndex]: { options, isLoading: false },
        }));
      } catch (error) {
        console.error("Failed to fetch products for row", rowIndex, error);
        setRowProducts((prev) => ({
          ...prev,
          [rowIndex]: { options: [], isLoading: false },
        }));
        // Show notification after all retries have failed
        notification.error({
          key: `products-error-${rowIndex}`,
          message: "Failed to load Products",
          description: "Unable to fetch products after multiple attempts. Please try selecting category and OEM again.",
          duration: 5,
        });
      }
    },
    [fetchProducts]
  );

  // Handle category change for a row
  const handleCategoryChange = (rowIndex: number, categoryId: string) => {
    const poItems = form.getFieldValue("poItems") || [];
    const currentItem = poItems[rowIndex];
    const oemId = currentItem?.oemId;

    // Clear product selection when category changes
    const newItems = [...poItems];
    if (newItems[rowIndex]) {
      newItems[rowIndex] = { ...newItems[rowIndex], productId: undefined };
      form.setFieldsValue({ poItems: newItems });
    }

    // Load products if both category and OEM are selected
    loadProductsForRow(rowIndex, categoryId, oemId);
  };

  // Handle OEM change for a row
  const handleOEMChange = (rowIndex: number, oemId: string) => {
    const poItems = form.getFieldValue("poItems") || [];
    const currentItem = poItems[rowIndex];
    const categoryId = currentItem?.categoryId;

    // Clear product selection when OEM changes
    const newItems = [...poItems];
    if (newItems[rowIndex]) {
      newItems[rowIndex] = { ...newItems[rowIndex], productId: undefined };
      form.setFieldsValue({ poItems: newItems });
    }

    // Load products if both category and OEM are selected
    loadProductsForRow(rowIndex, categoryId, oemId);
  };

  // Clean up row products when rows are removed
  useEffect(() => {
    const currentRowIndices = new Set(fields.map((f) => f.name));
    setRowProducts((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (!currentRowIndices.has(Number(key))) {
          delete updated[Number(key)];
        }
      });
      return updated;
    });
  }, [fields]);

  const getItemColumns = (
    removeFn: (index: number | number[]) => void
  ): ColumnsType<ItemDetail & { name: number }> => [
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "categoryId"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select"
            options={categoryOptions}
            onChange={(value) => handleCategoryChange(record.name, value)}
          />
        </Form.Item>
      ),
    },
    {
      title: "OEM Name",
      dataIndex: "oemId",
      key: "oemId",
      width: 130,
      render: (_, record) => (
        <Form.Item
          name={[record.name, "oemId"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select"
            options={oemNameOptions}
            onChange={(value) => handleOEMChange(record.name, value)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Product",
      dataIndex: "productId",
      key: "productId",
      width: 150,
      render: (_, record) => {
        const rowState = rowProducts[record.name];
        const productOptions = rowState?.options || [];
        const isLoading = rowState?.isLoading || false;

        return (
          <Form.Item
            name={[record.name, "productId"]}
            rules={[{ required: true, message: "Required" }]}
            style={{ margin: 0 }}
          >
            <Select
              placeholder={isLoading ? "Loading..." : "Select Category & OEM first"}
              options={productOptions}
              loading={isLoading}
              disabled={productOptions.length === 0 && !isLoading}
              notFoundContent={
                isLoading ? (
                  <Spin size="small" />
                ) : productOptions.length === 0 ? (
                  "Select Category & OEM first"
                ) : (
                  "No products found"
                )
              }
            />
          </Form.Item>
        );
      },
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
      categoryId: undefined,
      oemId: undefined,
      productId: undefined,
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
