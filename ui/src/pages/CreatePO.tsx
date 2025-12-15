import { useState, useMemo, useEffect, type FC } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  InputNumber,
  Typography,
  AutoComplete,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { addPO, POData, PODocument } from "../store/poSlice";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import FileUpload from "../Components/POManagement/FileUpload";
import POItemsTable from "../Components/POManagement/POItemsTable";
import AddClientModal from "../Components/POManagement/AddClientModal";
import { useGetCategoriesQuery } from "../store/api/categoryApi";
import { useGetOEMsQuery } from "../store/api/oemApi";
import { useGetClientsQuery } from "../store/api/clientApi";
import { useDebounce } from "../hooks";
import {
  poStatusOptions,
  dispatchOptions,
  assignDispatchToOptions,
  oscSupportOptions,
  paymentStatusOptions,
  productOptions,
  warrantyOptions,
  gstPercentOptions,
  textFieldRules,
  textFieldRulesWithMinLength,
  numberFieldRules,
  selectFieldRules,
  dateFieldRules,
} from "../utils";

const { Title } = Typography;

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

const CreatePO: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState<string>("");
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // Debounce client search term with 500ms delay
  const debouncedClientSearchTerm = useDebounce(clientSearchTerm, 500);

  // Fetch categories and OEMs from API
  const { data: categoriesData = [], error: categoriesError } =
    useGetCategoriesQuery();
  const { data: oemsData = [], error: oemsError } = useGetOEMsQuery();

  // Fetch clients based on debounced search term (min 3 characters)
  const shouldFetchClients = debouncedClientSearchTerm.length >= 3;
  const {
    data: clientsData = [],
    error: clientsError,
    refetch: refetchClients,
    isLoading: isLoadingClients,
  } = useGetClientsQuery(
    { clientName: debouncedClientSearchTerm, isActive: true },
    { skip: !shouldFetchClients }
  );

  // Log errors for debugging
  useEffect(() => {
    if (categoriesError) {
      console.error("Failed to fetch categories:", categoriesError);
    }
  }, [categoriesError]);

  useEffect(() => {
    if (oemsError) {
      console.error("Failed to fetch OEMs:", oemsError);
    }
  }, [oemsError]);

  useEffect(() => {
    if (clientsError) {
      console.error("Failed to fetch clients:", clientsError);
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
  const clientOptions = useMemo(() => {
    if (!clientsData || clientsError || !shouldFetchClients) return [];
    return clientsData.map((client) => ({
      value: client.clientName,
      label: client.clientName,
    }));
  }, [clientsData, clientsError, shouldFetchClients]);

  // Handle successful client creation
  const handleClientCreated = (newClientName: string) => {
    // Set the newly created client name in the form
    form.setFieldValue("clientName", newClientName);
    setClientSearchTerm(newClientName);
    // Refetch clients to include the new client
    refetchClients();
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

  const onFinish = (values: Record<string, unknown>) => {
    // Generate unique PO ID
    const poId = `OSG-${Date.now().toString().slice(-6)}`;

    // Format dates to string
    const formatDate = (date: dayjs.Dayjs | undefined) => {
      return date ? dayjs(date).format("YYYY-MM-DD") : "";
    };

    // Map uploaded files to PODocument format
    const uploadedDocuments: PODocument[] = fileList.map((file) => ({
      uid: file.uid,
      name: file.name,
      type: file.type || "unknown",
      size: file.size || 0,
      url: file.thumbUrl || URL.createObjectURL(file.originFileObj as Blob),
      uploadedAt: new Date().toISOString(),
    }));

    const poData: POData = {
      id: poId,
      date: formatDate(values.date as dayjs.Dayjs),
      clientName: values.clientName as string,
      osgPiNo: values.osgPiNo as number,
      osgPiDate: formatDate(values.osgPiDate as dayjs.Dayjs),
      clientPoNo: values.clientPoNo as number,
      clientPoDate: formatDate(values.clientPoDate as dayjs.Dayjs),
      poStatus: values.poStatus as string,
      noOfDispatch: values.noOfDispatch as string,
      assignDispatchTo: values.assignDispatchTo as number,
      clientAddress: values.clientAddress as string,
      clientContact: values.clientContact as string,
      poItems: values.poItems as POData["poItems"],
      dispatchPlanDate: formatDate(values.dispatchPlanDate as dayjs.Dayjs),
      siteLocation: values.siteLocation as string,
      oscSupport: values.oscSupport as string,
      confirmDateOfDispatch: formatDate(
        values.confirmDateOfDispatch as dayjs.Dayjs
      ),
      paymentStatus: values.paymentStatus as string,
      remarks: values.remarks as string,
      createdAt: new Date().toISOString(),
      uploadedDocuments:
        uploadedDocuments.length > 0 ? uploadedDocuments : undefined,
    };

    console.log("Form Data:", poData);

    // Dispatch to Redux store
    dispatch(addPO(poData));

    // Reset form and file list
    form.resetFields();
    setFileList([]);

    // Navigate to dashboard
    navigate("/dashboard");
  };

  // Validation for at least 1 PO item with min 1 quantity
  const poItemsValidator = async (_: unknown, value: ItemDetail[]) => {
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
      <Title level={3} style={{ marginBottom: "1.5rem" }}>
        Order Punching
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ poItems: [] }}
      >
        {/* Row 1: Date, Client Name */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="date" label="Date" rules={dateFieldRules}>
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
                  onSearch={(value) => setClientSearchTerm(value)}
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
              rules={numberFieldRules}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="Enter OSG PI number"
              />
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
              rules={numberFieldRules}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="Enter Client PO number"
              />
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
            <Form.Item
              name="assignDispatchTo"
              label="Assign Dispatch To"
              rules={selectFieldRules}
            >
              <Select
                placeholder="Select person"
                options={assignDispatchToOptions}
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
                  categoryOptions={categoryOptions}
                  oemNameOptions={oemNameOptions}
                  productOptions={productOptions}
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

        {/* Submit Button - Centered with disabled state based on form validity */}
        <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
          {() => (
            <Row justify="center" style={{ marginTop: "1.5rem" }}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                  style={{
                    backgroundColor: "#4b6cb7",
                    borderRadius: 8,
                    fontWeight: 600,
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  }}
                >
                  Create PO
                </Button>
              </Col>
            </Row>
          )}
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
