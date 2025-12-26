import { useState, useMemo, useEffect, type FC } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  AutoComplete,
  Spin,
  notification,
  message,
} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { colors, shadows } from "../styles/theme";
import FileUpload from "../Components/POManagement/FileUpload";
import POItemsTable from "../Components/POManagement/POItemsTable";
import AddClientModal from "../Components/POManagement/AddClientModal";
import { useGetCategoriesQuery } from "../store/api/categoryApi";
import { useGetOEMsQuery } from "../store/api/oemApi";
import { useGetClientsQuery } from "../store/api/clientApi";
import { useCreatePOMutation } from "../store/api/poApi";
import { CreatePORequest, POItemRequest } from "@OrianaTypes";
import { useDebounce } from "../hooks";
import {
  poStatusOptions,
  dispatchOptions,
  assignDispatchToOptions,
  oscSupportOptions,
  paymentStatusOptions,
  warrantyOptions,
  gstPercentOptions,
  textFieldRules,
  textFieldRulesWithMinLength,
  selectFieldRules,
  dateFieldRules,
} from "../utils";

// Interface for PO Item form values
interface POItemFormValues {
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

// Client option with both id and name
interface ClientOption {
  clientId: string;
  clientName: string;
}

const CreatePO: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState<string>("");
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
    null
  );

  // API mutation for creating PO
  const [createPO, { isLoading: isCreatingPO }] = useCreatePOMutation();

  // Debounce client search term with 500ms delay
  const debouncedClientSearchTerm = useDebounce(clientSearchTerm, 500);

  // Fetch categories and OEMs from API (with automatic retry on failure)
  const { data: categoriesResponse, isError: categoriesError } =
    useGetCategoriesQuery();
  const { data: oemsResponse, isError: oemsError } = useGetOEMsQuery();

  // Fetch clients based on debounced search term (min 3 characters, with automatic retry on failure)
  const shouldFetchClients = debouncedClientSearchTerm.length >= 3;
  const {
    data: clientsResponse,
    isError: clientsError,
    isLoading: isLoadingClients,
  } = useGetClientsQuery(
    { clientName: debouncedClientSearchTerm, isActive: true },
    { skip: !shouldFetchClients }
  );

  // Extract data arrays from responses
  const categoriesData = categoriesResponse?.data || [];
  const oemsData = oemsResponse?.data || [];
  const clientsData = clientsResponse?.data || [];

  // Show error toast after all retries have failed (RTK Query retries 3 times automatically)
  useEffect(() => {
    if (categoriesError) {
      notification.error({
        key: "categories-error",
        message: "Failed to load Categories",
        description:
          "Unable to fetch categories after multiple attempts. Please refresh the page.",
        duration: 0,
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (oemsError) {
      notification.error({
        key: "oems-error",
        message: "Failed to load OEMs",
        description:
          "Unable to fetch OEM list after multiple attempts. Please refresh the page.",
        duration: 0,
      });
    }
  }, [oemsError]);

  useEffect(() => {
    if (clientsError) {
      notification.error({
        key: "clients-error",
        message: "Failed to load Clients",
        description: "Unable to search clients. Please try again later.",
        duration: 5,
      });
    }
  }, [clientsError]);

  // Transform API data to dropdown options format
  // Filter only Active items and map to { value, label } format
  const categoryOptions = useMemo(() => {
    if (!categoriesData || categoriesError) return [];
    return categoriesData
      .filter((category) => category.isActive)
      .map((category) => ({
        value: category.categoryId,
        label: category.categoryName,
      }));
  }, [categoriesData, categoriesError]);

  const oemNameOptions = useMemo(() => {
    if (!oemsData || oemsError) return [];
    // The oemApi transformResponse adds isActive field
    // Check both isActive (from transform) and status (original boolean field)
    return oemsData
      .filter((oem) => oem.isActive)
      .map((oem) => ({
        value: oem.oemId,
        label: oem.name,
      }));
  }, [oemsData, oemsError]);

  // Transform clients data to AutoComplete options
  // Store clientId as value but display clientName
  const clientOptions = useMemo(() => {
    if (!clientsData || clientsError || !shouldFetchClients) return [];
    return clientsData.map((client) => ({
      value: client.clientName, // Display value in input
      label: client.clientName,
      clientId: client.clientId, // Store clientId for form submission
    }));
  }, [clientsData, clientsError, shouldFetchClients]);

  // Handle client selection from autocomplete
  const handleClientSelect = (value: string, option: any) => {
    // Store the selected client's ID
    setSelectedClient({
      clientId: option.clientId,
      clientName: value,
    });
    // Set the hidden clientId field
    form.setFieldValue("clientId", option.clientId);
  };

  // Handle successful client creation
  const handleClientCreated = (newClientName: string, newClientId?: string) => {
    // Set the newly created client name in the form
    form.setFieldValue("clientName", newClientName);
    if (newClientId) {
      form.setFieldValue("clientId", newClientId);
      setSelectedClient({ clientId: newClientId, clientName: newClientName });
    }
    setClientSearchTerm(newClientName);
  };

  const updateCalculatedFields = (index: number) => {
    const poItems = form.getFieldValue("poItems") || [];
    const item = poItems[index];
    if (item) {
      const quantity = item.quantity || 0;
      const spareQuantity = item.spareQuantity || 0;
      const pricePerUnit = item.pricePerUnit || 0;
      const gstPercent = item.gstPercent || 0;
      const totalQuantity = quantity + spareQuantity;
      const totalPrice = quantity * pricePerUnit;
      const gstAmount = (totalPrice * gstPercent) / 100;
      const finalPrice = totalPrice + gstAmount;

      const newItems = [...poItems];
      newItems[index] = {
        ...newItems[index],
        totalQuantity,
        totalPrice,
        finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      };
      form.setFieldsValue({ poItems: newItems });
    }
  };

  const onFinish = async (values: Record<string, unknown>) => {
    // Safety check: ensure client is selected
    if (!values.clientId || !selectedClient) {
      notification.error({
        message: "Client Required",
        description: "Please select a client from the dropdown list.",
      });
      return;
    }

    // Format dates to string (YYYY-MM-DD)
    const formatDate = (date: dayjs.Dayjs | undefined) => {
      return date ? dayjs(date).format("YYYY-MM-DD") : "";
    };

    // Build PO items array with proper types
    const poItems: POItemRequest[] = (values.poItems as POItemFormValues[]).map(
      (item) => ({
        categoryId: item.categoryId,
        oemId: item.oemId,
        productId: item.productId,
        quantity: item.quantity,
        spareQuantity: item.spareQuantity || 0,
        totalQuantity: item.totalQuantity,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.totalPrice,
        gstPercent: item.gstPercent,
        finalPrice: item.finalPrice,
        warranty: item.warranty,
      })
    );

    // Build the API request payload
    const createPORequest: CreatePORequest = {
      poReceivedDate: formatDate(values.poReceivedDate as dayjs.Dayjs),
      clientId: values.clientId as string,
      osgPiNo: values.osgPiNo as string,
      osgPiDate: formatDate(values.osgPiDate as dayjs.Dayjs),
      clientPoNo: values.clientPoNo as string,
      clientPoDate: formatDate(values.clientPoDate as dayjs.Dayjs),
      poStatus: values.poStatus as string,
      noOfDispatch: values.noOfDispatch as string,
      assignDispatchTo: values.assignDispatchTo as string | undefined,
      clientAddress: values.clientAddress as string,
      clientContact: values.clientContact as string,
      poItems,
      dispatchPlanDate: formatDate(values.dispatchPlanDate as dayjs.Dayjs),
      siteLocation: values.siteLocation as string,
      oscSupport: values.oscSupport as string,
      confirmDateOfDispatch: formatDate(
        values.confirmDateOfDispatch as dayjs.Dayjs
      ),
      paymentStatus: values.paymentStatus as string,
      remarks: (values.remarks as string) || undefined,
    };

    console.log("Creating PO with data:", createPORequest);

    try {
      // Call the API to create PO
      const result = await createPO(createPORequest).unwrap();

      message.success(`Purchase Order ${result.poId} created successfully!`);

      // Reset form and file list
      form.resetFields();
      setFileList([]);
      setSelectedClient(null);
      setClientSearchTerm("");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to create PO:", error);
      notification.error({
        message: "Failed to create Purchase Order",
        description:
          error?.data?.message ||
          error?.message ||
          "An error occurred. Please try again.",
        duration: 5,
      });
    }
  };

  // Validation for at least 1 PO item with min 1 quantity
  const poItemsValidator = async (_: unknown, value: POItemFormValues[]) => {
    if (!value || value.length === 0) {
      return Promise.reject(new Error("At least 1 PO item is required"));
    }
    const hasValidQuantity = value.some((item) => item?.quantity >= 1);
    if (!hasValidQuantity) {
      return Promise.reject(
        new Error("At least 1 PO item must have quantity >= 1")
      );
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        padding: "1rem",
        background: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Page Header - Vibrant & Modern */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
          borderRadius: 16,
          border: `1px solid ${colors.gray200}`,
          borderLeft: `4px solid ${colors.primary}`,
          boxShadow: shadows.card,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(67, 233, 123, 0.35)",
            }}
          >
            <span style={{ fontSize: 28, color: "#fff", fontWeight: 300 }}>
              +
            </span>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Create New Order
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "0.9rem",
                color: colors.gray500,
              }}
            >
              Fill in the details to create a new purchase order
            </p>
          </div>
        </div>
      </motion.div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ poItems: [] }}
      >
        {/* Hidden field for clientId - required for submission */}
        <Form.Item
          name="clientId"
          hidden
          rules={[
            { required: true, message: "Please select a client from the list" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Row 1: PO Received Date, Client Name */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="poReceivedDate"
              label="PO Received Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientName"
              label="Client Name"
              rules={textFieldRulesWithMinLength}
            >
              <Spin spinning={isLoadingClients && shouldFetchClients}>
                <AutoComplete
                  options={clientOptions}
                  onSearch={(value) => {
                    setClientSearchTerm(value);
                    // Clear clientId if user is typing (not selecting)
                    if (selectedClient?.clientName !== value) {
                      form.setFieldValue("clientId", undefined);
                      setSelectedClient(null);
                    }
                  }}
                  onSelect={handleClientSelect}
                  placeholder="Enter client name (min 3 characters)"
                  filterOption={false}
                  notFoundContent={
                    isLoadingClients && shouldFetchClients ? (
                      "Loading clients..."
                    ) : shouldFetchClients &&
                      clientsData.length === 0 &&
                      !clientsError ? (
                      <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => setIsAddClientModalOpen(true)}
                      >
                        + Add Client
                      </Button>
                    ) : shouldFetchClients ? (
                      "No clients found"
                    ) : (
                      "Type at least 3 characters to search"
                    )
                  }
                />
              </Spin>
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: OSG PI No, OSG PI Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="osgPiNo"
              label="OSG PI No"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter OSG PI number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="osgPiDate"
              label="OSG PI Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Client PO No, Client PO Date */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="clientPoNo"
              label="Client PO No"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter Client PO number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientPoDate"
              label="Client PO Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: PO Status, No of Dispatch */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="poStatus"
              label="PO Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select PO status"
                options={poStatusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="noOfDispatch"
              label="No of Dispatch"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select dispatch type"
                options={dispatchOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Assign Dispatch To */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="assignDispatchTo" label="Assign Dispatch To">
              <Select
                placeholder="Select person (optional)"
                options={assignDispatchToOptions}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 6: Client Address, Client Contact */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="clientAddress"
              label="Client Address"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter client address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="clientContact"
              label="Client Contact"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter client contact" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 7: Add Item Details Button & Table with validation */}
        <Form.Item
          name="poItems"
          rules={[{ validator: poItemsValidator }]}
          style={{ marginBottom: 0 }}
        >
          <Form.List name="poItems">
            {(fields, { add, remove }) => (
              <div style={{ marginBottom: "1.5rem" }}>
                <POItemsTable
                  fields={fields}
                  add={add}
                  remove={remove}
                  form={form}
                  categoryOptions={categoryOptions}
                  oemNameOptions={oemNameOptions}
                  warrantyOptions={warrantyOptions}
                  gstPercentOptions={gstPercentOptions}
                  onUpdateCalculatedFields={updateCalculatedFields}
                />
              </div>
            )}
          </Form.List>
        </Form.Item>

        {/* Row 7: Dispatch Plan Date, Site Location */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dispatchPlanDate"
              label="Dispatch Plan Date"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="siteLocation"
              label="Site Location"
              rules={textFieldRulesWithMinLength}
            >
              <Input placeholder="Enter site location" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 8: OSC Support, Confirm Date of Dispatch */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="oscSupport"
              label="OSC Support"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select OSC support"
                options={oscSupportOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmDateOfDispatch"
              label="Confirm Date of Dispatch"
              rules={dateFieldRules}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 9: Payment Status, Remarks */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="paymentStatus"
              label="Payment Status"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select payment status"
                options={paymentStatusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="remarks" label="Remarks" rules={textFieldRules}>
              <Input placeholder="Enter remarks" />
            </Form.Item>
          </Col>
        </Row>
        {/* Upload Documents */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Upload Documents (OSG PI, Client PO)"
              tooltip="Upload up to 2 documents. Supported formats: Images, PDF, Word, Excel"
            >
              <FileUpload
                fileList={fileList}
                onChange={setFileList}
                maxFiles={2}
                maxSizeMB={10}
                buttonLabel="Click to Upload"
                helperText="Supported: Images (JPG, PNG, GIF, SVG), PDF, Word, Excel."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button - Centered */}
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {() => {
            // Check if there are any form errors
            const hasErrors = form
              .getFieldsError()
              .some(({ errors }) => errors.length > 0);

            return (
              <Row justify="center" style={{ marginTop: "1.5rem" }}>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={isCreatingPO}
                    disabled={hasErrors}
                    style={{
                      backgroundColor: "#4b6cb7",
                      borderRadius: 8,
                      fontWeight: 600,
                      paddingLeft: "2rem",
                      paddingRight: "2rem",
                    }}
                  >
                    {isCreatingPO ? "Creating..." : "Create PO"}
                  </Button>
                </Col>
              </Row>
            );
          }}
        </Form.Item>
      </Form>

      {/* Add Client Modal */}
      <AddClientModal
        open={isAddClientModalOpen}
        onCancel={() => setIsAddClientModalOpen(false)}
        onSuccess={handleClientCreated}
        initialClientName={clientSearchTerm}
      />
    </div>
  );
};

export default CreatePO;
