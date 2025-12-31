import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  Button,
  Form,
  InputNumber,
  Select,
  Spin,
  notification,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  FormListFieldData,
  FormListOperation,
  FormInstance,
} from "antd/es/form";
import { useLazyGetFilteredProductsQuery } from "../../store/api/productApi";

interface ItemDetail {
  categoryId: number;
  oemId: number;
  productId: number;
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
  /** Whether to show pricing columns (pricePerUnit, totalPrice, gstPercent, finalPrice). Default: true */
  showPricing?: boolean;
  /** Whether the form is read-only (no add/edit/delete). Default: false */
  readOnly?: boolean;
}

// Track product options per row
interface RowProductState {
  options: DropdownOption[];
  isLoading: boolean;
  searchTerm: string;
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
  showPricing = true,
  readOnly = false,
}) => {
  // Track product options for each row by index
  const [rowProducts, setRowProducts] = useState<
    Record<number, RowProductState>
  >({});

  // Track search terms for each row (raw input)
  const [rowSearchTerms, setRowSearchTerms] = useState<Record<number, string>>(
    {}
  );

  // Lazy query for fetching filtered products
  const [fetchProducts] = useLazyGetFilteredProductsQuery();

  // Load products when category AND OEM are selected for a specific row
  const loadProductsForRow = useCallback(
    async (
      rowIndex: number,
      categoryId: number,
      oemId: number,
      searchTerm: string = ""
    ) => {
      if (!categoryId || !oemId) {
        // Clear products if either is not selected
        setRowProducts((prev) => ({
          ...prev,
          [rowIndex]: { options: [], isLoading: false, searchTerm: "" },
        }));
        return;
      }

      // Skip API call if searchTerm is provided but empty (only skip when user is searching)
      // Allow empty searchTerm for initial load when category/OEM is selected
      // This check ensures we don't make unnecessary API calls when user clears the search
      if (searchTerm !== "" && !searchTerm.trim()) {
        return;
      }

      // Set loading state
      setRowProducts((prev) => ({
        ...prev,
        [rowIndex]: {
          options: prev[rowIndex]?.options || [],
          isLoading: true,
          searchTerm: searchTerm || prev[rowIndex]?.searchTerm || "",
        },
      }));

      try {
        const params: any = {
          categoryId,
          oemId,
          isActive: true,
        };

        // Add search term if provided and not empty
        if (searchTerm && searchTerm.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        const result = await fetchProducts(params).unwrap();

        const options = result.map((product) => ({
          value: product.productId,
          label: product.productName,
        }));

        setRowProducts((prev) => ({
          ...prev,
          [rowIndex]: {
            options,
            isLoading: false,
            searchTerm: searchTerm || prev[rowIndex]?.searchTerm || "",
          },
        }));
      } catch (error) {
        console.error("Failed to fetch products for row", rowIndex, error);
        setRowProducts((prev) => ({
          ...prev,
          [rowIndex]: {
            options: [],
            isLoading: false,
            searchTerm: searchTerm || prev[rowIndex]?.searchTerm || "",
          },
        }));
        // Show notification after all retries have failed
        notification.error({
          key: `products-error-${rowIndex}`,
          message: "Failed to load Products",
          description:
            "Unable to fetch products after multiple attempts. Please try selecting category and OEM again.",
          duration: 5,
        });
      }
    },
    [fetchProducts]
  );

  // Handle category change for a row
  const handleCategoryChange = (rowIndex: number, categoryId: number) => {
    const poItems = form.getFieldValue("poItems") || [];
    const currentItem = poItems[rowIndex];
    const oemId = currentItem?.oemId;

    // Clear product selection when category changes
    const newItems = [...poItems];
    if (newItems[rowIndex]) {
      newItems[rowIndex] = { ...newItems[rowIndex], productId: undefined };
      form.setFieldsValue({ poItems: newItems });
    }

    // Load products if both category and OEM are selected (without search term for initial load)
    if (categoryId && oemId) {
      loadProductsForRow(rowIndex, categoryId, oemId, "");
    }
  };

  // Handle OEM change for a row
  const handleOEMChange = (rowIndex: number, oemId: number) => {
    const poItems = form.getFieldValue("poItems") || [];
    const currentItem = poItems[rowIndex];
    const categoryId = currentItem?.categoryId;

    // Clear product selection when OEM changes
    const newItems = [...poItems];
    if (newItems[rowIndex]) {
      newItems[rowIndex] = { ...newItems[rowIndex], productId: undefined };
      form.setFieldsValue({ poItems: newItems });
    }

    // Load products if both category and OEM are selected (without search term for initial load)
    if (categoryId && oemId) {
      loadProductsForRow(rowIndex, categoryId, oemId, "");
    }
  };

  // Handle product search for a row - just update the search term, debounce will trigger the API call
  const handleProductSearch = useCallback(
    (rowIndex: number, searchTerm: string) => {
      // Update search term for this row - the debounce effect will handle the API call
      setRowSearchTerms((prev) => ({
        ...prev,
        [rowIndex]: searchTerm,
      }));
    },
    []
  );

  // Track previous debounced search terms to avoid duplicate API calls
  const prevDebouncedSearchTermsRef = useRef<Record<number, string>>({});
  // Store timers in a ref so they persist across effect runs
  const timersRef = useRef<Record<number, NodeJS.Timeout>>({});

  // Debounce search terms and trigger API calls
  useEffect(() => {
    Object.keys(rowSearchTerms).forEach((key) => {
      const rowIndex = Number(key);
      const searchTerm = rowSearchTerms[rowIndex] || "";

      // Clear existing timer for this row if it exists
      if (timersRef.current[rowIndex]) {
        clearTimeout(timersRef.current[rowIndex]);
        delete timersRef.current[rowIndex];
      }

      // Set new timer for debouncing
      timersRef.current[rowIndex] = setTimeout(() => {
        const debouncedTerm = searchTerm.trim();
        const prevDebouncedTerm =
          prevDebouncedSearchTermsRef.current[rowIndex] || "";

        // Only make API call if:
        // 1. Debounced term is not empty
        // 2. Debounced term has changed from previous value
        if (debouncedTerm && debouncedTerm !== prevDebouncedTerm) {
          prevDebouncedSearchTermsRef.current[rowIndex] = debouncedTerm;

          const poItems = form.getFieldValue("poItems") || [];
          const currentItem = poItems[rowIndex];
          const categoryId = currentItem?.categoryId;
          const oemId = currentItem?.oemId;

          // Only load if both category and OEM are selected
          if (categoryId && oemId) {
            loadProductsForRow(rowIndex, categoryId, oemId, debouncedTerm);
          }
        } else if (!debouncedTerm && prevDebouncedTerm) {
          // Clear previous debounced term if search is cleared
          prevDebouncedSearchTermsRef.current[rowIndex] = "";
        }

        // Clean up timer reference after execution
        delete timersRef.current[rowIndex];
      }, 500);
    });

    // Cleanup function to clear all timers when component unmounts or dependencies change
    return () => {
      Object.values(timersRef.current).forEach((timer) => {
        if (timer) {
          clearTimeout(timer);
        }
      });
      timersRef.current = {};
    };
  }, [rowSearchTerms, form, loadProductsForRow]);

  // Clean up row products and search terms when rows are removed
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
    setRowSearchTerms((prev) => {
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
  ): ColumnsType<ItemDetail & { name: number }> => {
    const baseColumns: ColumnsType<ItemDetail & { name: number }> = [
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
        const rowIndex = record.name;
        const rowState = rowProducts[rowIndex];
        const productOptions = rowState?.options || [];
        const isLoading = rowState?.isLoading || false;

        // Check if category and OEM are selected
        const poItems = form.getFieldValue("poItems") || [];
        const currentItem = poItems[rowIndex];
        const categoryId = currentItem?.categoryId;
        const oemId = currentItem?.oemId;
        const hasCategoryAndOEM = !!(categoryId && oemId);

        return (
          <Form.Item
            name={[record.name, "productId"]}
            rules={[{ required: true, message: "Required" }]}
            style={{ margin: 0 }}
          >
            <Select
              showSearch
              placeholder={
                isLoading
                  ? "Loading..."
                  : hasCategoryAndOEM
                    ? "Select or search product"
                    : "Select Category & OEM first"
              }
              options={productOptions}
              loading={isLoading}
              disabled={!hasCategoryAndOEM}
              filterOption={false}
              onSearch={(value) => handleProductSearch(rowIndex, value)}
              notFoundContent={
                isLoading ? (
                  <Spin size="small" />
                ) : !hasCategoryAndOEM ? (
                  "Select Category & OEM first"
                ) : productOptions.length === 0 ? (
                  "No products found"
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
  ];

  // Pricing columns - only shown if showPricing is true
  const pricingColumns: ColumnsType<ItemDetail & { name: number }> = [
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
            disabled={readOnly}
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
            disabled={readOnly}
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
  ];

  // Warranty column
  const warrantyColumn: ColumnsType<ItemDetail & { name: number }> = [
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
          <Select placeholder="Select" options={warrantyOptions} disabled={readOnly} />
        </Form.Item>
      ),
    },
  ];

  // Delete column - only shown if not readOnly
  const deleteColumn: ColumnsType<ItemDetail & { name: number }> = readOnly
    ? []
    : [
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

  // Combine columns based on showPricing flag
  return [
    ...baseColumns,
    ...(showPricing ? pricingColumns : []),
    ...warrantyColumn,
    ...deleteColumn,
  ];
};

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
      {!readOnly && (
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
      )}

      {fields.length > 0 && (
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
