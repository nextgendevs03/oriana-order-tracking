import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Card,
  Alert,
  Input,
  Select,
  Row,
  Col,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useGetPOsQuery } from "../store/api/poApi";
import type { POResponse } from "../store/api/poApi";
import type { ColumnsType } from "antd/es/table";
import {
  getPaymentStatusColor,
  getPoStatusColor,
  formatLabel,
  poStatusOptions,
} from "../utils";
import { colors, shadows } from "../styles/theme";
import { useDebounce } from "../hooks/useDebounce";
import { usePermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";

interface PORecord {
  key: string;
  poOrderId: string;
  date: string;
  clientName: string;
  osgPiNo: string;
  osgPoNo: string;
  paymentStatus: string;
  poStatus: string;
}

type SearchFieldType = "poId" | "osgPiNo" | "clientPoNo" | "poStatus" | "";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState<SearchFieldType>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPoStatus, setSelectedPoStatus] = useState<string | undefined>(
    undefined
  );

  // Permission checks
  const canCreatePO = usePermission(PERMISSIONS.PO_CREATE);

  // Debounce search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Build API query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
    };

    // If searchField is "poStatus" and selectedPoStatus is set, use searchKey/searchTerm
    if (searchField === "poStatus" && selectedPoStatus) {
      params.searchKey = "poStatus";
      params.searchTerm = selectedPoStatus;
    }
    // If searchField is set and searchTerm is provided, use searchKey/searchTerm
    else if (searchField && debouncedSearchTerm) {
      params.searchKey = searchField;
      params.searchTerm = debouncedSearchTerm;
    }
    // If no search is active but poStatus filter is set, use poStatus filter
    else if (!searchField && selectedPoStatus) {
      params.poStatus = selectedPoStatus;
    }

    return params;
  }, [
    currentPage,
    pageSize,
    searchField,
    debouncedSearchTerm,
    selectedPoStatus,
  ]);

  // Fetch POs from API with search/filter parameters
  const {
    data: poListResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPOsQuery(queryParams);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Map API response to Dashboard format (no client-side filtering needed)
  const dataSource: PORecord[] = useMemo(() => {
    if (!poListResponse?.data) return [];

    return poListResponse.data.map(
      (po: POResponse): PORecord => ({
        key: po.poId,
        poOrderId: po.poId,
        date: po.poReceivedDate,
        clientName: po.clientName || "-",
        osgPiNo: po.osgPiNo,
        osgPoNo: po.clientPoNo,
        paymentStatus: po.paymentStatus,
        poStatus: po.poStatus,
      })
    );
  }, [poListResponse]);

  const handleView = (record: PORecord) => {
    navigate(`/po-details/${record.poOrderId}`);
  };

  const handleCreatePO = () => {
    navigate("/create-po");
  };

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchField, debouncedSearchTerm, selectedPoStatus]);

  const handleSearchFieldChange = (value: SearchFieldType) => {
    setSearchField(value);
    setSearchTerm(""); // Clear search term when field changes
    setSelectedPoStatus(undefined); // Clear status when switching fields
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePoStatusSearchChange = (value: string | undefined) => {
    setSelectedPoStatus(value);
  };

  // Search field options
  const searchFieldOptions = [
    { value: "poId", label: "OSG Order ID" },
    { value: "piNo", label: "OSG PI No" },
    { value: "clientPoNo", label: "Client PO No" },
    { value: "poStatus", label: "PO Status" },
  ];

  // PO Status options for dropdown (including closed)
  const poStatusDropdownOptions = [
    ...poStatusOptions,
    { value: "closed", label: "Closed" },
  ];

  const clientNameFilters = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(dataSource.map((item) => item.clientName))
    );
    return uniqueNames.map((name) => ({ text: name, value: name }));
  }, [dataSource]);

  const poStatusFilters = [
    { text: "PO Received", value: "po_received" },
    { text: "PO Confirmed on Phone", value: "po_confirmed_phone" },
    { text: "On Call", value: "on_call" },
    { text: "On Mail", value: "on_mail" },
    { text: "Closed", value: "closed" },
  ];

  const columns: ColumnsType<PORecord> = [
    {
      title: "OSG Order ID",
      dataIndex: "poOrderId",
      key: "poOrderId",
      fixed: "left",
      width: 120,
      render: (text) => (
        <span style={{ fontWeight: 500, color: colors.gray800 }}>{text}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      width: 180,
      filters: clientNameFilters,
      filterSearch: true,
      onFilter: (value, record) => record.clientName.includes(value as string),
    },
    {
      title: "OSG PI No",
      dataIndex: "osgPiNo",
      key: "osgPiNo",
      width: 140,
    },
    {
      title: "Client PO No",
      dataIndex: "osgPoNo",
      key: "clientPoNo",
      width: 140,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 140,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>{formatLabel(status)}</Tag>
      ),
    },
    {
      title: "PO Status",
      dataIndex: "poStatus",
      key: "poStatus",
      width: 150,
      filters: poStatusFilters,
      filterSearch: true,
      onFilter: (value, record) => record.poStatus === value,
      render: (status: string) => (
        <Tag color={getPoStatusColor(status)}>{formatLabel(status)}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          style={{
            color: colors.primary,
            borderRadius: 6,
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100%" }}>
      {/* Page Header - Vibrant & Modern */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: 16,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
            borderLeft: `4px solid ${colors.accent}`,
            background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
          }}
          bodyStyle={{
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
              }}
            >
              <FileTextOutlined style={{ fontSize: 26, color: "#fff" }} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                Order Punch Dashboard
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.9rem",
                  color: colors.gray500,
                }}
              >
                Track and manage all purchase orders
              </p>
            </div>
          </div>
          {canCreatePO ? (
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreatePO}
                style={{
                  background: colors.primary,
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 44,
                  padding: "0 24px",
                  boxShadow: "0 4px 16px rgba(113, 162, 65, 0.35)",
                }}
              >
                Create Order
              </Button>
            </motion.div>
          ) : (
            <Tooltip title="You don't have permission to create POs">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                disabled
                style={{
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 44,
                  padding: "0 24px",
                }}
              >
                Create Order
              </Button>
            </Tooltip>
          )}
        </Card>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            marginBottom: 16,
            borderRadius: 12,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
          }}
          bodyStyle={{ padding: "16px 20px" }}
        >
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  placeholder="Select field to search"
                  value={searchField || undefined}
                  onChange={handleSearchFieldChange}
                  allowClear
                  style={{ width: 200 }}
                  options={searchFieldOptions}
                />
                {searchField === "poStatus" ? (
                  <Select
                    placeholder="Select PO Status"
                    value={selectedPoStatus}
                    onChange={handlePoStatusSearchChange}
                    allowClear
                    style={{ flex: 1 }}
                    options={poStatusDropdownOptions}
                  />
                ) : searchField ? (
                  <Input
                    placeholder={`Search by ${searchFieldOptions.find((opt) => opt.value === searchField)?.label || searchField}`}
                    value={searchTerm}
                    onChange={(e) => handleSearchTermChange(e.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ flex: 1 }}
                  />
                ) : null}
              </Space.Compact>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* PO Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: shadows.card,
            border: `1px solid ${colors.gray200}`,
          }}
          bodyStyle={{ padding: 0 }}
        >
          {isError && (
            <Alert
              message="Error loading purchase orders"
              description={
                error && typeof error === "object" && "data" in error
                  ? (error.data as any)?.message || "An error occurred"
                  : "Failed to load purchase orders. Please try again."
              }
              type="error"
              showIcon
              closable
              onClose={() => refetch()}
              style={{ margin: 16 }}
              action={
                <Button size="small" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          )}
          <Table<PORecord>
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1200 }}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: poListResponse?.pagination?.total || 0, // Use API pagination total
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              style: { padding: "12px 16px", margin: 0 },
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              onShowSizeChange: (current, size) => {
                setCurrentPage(1);
                setPageSize(size);
              },
            }}
            locale={{
              emptyText: (
                <div style={{ padding: "48px 0", textAlign: "center" }}>
                  <FileTextOutlined
                    style={{
                      fontSize: 48,
                      color: colors.gray300,
                      marginBottom: 12,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      color: colors.gray500,
                      fontSize: 14,
                    }}
                  >
                    No purchase orders yet
                  </p>
                </div>
              ),
            }}
            style={{
              borderRadius: 12,
              overflow: "hidden",
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
