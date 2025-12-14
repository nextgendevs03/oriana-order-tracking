import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  Select,
  Input,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Card,
  Progress,
  Tooltip,
  Drawer,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  FileProtectOutlined,
  TruckOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  CloseOutlined,
  DownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useGetPOsQuery } from "../store/api/poApi";
import type { ColumnsType } from "antd/es/table";
import { formatLabel } from "../utils";
import ColumnSettingsModal, {
  ColumnConfig,
} from "../Components/ColumnSettingsModal";
import { useDebounce } from "../hooks";

const { Title, Text } = Typography;

// Primary color matching the layout
const PRIMARY_COLOR = "#4b6cb7";
const PRIMARY_DARK = "#182848";

// Storage key for column preferences
const COLUMN_STORAGE_KEY = "summary-dashboard-columns";

// Column configuration for the settings modal
const allColumnConfigs: ColumnConfig[] = [
  { key: "poId", title: "PO ID", defaultVisible: true },
  { key: "date", title: "Date", defaultVisible: true },
  { key: "clientName", title: "Client Name", defaultVisible: true },
  { key: "osgPiNo", title: "OSG PI No", defaultVisible: true },
  { key: "poStatus", title: "PO Status", defaultVisible: true },
  { key: "paymentStatus", title: "Payment Status", defaultVisible: true },
  { key: "dispatchProgress", title: "Dispatch", defaultVisible: true },
  { key: "preCommissioning", title: "PreCommissioning", defaultVisible: true },
  { key: "commissioning", title: "Commissioning", defaultVisible: true },
  { key: "warranty", title: "Warranty", defaultVisible: true },
];

interface SummaryRecord {
  key: string;
  poId: string;
  date: string;
  clientName: string;
  osgPiNo: string;
  poStatus: string;
  paymentStatus: string;
  dispatchCompleted: number;
  dispatchTotal: number;
  preCommissioningCompleted: number;
  preCommissioningTotal: number;
  commissioningCompleted: number;
  commissioningTotal: number;
  warrantyCompleted: number;
  warrantyTotal: number;
}

// Gradient Stat Card Component with hover effect
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
}> = ({ title, value, icon, gradient, subtitle }) => (
  <div className="stat-card-wrapper">
    <Card
      style={{
        background: gradient,
        borderRadius: 14,
        border: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "default",
      }}
      styles={{ body: { padding: "18px 22px" } }}
      className="stat-card"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: "#fff",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
            }}
          >
            {title}
          </Text>
          <div
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.2,
              marginTop: 2,
            }}
          >
            {value}
          </div>
          {subtitle && (
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                display: "block",
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </div>
      </div>
    </Card>
  </div>
);

// Progress Cell Component for table
const ProgressCell: React.FC<{
  completed: number;
  total: number;
  color: string;
}> = ({ completed, total, color }) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total && total > 0;
  const hasData = total > 0;

  if (!hasData) {
    return <Text style={{ color: "#d9d9d9", fontSize: 12 }}>—</Text>;
  }

  return (
    <Tooltip title={`${completed} of ${total} completed`}>
      <div style={{ minWidth: 70 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isComplete ? "#52c41a" : "#595959",
            }}
          >
            {completed}/{total}
          </Text>
          {isComplete && (
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 11 }} />
          )}
        </div>
        <Progress
          percent={percent}
          size="small"
          showInfo={false}
          strokeColor={isComplete ? "#52c41a" : color}
          trailColor="#f0f0f0"
          style={{ marginBottom: 0 }}
        />
      </div>
    </Tooltip>
  );
};

// Status Tag Component
const StatusTag: React.FC<{ status: string; type: "po" | "payment" }> = ({
  status,
  type,
}) => {
  const getConfig = () => {
    if (type === "po") {
      switch (status) {
        case "closed":
          return { color: "#8c8c8c", bg: "#f5f5f5" };
        case "po_received":
          return { color: PRIMARY_COLOR, bg: "#e8f4fc" };
        case "in_progress":
          return { color: "#fa8c16", bg: "#fff7e6" };
        default:
          return { color: "#52c41a", bg: "#f6ffed" };
      }
    } else {
      switch (status) {
        case "paid":
          return { color: "#52c41a", bg: "#f6ffed" };
        case "partial":
          return { color: "#fa8c16", bg: "#fff7e6" };
        case "pending":
          return { color: "#ff4d4f", bg: "#fff1f0" };
        default:
          return { color: "#8c8c8c", bg: "#f5f5f5" };
      }
    }
  };

  const config = getConfig();

  return (
    <Tag
      style={{
        background: config.bg,
        color: config.color,
        border: "none",
        borderRadius: 4,
        padding: "2px 8px",
        fontWeight: 500,
        fontSize: 12,
      }}
    >
      {formatLabel(status)}
    </Tag>
  );
};

// Filter Item Component - Reusable for future filters
const FilterItem: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div style={{ minWidth: 180 }}>
    <Text
      style={{
        fontSize: 11,
        color: "#8c8c8c",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 6,
        display: "block",
      }}
    >
      {label}
    </Text>
    {children}
  </div>
);

const SummaryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [searchText, setSearchText] = useState<string>("");
  const [clientNameFilter, setClientNameFilter] = useState<string | undefined>(
    undefined
  );
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumnConfigs.map((col) => col.key)
  );

  // Debounce search inputs
  const debouncedSearchText = useDebounce(searchText, 500);

  // Redux state for dispatch and precommissioning details
  const dispatchDetails = useAppSelector((state) => state.po.dispatchDetails);
  const preCommissioningDetails = useAppSelector(
    (state) => state.po.preCommissioningDetails
  );

  // Fetch POs from API
  const { data: posData, isLoading, refetch } = useGetPOsQuery(
    {
      page: currentPage,
      limit: pageSize,
      clientName: clientNameFilter,
      poStatus: statusFilter === "closed" ? "closed" : undefined,
    },
    {
      refetchOnMountOrArgChange: 30,
    }
  );

  // Check authentication
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Handle column visibility change
  const handleVisibilityChange = useCallback((columns: string[]) => {
    setVisibleColumns(columns);
  }, []);

  // Get unique client names for filter dropdown
  const clientNameOptions = useMemo(() => {
    if (!posData?.items) return [];
    const uniqueNames = Array.from(
      new Set(posData.items.map((po) => po.clientName))
    );
    return uniqueNames.map((name) => ({ value: name, label: name }));
  }, [posData?.items]);

  // Transform and aggregate data
  const dataSource: SummaryRecord[] = useMemo(() => {
    if (!posData?.items) return [];

    return posData.items
      .filter((po) => {
        const isClosedPO = po.poStatus === "closed";
        if (statusFilter === "active" && isClosedPO) return false;
        if (statusFilter === "closed" && !isClosedPO) return false;

        if (debouncedSearchText) {
          const searchLower = debouncedSearchText.toLowerCase();
          const matchesSearch =
            po.id.toLowerCase().includes(searchLower) ||
            po.clientName.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        return true;
      })
      .map((po) => {
        const poDispatches = dispatchDetails.filter((d) => d.poId === po.id);
        const dispatchTotal = poDispatches.length;
        const dispatchCompleted = poDispatches.filter(
          (d) =>
            d.dispatchStatus === "completed" || d.deliveryStatus === "delivered"
        ).length;

        const poPreComm = preCommissioningDetails.filter(
          (pc) => pc.poId === po.id
        );
        const preCommTotal = poPreComm.length;
        const preCommCompleted = poPreComm.filter(
          (pc) => pc.preCommissioningStatus === "completed"
        ).length;

        const commTotal = poPreComm.length;
        const commCompleted = poPreComm.filter(
          (pc) => pc.commissioningStatus === "completed"
        ).length;

        const warrantyTotal = poPreComm.length;
        const warrantyCompleted = poPreComm.filter(
          (pc) => pc.warrantyStatus === "issued" || pc.warrantyCertificateNo
        ).length;

        return {
          key: po.id,
          poId: po.id,
          date: po.date,
          clientName: po.clientName,
          osgPiNo: String(po.osgPiNo),
          poStatus: po.poStatus,
          paymentStatus: po.paymentStatus,
          dispatchCompleted,
          dispatchTotal,
          preCommissioningCompleted: preCommCompleted,
          preCommissioningTotal: preCommTotal,
          commissioningCompleted: commCompleted,
          commissioningTotal: commTotal,
          warrantyCompleted,
          warrantyTotal,
        };
      });
  }, [
    posData?.items,
    statusFilter,
    debouncedSearchText,
    dispatchDetails,
    preCommissioningDetails,
  ]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = posData?.pagination?.total || dataSource.length;
    const completed = dataSource.filter((d) => d.poStatus === "closed").length;
    const inProgress = dataSource.filter(
      (d) =>
        d.dispatchCompleted > 0 ||
        d.preCommissioningCompleted > 0 ||
        d.commissioningCompleted > 0
    ).length;
    const pending = dataSource.length - completed - inProgress;

    return { total, completed, inProgress, pending };
  }, [dataSource, posData?.pagination?.total]);

  const handleView = (record: SummaryRecord) => {
    navigate(`/po-details/${record.poId}`);
  };

  const clearFilters = () => {
    setClientNameFilter(undefined);
    setSearchText("");
  };

  const hasActiveFilters = clientNameFilter || searchText;
  const activeFilterCount = [clientNameFilter, searchText].filter(Boolean).length;

  // Status dropdown items
  const statusItems = [
    {
      key: "active",
      label: (
        <Space>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#52c41a",
              display: "inline-block",
            }}
          />
          Active Orders
        </Space>
      ),
    },
    {
      key: "closed",
      label: (
        <Space>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#8c8c8c",
              display: "inline-block",
            }}
          />
          Closed Orders
        </Space>
      ),
    },
  ];

  // Define all columns
  const allColumns: ColumnsType<SummaryRecord> = [
    {
      title: "PO ID",
      dataIndex: "poId",
      key: "poId",
      fixed: "left",
      width: 130,
      render: (text: string) => (
        <Text strong style={{ color: PRIMARY_COLOR }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      width: 160,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text strong>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "OSG PI No",
      dataIndex: "osgPiNo",
      key: "osgPiNo",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "poStatus",
      key: "poStatus",
      width: 130,
      render: (status: string) => <StatusTag status={status} type="po" />,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 100,
      render: (status: string) => <StatusTag status={status} type="payment" />,
    },
    {
      title: "Dispatch",
      key: "dispatchProgress",
      width: 100,
      render: (_, record: SummaryRecord) => (
        <ProgressCell
          completed={record.dispatchCompleted}
          total={record.dispatchTotal}
          color={PRIMARY_COLOR}
        />
      ),
    },
    {
      title: "PreComm",
      key: "preCommissioning",
      width: 100,
      render: (_, record: SummaryRecord) => (
        <ProgressCell
          completed={record.preCommissioningCompleted}
          total={record.preCommissioningTotal}
          color="#722ed1"
        />
      ),
    },
    {
      title: "Comm",
      key: "commissioning",
      width: 100,
      render: (_, record: SummaryRecord) => (
        <ProgressCell
          completed={record.commissioningCompleted}
          total={record.commissioningTotal}
          color="#fa8c16"
        />
      ),
    },
    {
      title: "Warranty",
      key: "warranty",
      width: 100,
      render: (_, record: SummaryRecord) => (
        <ProgressCell
          completed={record.warrantyCompleted}
          total={record.warrantyTotal}
          color="#13c2c2"
        />
      ),
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          style={{ color: PRIMARY_COLOR }}
        />
      ),
    },
  ];

  const columns = useMemo(() => {
    return allColumns.filter((col) => {
      if (col.key === "action") return true;
      return visibleColumns.includes(col.key as string);
    });
  }, [allColumns, visibleColumns]);

  const handleTableChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              margin: 0,
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${PRIMARY_DARK})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            Summary Dashboard
          </Title>
          <Text style={{ color: "#8c8c8c", fontSize: 13 }}>
            Track all purchase orders at a glance
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            style={{ borderRadius: 8 }}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Stats Cards - Gradient with Hover */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Orders"
            value={stats.total}
            icon={<FileProtectOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            subtitle="All orders"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<SyncOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            subtitle="Processing"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<ClockCircleOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            subtitle="Awaiting action"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircleOutlined />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            subtitle="Closed"
          />
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid #f0f0f0",
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Status Dropdown & Search */}
          <Space wrap size={12}>
            {/* Status Dropdown */}
            <Dropdown
              menu={{
                items: statusItems,
                onClick: ({ key }) => setStatusFilter(key),
                selectable: true,
                selectedKeys: [statusFilter],
              }}
              trigger={["click"]}
            >
              <Button
                style={{
                  borderRadius: 8,
                  height: 38,
                  paddingLeft: 14,
                  paddingRight: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusFilter === "active" ? "#52c41a" : "#8c8c8c",
                  }}
                />
                {statusFilter === "active" ? "Active Orders" : "Closed Orders"}
                <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
              </Button>
            </Dropdown>

            {/* Search Bar */}
            <Input
              placeholder="Search orders..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{
                width: 260,
                borderRadius: 8,
                height: 38,
              }}
            />
          </Space>

          {/* Right: Filters & Columns */}
          <Space wrap size={8}>
            {/* Filter Button - Desktop shows inline filters */}
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerOpen(true)}
              style={{
                borderRadius: 8,
                height: 38,
                borderColor: hasActiveFilters ? PRIMARY_COLOR : undefined,
                color: hasActiveFilters ? PRIMARY_COLOR : undefined,
              }}
            >
              Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: PRIMARY_COLOR,
                    color: "#fff",
                    borderRadius: 10,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <ColumnSettingsModal
              columns={allColumnConfigs}
              storageKey={COLUMN_STORAGE_KEY}
              onVisibilityChange={handleVisibilityChange}
            />
          </Space>
        </div>

        {/* Table */}
        <Table<SummaryRecord>
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          scroll={{ x: 1100 }}
          size="middle"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: posData?.pagination?.total || dataSource.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => (
              <Text style={{ color: "#8c8c8c" }}>
                Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> orders
              </Text>
            ),
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
            position: ["bottomRight"],
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "48px 0", textAlign: "center" }}>
                <FileProtectOutlined
                  style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
                />
                <div>
                  <Text style={{ color: "#8c8c8c", fontSize: 15 }}>
                    No orders found
                  </Text>
                </div>
                {hasActiveFilters && (
                  <Button
                    type="link"
                    onClick={clearFilters}
                    style={{ marginTop: 8 }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ),
          }}
        />
      </Card>

      {/* Filter Drawer - Scalable for future filters */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FilterOutlined style={{ color: PRIMARY_COLOR }} />
            <span>Filters</span>
          </div>
        }
        placement="right"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={340}
        extra={
          hasActiveFilters && (
            <Button type="link" onClick={clearFilters} style={{ padding: 0 }}>
              Clear all
            </Button>
          )
        }
        styles={{
          body: { padding: "20px 24px" },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Client Filter */}
          <FilterItem label="Client Name">
            <Select
              placeholder="All Clients"
              value={clientNameFilter}
              onChange={setClientNameFilter}
              options={clientNameOptions}
              style={{ width: "100%" }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </FilterItem>

          {/* Add more filters here in the future */}
          {/* Example structure:
          <FilterItem label="Payment Status">
            <Select placeholder="All" style={{ width: "100%" }} />
          </FilterItem>
          
          <FilterItem label="Date Range">
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </FilterItem>
          */}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 24px",
            background: "#fff",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="primary"
            block
            onClick={() => setFilterDrawerOpen(false)}
            style={{
              height: 42,
              borderRadius: 8,
              background: PRIMARY_COLOR,
              fontWeight: 500,
            }}
          >
            Apply Filters
          </Button>
        </div>
      </Drawer>

      {/* Styles */}
      <style>{`
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18) !important;
        }
        
        .ant-table-thead > tr > th {
          background: #fafafa !important;
          font-weight: 600 !important;
          color: #595959 !important;
          font-size: 12px !important;
          padding: 14px 12px !important;
          border-bottom: 1px solid #f0f0f0 !important;
        }
        
        .ant-table-tbody > tr > td {
          padding: 14px 12px !important;
          border-bottom: 1px solid #f5f5f5 !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #fafbfc !important;
        }
        
        .ant-pagination {
          padding: 16px 20px !important;
          margin: 0 !important;
          background: #fafafa;
          border-top: 1px solid #f0f0f0;
        }
        
        .ant-select-selector {
          border-radius: 6px !important;
        }
        
        .ant-input-affix-wrapper {
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default SummaryDashboard;
