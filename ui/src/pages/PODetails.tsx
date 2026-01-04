import { useState, useMemo } from "react";
import {
  Collapse,
  Typography,
  Descriptions,
  Tag,
  Table,
  Empty,
  Button,
  Popconfirm,
  Space,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { usePermission, useAnyPermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";
import { colors, shadows } from "../styles/theme";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectAuth } from "../store/authSlice";
import { useGetPOByIdQuery } from "../store/api/poApi";
import {
  useGetDispatchesByPoIdQuery,
  useDeleteDispatchMutation,
  useUpdateDispatchDocumentsMutation,
} from "../store/api/dispatchApi";
import {
  deletePreCommissioning,
  updatePO,
} from "../store/poSlice";
import type { ColumnsType } from "antd/es/table";
import type {
  POItem,
  POData,
  PreCommissioning,
} from "../store/poSlice";
import type { DispatchResponse } from "@OrianaTypes";
import DispatchFormModal from "../Components/POManagement/DispatchFormModal";
import DispatchDocumentFormModal from "../Components/POManagement/DispatchDocumentFormModal";
import DeliveryConfirmationFormModal from "../Components/POManagement/DeliveryConfirmationFormModal";
import PreCommissioningFormModal from "../Components/POManagement/PreCommissioningFormModal";
import CommissioningFormModal from "../Components/POManagement/CommissioningFormModal";
import WarrantyCertificateFormModal from "../Components/POManagement/WarrantyCertificateFormModal";
import DispatchDetailsModal, {
  DispatchDetailsTab,
} from "../Components/POManagement/DispatchDetailsModal";
import ServiceDetailsModal, {
  ServiceDetailsTab,
} from "../Components/POManagement/ServiceDetailsModal";
import UpdateAssignDispatchToModal from "../Components/POManagement/UpdateAssignDispatchToModal";
import {
  selectPreCommissioningDetails,
} from "../store/poSelectors";
import {
  getPaymentStatusColor,
  getPoStatusColor,
  getAccordionStatusColor,
  formatLabel,
} from "../utils";

const { Title } = Typography;
const { Panel } = Collapse;

const PODetails: React.FC = () => {
  const { poId } = useParams<{ poId: string }>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectAuth);

  // Fetch PO from API using poId from route params
  const {
    data: poResponse,
    isLoading: isPOLoading,
    isError: isPOError,
    error: poError,
  } = useGetPOByIdQuery(poId || "", {
    skip: !poId, // Skip if poId is not available
  });

  // Check if current user is assigned to this PO
  const isAssignedToCurrentUser = useMemo(() => {
    return (
      currentUser.userId !== null &&
      currentUser.userId !== undefined &&
      poResponse?.assignDispatchTo !== null &&
      poResponse?.assignDispatchTo !== undefined &&
      currentUser.userId === poResponse.assignDispatchTo
    );
  }, [currentUser.userId, poResponse?.assignDispatchTo]);

  // Permission checks - only allowed if user has permission AND is assigned to this PO
  const canCreateDispatch =
    usePermission(PERMISSIONS.DISPATCH_CREATE) && isAssignedToCurrentUser;
  const canUpdateDispatch =
    usePermission(PERMISSIONS.DISPATCH_UPDATE) && isAssignedToCurrentUser;
  const canDeleteDispatch =
    usePermission(PERMISSIONS.DISPATCH_DELETE) && isAssignedToCurrentUser;
  const canCreateCommissioning =
    usePermission(PERMISSIONS.COMMISSIONING_CREATE) && isAssignedToCurrentUser;
  const canUpdateCommissioning =
    usePermission(PERMISSIONS.COMMISSIONING_UPDATE) && isAssignedToCurrentUser;
  const canDeleteCommissioning =
    usePermission(PERMISSIONS.COMMISSIONING_DELETE) && isAssignedToCurrentUser;
  const canViewPricingOwn = usePermission(PERMISSIONS.PO_PRICING_VIEW_OWN);
  const canViewPricingAll = usePermission(PERMISSIONS.PO_PRICING_VIEW_ALL);
  const canViewPricing = useAnyPermission([
    PERMISSIONS.PO_PRICING_VIEW_OWN,
    PERMISSIONS.PO_PRICING_VIEW_ALL,
  ]);
  const canUpdatePO = usePermission(PERMISSIONS.PRODUCT_UPDATE);

  const [isDispatchModalVisible, setIsDispatchModalVisible] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState<DispatchResponse | null>(
    null
  );
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DispatchResponse | null>(
    null
  );
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<DispatchResponse | null>(
    null
  );
  const [isPreCommissioningModalVisible, setIsPreCommissioningModalVisible] =
    useState(false);
  const [editingPreCommissioning, setEditingPreCommissioning] =
    useState<PreCommissioning | null>(null);
  const [isCommissioningModalVisible, setIsCommissioningModalVisible] =
    useState(false);
  const [editingCommissioning, setEditingCommissioning] =
    useState<PreCommissioning | null>(null);
  const [isWarrantyModalVisible, setIsWarrantyModalVisible] = useState(false);
  const [editingWarranty, setEditingWarranty] =
    useState<PreCommissioning | null>(null);
  // Unified Dispatch Details View Modal
  const [isDispatchDetailsModalVisible, setIsDispatchDetailsModalVisible] =
    useState(false);
  const [viewingDispatchDetails, setViewingDispatchDetails] =
    useState<DispatchResponse | null>(null);
  const [dispatchDetailsTab, setDispatchDetailsTab] =
    useState<DispatchDetailsTab>("dispatch");
  // Unified Service Details View Modal
  const [isServiceDetailsModalVisible, setIsServiceDetailsModalVisible] =
    useState(false);
  const [viewingServiceDetails, setViewingServiceDetails] =
    useState<PreCommissioning | null>(null);
  const [serviceDetailsTab, setServiceDetailsTab] =
    useState<ServiceDetailsTab>("precommissioning");
  // Update Assign Dispatch To Modal
  const [
    isUpdateAssignDispatchToModalVisible,
    setIsUpdateAssignDispatchToModalVisible,
  ] = useState(false);

  // Fetch dispatches from API
  const {
    data: currentPODispatches = [],
    isLoading: isDispatchLoading,
    isError: isDispatchError,
  } = useGetDispatchesByPoIdQuery(poId || "", {
    skip: !poId,
  });

  // Delete dispatch mutation
  const [deleteDispatch] = useDeleteDispatchMutation();
  const [updateDispatchDocuments] = useUpdateDispatchDocumentsMutation();

  const preCommissioningDetails = useAppSelector(selectPreCommissioningDetails);

  console.log(poResponse);
  // Map API response to POData format expected by the component
  const selectedPO: POData | null = useMemo(() => {
    if (!poResponse) return null;

    return {
      id: poResponse.poId,
      date: poResponse.poReceivedDate,
      clientName: poResponse.clientName || "",
      osgPiNo: poResponse.osgPiNo,
      osgPiDate: poResponse.osgPiDate,
      clientPoNo: poResponse.clientPoNo,
      clientPoDate: poResponse.clientPoDate,
      poStatus: poResponse.poStatus,
      noOfDispatch: poResponse.noOfDispatch,
      assignDispatchTo: 0, // Not used in this component anymore
      assignedUserName: poResponse.assignedUserName,
      clientAddress: poResponse.clientAddress,
      clientContact: poResponse.clientContact,
      clientGST: poResponse.clientGST,
      poItems: poResponse.poItems.map(
        (item): POItem => ({
          category: item.categoryName || "",
          oemName: item.oemName || "",
          product: item.productName || "",
          quantity: item.quantity,
          spareQuantity: item.spareQuantity,
          totalQuantity: item.totalQuantity,
          pricePerUnit: item.pricePerUnit,
          totalPrice: item.totalPrice,
          gstPercent: item.gstPercent,
          finalPrice: item.finalPrice,
          warranty: item.warranty,
        })
      ),
      dispatchPlanDate: poResponse.dispatchPlanDate,
      siteLocation: poResponse.siteLocation,
      oscSupport: poResponse.oscSupport,
      confirmDateOfDispatch: poResponse.confirmDateOfDispatch,
      paymentStatus: poResponse.paymentStatus,
      remarks: poResponse.remarks || "",
      createdAt: poResponse.createdAt,
    };
  }, [poResponse]);

  const handleEditDispatch = (record: DispatchResponse) => {
    setEditingDispatch(record);
    setIsDispatchModalVisible(true);
  };

  const handleDeleteDispatch = async (dispatchId: number) => {
    if (!poId) return;
    try {
      await deleteDispatch({ id: dispatchId, poId }).unwrap();
    } catch (error) {
      console.error("Failed to delete dispatch:", error);
    }
  };

  // Delete document details - clears document related fields from dispatch
  const handleDeleteDocumentDetails = async (dispatchId: number) => {
    try {
      // Clear all document fields by updating with empty values
      await updateDispatchDocuments({
        id: dispatchId,
        data: {
          noDuesClearance: undefined,
          docOsgPiNo: undefined,
          docOsgPiDate: undefined,
          taxInvoiceNumber: undefined,
          invoiceDate: undefined,
          ewayBill: undefined,
          deliveryChallan: undefined,
          dispatchDate: undefined,
          packagingList: undefined,
          dispatchFromLocation: undefined,
          dispatchStatus: undefined,
          dispatchLrNo: undefined,
          dispatchRemarks: undefined,
          serialNumbers: {},
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to clear document details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsDispatchModalVisible(false);
    setEditingDispatch(null);
  };

  const handleAddDispatch = () => {
    setEditingDispatch(null);
    setIsDispatchModalVisible(true);
  };

  // Unified view handler for dispatch details modal
  const handleViewDispatchDetails = (
    record: DispatchResponse,
    tab: DispatchDetailsTab
  ) => {
    setViewingDispatchDetails(record);
    setDispatchDetailsTab(tab);
    setIsDispatchDetailsModalVisible(true);
  };

  const handleCloseDispatchDetailsModal = () => {
    setIsDispatchDetailsModalVisible(false);
    setViewingDispatchDetails(null);
  };

  // Unified view handler for service details modal
  const handleViewServiceDetails = (
    record: PreCommissioning,
    tab: ServiceDetailsTab
  ) => {
    setViewingServiceDetails(record);
    setServiceDetailsTab(tab);
    setIsServiceDetailsModalVisible(true);
  };

  const handleCloseServiceDetailsModal = () => {
    setIsServiceDetailsModalVisible(false);
    setViewingServiceDetails(null);
  };

  // Document modal handlers
  const handleAddDocument = () => {
    setEditingDocument(null);
    setIsDocumentModalVisible(true);
  };

  const handleEditDocument = (record: DispatchResponse) => {
    setEditingDocument(record);
    setIsDocumentModalVisible(true);
  };

  const handleCloseDocumentModal = () => {
    setIsDocumentModalVisible(false);
    setEditingDocument(null);
  };

  // Get dispatches with documents for the table (check if dispatchStatus exists)
  const dispatchesWithDocuments = useMemo(() => {
    return currentPODispatches.filter((d) => !!d.dispatchStatus);
  }, [currentPODispatches]);

  // Get dispatches eligible for delivery confirmation (dispatchStatus === "done")
  const dispatchesForDeliveryConfirmation = useMemo(() => {
    return currentPODispatches.filter((d) => d.dispatchStatus === "done");
  }, [currentPODispatches]);

  // Get dispatches with delivery confirmation for the table (check if deliveryStatus exists)
  const dispatchesWithDeliveryConfirmation = useMemo(() => {
    return currentPODispatches.filter((d) => !!d.deliveryStatus);
  }, [currentPODispatches]);

  // Delivery confirmation modal handlers
  const handleAddDeliveryConfirmation = () => {
    setEditingDelivery(null);
    setIsDeliveryModalVisible(true);
  };

  const handleEditDeliveryConfirmation = (record: DispatchResponse) => {
    setEditingDelivery(record);
    setIsDeliveryModalVisible(true);
  };

  const handleCloseDeliveryModal = () => {
    setIsDeliveryModalVisible(false);
    setEditingDelivery(null);
  };

  // Get dispatches eligible for pre-commissioning (deliveryStatus === "done")
  const dispatchesForPreCommissioning = useMemo(() => {
    return currentPODispatches.filter((d) => d.deliveryStatus === "done");
  }, [currentPODispatches]);

  // Get pre-commissioning entries for current PO
  const currentPOPreCommissioning = useMemo(() => {
    return preCommissioningDetails.filter((pc) => pc.poId === poId);
  }, [preCommissioningDetails, poId]);

  // Pre-commissioning modal handlers
  const handleAddPreCommissioning = () => {
    setEditingPreCommissioning(null);
    setIsPreCommissioningModalVisible(true);
  };

  const handleEditPreCommissioning = (record: PreCommissioning) => {
    setEditingPreCommissioning(record);
    setIsPreCommissioningModalVisible(true);
  };

  const handleDeletePreCommissioning = (pcId: string) => {
    dispatch(deletePreCommissioning(pcId));
  };

  const handleClosePreCommissioningModal = () => {
    setIsPreCommissioningModalVisible(false);
    setEditingPreCommissioning(null);
  };

  // Get pre-commissioning entries with "Done" preCommissioningStatus for commissioning
  const preCommissioningForCommissioning = useMemo(() => {
    return preCommissioningDetails.filter(
      (pc) => pc.poId === poId && pc.preCommissioningStatus === "Done"
    );
  }, [preCommissioningDetails, poId]);

  // Get commissioned entries (those with commissioningStatus)
  const commissionedEntries = useMemo(() => {
    return preCommissioningDetails.filter(
      (pc) => pc.poId === poId && pc.commissioningStatus
    );
  }, [preCommissioningDetails, poId]);

  // Commissioning modal handlers
  const handleAddCommissioning = () => {
    setEditingCommissioning(null);
    setIsCommissioningModalVisible(true);
  };

  const handleEditCommissioning = (record: PreCommissioning) => {
    setEditingCommissioning(record);
    setIsCommissioningModalVisible(true);
  };

  const handleCloseCommissioningModal = () => {
    setIsCommissioningModalVisible(false);
    setEditingCommissioning(null);
  };

  // Get records with commissioningStatus === "Done" for warranty
  const commissioningForWarranty = useMemo(() => {
    return preCommissioningDetails.filter(
      (pc) => pc.poId === poId && pc.commissioningStatus === "Done"
    );
  }, [preCommissioningDetails, poId]);

  // Get warranty entries (those with warrantyStatus)
  const warrantyEntries = useMemo(() => {
    return preCommissioningDetails.filter(
      (pc) => pc.poId === poId && pc.warrantyStatus
    );
  }, [preCommissioningDetails, poId]);

  // ============= ACCORDION STATUS COMPUTED FROM API DATA =============

  type AccordionStatus = "Not Started" | "In-Progress" | "Done";

  // Dispatch Status Info - computed from API data
  const dispatchStatusInfo = useMemo(() => {
    if (!selectedPO) return { status: "Not Started" as AccordionStatus, totalQty: 0, dispatchedQty: 0 };

    const totalQty = selectedPO.poItems.reduce((sum, item) => sum + item.quantity, 0);
    const dispatchedQty = currentPODispatches.reduce((sum, d) => {
      return sum + d.dispatchedItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    if (currentPODispatches.length === 0) {
      return { status: "Not Started" as AccordionStatus, totalQty, dispatchedQty };
    } else if (dispatchedQty >= totalQty) {
      return { status: "Done" as AccordionStatus, totalQty, dispatchedQty };
    } else {
      return { status: "In-Progress" as AccordionStatus, totalQty, dispatchedQty };
    }
  }, [selectedPO, currentPODispatches]);

  // Document Status
  const documentStatus = useMemo((): AccordionStatus => {
    if (currentPODispatches.length === 0) return "Not Started";
    const withDocuments = currentPODispatches.filter((d) => !!d.dispatchStatus);
    if (withDocuments.length === 0) return "Not Started";
    const withDoneStatus = currentPODispatches.filter((d) => d.dispatchStatus === "done");
    if (dispatchStatusInfo.status === "Done" && withDoneStatus.length >= currentPODispatches.length) {
      return "Done";
    }
    return "In-Progress";
  }, [currentPODispatches, dispatchStatusInfo.status]);

  // Delivery Confirmation Status
  const deliveryConfirmationStatus = useMemo((): AccordionStatus => {
    const forConfirmation = currentPODispatches.filter((d) => d.dispatchStatus === "done");
    const withConfirmation = currentPODispatches.filter((d) => !!d.deliveryStatus);
    if (forConfirmation.length === 0) return "Not Started";
    if (withConfirmation.length === 0) return "Not Started";
    if (withConfirmation.length >= forConfirmation.length) return "Done";
    return "In-Progress";
  }, [currentPODispatches]);

  // Pre-Commissioning Status
  const preCommissioningAccordionStatus = useMemo((): AccordionStatus => {
    const dispatchesWithDeliveryDone = currentPODispatches.filter((d) => d.deliveryStatus === "done");
    let totalSerials = 0;
    dispatchesWithDeliveryDone.forEach((d) => {
      d.dispatchedItems.forEach((item) => {
        if (item.serialNumbers) {
          const serials = item.serialNumbers.split(",").map((s) => s.trim()).filter((s) => s !== "");
          totalSerials += serials.length;
        }
      });
    });
    if (totalSerials === 0) return "Not Started";
    if (currentPOPreCommissioning.length === 0) return "Not Started";
    if (currentPOPreCommissioning.length >= totalSerials) return "Done";
    return "In-Progress";
  }, [currentPODispatches, currentPOPreCommissioning]);

  // Commissioning Status
  const commissioningAccordionStatus = useMemo((): AccordionStatus => {
    const forCommissioning = preCommissioningDetails.filter(
      (pc) => pc.poId === poId && pc.preCommissioningStatus === "Done"
    );
    const commissioned = commissionedEntries;
    if (forCommissioning.length === 0) return "Not Started";
    if (commissioned.length === 0) return "Not Started";
    if (commissioned.length >= forCommissioning.length) return "Done";
    return "In-Progress";
  }, [preCommissioningDetails, poId, commissionedEntries]);

  // Warranty Status
  const warrantyAccordionStatus = useMemo((): AccordionStatus => {
    const forWarranty = preCommissioningDetails.filter(
      (pc) => pc.poId === poId && pc.commissioningStatus === "Done"
    );
    if (forWarranty.length === 0) return "Not Started";
    if (warrantyEntries.length === 0) return "Not Started";
    if (warrantyEntries.length >= forWarranty.length) return "Done";
    return "In-Progress";
  }, [preCommissioningDetails, poId, warrantyEntries]);

  // Check if all accordions are in "Done" state
  const allAccordionsDone = useMemo(() => {
    return (
      dispatchStatusInfo.status === "Done" &&
      documentStatus === "Done" &&
      deliveryConfirmationStatus === "Done" &&
      preCommissioningAccordionStatus === "Done" &&
      commissioningAccordionStatus === "Done" &&
      warrantyAccordionStatus === "Done"
    );
  }, [
    dispatchStatusInfo.status,
    documentStatus,
    deliveryConfirmationStatus,
    preCommissioningAccordionStatus,
    commissioningAccordionStatus,
    warrantyAccordionStatus,
  ]);

  // Check if PO is already closed
  const isPOClosed = selectedPO?.poStatus === "closed";

  // Handle Close PO
  const handleClosePO = () => {
    if (selectedPO && allAccordionsDone) {
      const updatedPO = {
        ...selectedPO,
        poStatus: "closed",
      };
      dispatch(updatePO(updatedPO));
    }
  };

  // Helper function to render accordion header with status
  const renderAccordionHeader = (title: string, status: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span>{title}</span>
      <Tag
        color={getAccordionStatusColor(status)}
        style={{ marginLeft: "auto", marginRight: "16px" }}
      >
        {status}
      </Tag>
    </div>
  );

  // Warranty modal handlers
  const handleAddWarranty = () => {
    setEditingWarranty(null);
    setIsWarrantyModalVisible(true);
  };

  const handleEditWarranty = (record: PreCommissioning) => {
    setEditingWarranty(record);
    setIsWarrantyModalVisible(true);
  };

  const handleCloseWarrantyModal = () => {
    setIsWarrantyModalVisible(false);
    setEditingWarranty(null);
  };

  const itemColumns: ColumnsType<POItem> = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "OEM Name",
      dataIndex: "oemName",
      key: "oemName",
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (value) => formatLabel(value || ""),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Spare Qty",
      dataIndex: "spareQuantity",
      key: "spareQuantity",
    },
    {
      title: "Total Qty",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Price/Unit",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      title: "GST %",
      dataIndex: "gstPercent",
      key: "gstPercent",
      render: (value) => (value ? `${value}%` : "-"),
    },
    {
      title: "Final Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
      render: (value) => (value ? `₹${value?.toLocaleString()}` : "-"),
    },
    {
      title: "Warranty",
      dataIndex: "warranty",
      key: "warranty",
      render: (value) => formatLabel(value || ""),
    },
  ];

  const dispatchColumns: ColumnsType<DispatchResponse> = [
    {
      title: "Dispatch ID",
      dataIndex: "dispatchId",
      key: "dispatchId",
      width: 130,
      fixed: "left",
      render: (value: number) => <Tag color="blue">#{value}</Tag>,
    },
    {
      title: "Dispatched Date",
      dataIndex: "confirmDispatchDate",
      key: "confirmDispatchDate",
      width: 130,
      fixed: "left",
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      width: 180,
    },
    {
      title: "Dispatched Items",
      dataIndex: "dispatchedItems",
      key: "dispatchedItems",
      width: 250,
      render: (items: DispatchResponse["dispatchedItems"]) =>
        items?.map((item, index) => (
          <div key={index}>
            <Tag color="blue">
              {formatLabel(item.productName || "")}: {item.quantity}
            </Tag>
          </div>
        )) || "-",
    },
    {
      title: "Contact",
      dataIndex: "deliveryContact",
      key: "deliveryContact",
      width: 150,
      fixed: "left",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        // Disable edit if dispatch status is "done" or no permission
        const isDispatchDone = record.dispatchStatus === "done";
        const isEditDisabled = isDispatchDone || !canUpdateDispatch;
        const editDisabledReason = !canUpdateDispatch
          ? "You don't have permission to edit dispatches"
          : isDispatchDone
            ? "Editing disabled - Dispatch status is Done"
            : "Edit";
        // Disable delete if dispatch status is "done" OR delivery status exists OR no permission
        const hasDeliveryStatus = !!record.deliveryStatus;
        const isDeleteDisabled =
          isDispatchDone || hasDeliveryStatus || !canDeleteDispatch;
        const deleteDisabledReason = !canDeleteDispatch
          ? "You don't have permission to delete dispatches"
          : hasDeliveryStatus
            ? "Delete disabled - Delivery confirmation exists"
            : isDispatchDone
              ? "Delete disabled - Dispatch status is Done"
              : "Delete";
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDispatchDetails(record, "dispatch")}
              style={{ padding: 0, color: "#1890ff" }}
              title="View Details"
            />
            <Tooltip title={editDisabledReason}>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditDispatch(record)}
                style={{ padding: 0 }}
                disabled={isEditDisabled}
              />
            </Tooltip>
            <Popconfirm
              title="Delete Dispatch"
              description="Are you sure you want to delete this dispatch? This will remove all dispatch details data."
              onConfirm={() => handleDeleteDispatch(record.dispatchId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
              disabled={isDeleteDisabled}
            >
              <Tooltip title={deleteDisabledReason}>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ padding: 0 }}
                  disabled={isDeleteDisabled}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Dispatch Document table columns (flat properties)
  const documentColumns: ColumnsType<DispatchResponse> = [
    {
      title: "Dispatch ID",
      dataIndex: "dispatchId",
      key: "dispatchId",
      width: 130,
      fixed: "left",
      render: (value: number) => <Tag color="blue">#{value}</Tag>,
    },
    {
      title: "Dispatched Items",
      dataIndex: "dispatchedItems",
      key: "dispatchedItems",
      width: 180,
      fixed: "left",
      render: (items: DispatchResponse["dispatchedItems"]) =>
        items?.map((item, index) => (
          <div key={index}>
            <Tag color="geekblue">
              {formatLabel(item.productName || "")}: {item.quantity}
            </Tag>
          </div>
        )) || "-",
    },
    {
      title: "No Due Clearance",
      dataIndex: "noDuesClearance",
      key: "noDuesClearance",
      width: 140,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          pending: "orange",
          approved: "green",
          rejected: "red",
          on_hold: "blue",
        };
        return (
          <Tag color={colorMap[value] || "default"}>
            {formatLabel(value || "")}
          </Tag>
        );
      },
    },
    {
      title: "Tax Invoice No",
      dataIndex: "taxInvoiceNumber",
      key: "taxInvoiceNumber",
      width: 140,
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: 120,
    },
    {
      title: "E-way Bill",
      dataIndex: "ewayBill",
      key: "ewayBill",
      width: 130,
    },
    {
      title: "Delivery Challan",
      dataIndex: "deliveryChallan",
      key: "deliveryChallan",
      width: 140,
    },
    {
      title: "Dispatch Date",
      dataIndex: "dispatchDate",
      key: "dispatchDate",
      width: 120,
    },
    {
      title: "Dispatch Status",
      dataIndex: "dispatchStatus",
      key: "dispatchStatus",
      width: 130,
      fixed: "right",
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          done: "green",
          pending: "orange",
          hold: "blue",
          cancelled: "red",
        };
        return (
          <Tag color={colorMap[value] || "default"}>
            {formatLabel(value || "")}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        const isDeliveryDone = record.deliveryStatus === "done";
        const hasDeliveryConfirmation = !!record.deliveryStatus;
        const isEditDisabled = isDeliveryDone || !canUpdateDispatch;
        const editDisabledReason = !canUpdateDispatch
          ? "You don't have permission to edit documents"
          : isDeliveryDone
            ? "Editing disabled - Delivery is done"
            : "Edit";
        const isDeleteDisabled = hasDeliveryConfirmation || !canDeleteDispatch;
        const deleteDisabledReason = !canDeleteDispatch
          ? "You don't have permission to delete documents"
          : hasDeliveryConfirmation
            ? "Delete disabled - Delivery confirmation exists"
            : "Delete";
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDispatchDetails(record, "documents")}
              style={{ padding: 0, color: "#1890ff" }}
              title="View Details"
            />
            <Tooltip title={editDisabledReason}>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditDocument(record)}
                style={{ padding: 0 }}
                disabled={isEditDisabled}
              />
            </Tooltip>
            <Popconfirm
              title="Delete Document Details"
              description="Are you sure you want to delete this document details? This will remove all document data."
              onConfirm={() => handleDeleteDocumentDetails(record.dispatchId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
              disabled={isDeleteDisabled}
            >
              <Tooltip title={deleteDisabledReason}>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ padding: 0 }}
                  disabled={isDeleteDisabled}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Delivery Confirmation table columns (flat properties)
  const deliveryConfirmationColumns: ColumnsType<DispatchResponse> = [
    {
      title: "Dispatch ID",
      dataIndex: "dispatchId",
      key: "dispatchId",
      width: 150,
      fixed: "left",
      render: (value: number) => <Tag color="blue">#{value}</Tag>,
    },
    {
      title: "Dispatched Items",
      dataIndex: "dispatchedItems",
      key: "dispatchedItems",
      width: 200,
      render: (items: DispatchResponse["dispatchedItems"]) =>
        items?.map((item, index) => (
          <div key={index}>
            <Tag color="blue">
              {formatLabel(item.productName || "")}: {item.quantity}
            </Tag>
          </div>
        )) || "-",
    },
    {
      title: "Date of Delivery",
      dataIndex: "dateOfDelivery",
      key: "dateOfDelivery",
      width: 140,
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      width: 140,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          done: "green",
          pending: "orange",
          hold: "blue",
          cancelled: "red",
        };
        return (
          <Tag color={colorMap[value] || "default"}>
            {formatLabel(value || "")}
          </Tag>
        );
      },
    },
    {
      title: "Proof of Delivery",
      dataIndex: "proofOfDelivery",
      key: "proofOfDelivery",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Updated At",
      dataIndex: "deliveryUpdatedAt",
      key: "deliveryUpdatedAt",
      width: 180,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDispatchDetails(record, "delivery")}
            style={{ padding: 0, color: "#1890ff" }}
            title="View Details"
          />
          <Tooltip
            title={
              canUpdateDispatch
                ? "Edit"
                : "You don't have permission to edit delivery"
            }
          >
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditDeliveryConfirmation(record)}
              style={{ padding: 0 }}
              disabled={!canUpdateDispatch}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Pre-Commissioning table columns
  const preCommissioningColumns: ColumnsType<PreCommissioning> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      fixed: "left",
    },
    {
      title: "Dispatch ID",
      dataIndex: "dispatchId",
      key: "dispatchId",
      width: 130,
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 140,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 120,
      render: (value: string) => formatLabel(value || ""),
    },
    {
      title: "PC Contact",
      dataIndex: "pcContact",
      key: "pcContact",
      width: 140,
    },
    {
      title: "Service Engineer",
      dataIndex: "serviceEngineerAssigned",
      key: "serviceEngineerAssigned",
      width: 150,
    },
    {
      title: "PPM/Checklist",
      dataIndex: "ppmChecklist",
      key: "ppmChecklist",
      width: 130,
      ellipsis: true,
    },
    {
      title: "PPM Confirmation",
      dataIndex: "ppmConfirmationStatus",
      key: "ppmConfirmationStatus",
      width: 140,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          pending: "orange",
          confirmed: "green",
          rejected: "red",
          in_progress: "blue",
        };
        return (
          <Tag color={colorMap[value] || "default"}>
            {formatLabel(value || "")}
          </Tag>
        );
      },
    },
    {
      title: "Pre-comm. Status",
      dataIndex: "preCommissioningStatus",
      key: "preCommissioningStatus",
      width: 140,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          Done: "green",
          Pending: "orange",
          Hold: "blue",
          Cancelled: "red",
        };
        return <Tag color={colorMap[value] || "default"}>{value || "-"}</Tag>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewServiceDetails(record, "precommissioning")}
            style={{ padding: 0, color: "#1890ff" }}
            title="View Details"
          />
          <Tooltip
            title={
              canUpdateCommissioning
                ? "Edit"
                : "You don't have permission to edit pre-commissioning"
            }
          >
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditPreCommissioning(record)}
              style={{ padding: 0 }}
              disabled={!canUpdateCommissioning}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Pre-Commissioning"
            description="Are you sure you want to delete this entry?"
            onConfirm={() => handleDeletePreCommissioning(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            disabled={!canDeleteCommissioning}
          >
            <Tooltip
              title={
                canDeleteCommissioning
                  ? "Delete"
                  : "You don't have permission to delete pre-commissioning"
              }
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                style={{ padding: 0 }}
                disabled={!canDeleteCommissioning}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Commissioning table columns
  const commissioningColumns: ColumnsType<PreCommissioning> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      fixed: "left",
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 140,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 120,
      render: (value: string) => formatLabel(value || ""),
    },
    {
      title: "ECD from Client",
      dataIndex: "commissioningEcdFromClient",
      key: "commissioningEcdFromClient",
      width: 150,
    },
    {
      title: "Service Ticket No",
      dataIndex: "commissioningServiceTicketNo",
      key: "commissioningServiceTicketNo",
      width: 150,
    },
    {
      title: "CCD from Client",
      dataIndex: "commissioningCcdFromClient",
      key: "commissioningCcdFromClient",
      width: 150,
    },
    {
      title: "Issues",
      dataIndex: "commissioningIssues",
      key: "commissioningIssues",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Solution",
      dataIndex: "commissioningSolution",
      key: "commissioningSolution",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Info Generated",
      dataIndex: "commissioningInfoGenerated",
      key: "commissioningInfoGenerated",
      width: 140,
    },
    {
      title: "Comm. Date",
      dataIndex: "commissioningDate",
      key: "commissioningDate",
      width: 120,
    },
    {
      title: "Comm. Status",
      dataIndex: "commissioningStatus",
      key: "commissioningStatus",
      width: 130,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          Done: "green",
          Pending: "orange",
          Hold: "blue",
          Cancelled: "red",
        };
        return <Tag color={colorMap[value] || "default"}>{value || "-"}</Tag>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "commissioningRemarks",
      key: "commissioningRemarks",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewServiceDetails(record, "commissioning")}
            style={{ padding: 0, color: "#1890ff" }}
            title="View Details"
          />
          <Tooltip
            title={
              canUpdateCommissioning
                ? "Edit"
                : "You don't have permission to edit commissioning"
            }
          >
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditCommissioning(record)}
              style={{ padding: 0 }}
              disabled={!canUpdateCommissioning}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Warranty Certificate table columns
  const warrantyColumns: ColumnsType<PreCommissioning> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      fixed: "left",
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 140,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 120,
      render: (value: string) => formatLabel(value || ""),
    },
    {
      title: "Certificate No",
      dataIndex: "warrantyCertificateNo",
      key: "warrantyCertificateNo",
      width: 150,
    },
    {
      title: "Issue Date",
      dataIndex: "warrantyIssueDate",
      key: "warrantyIssueDate",
      width: 120,
    },
    {
      title: "Start Date",
      dataIndex: "warrantyStartDate",
      key: "warrantyStartDate",
      width: 120,
    },
    {
      title: "End Date",
      dataIndex: "warrantyEndDate",
      key: "warrantyEndDate",
      width: 120,
    },
    {
      title: "Warranty Status",
      dataIndex: "warrantyStatus",
      key: "warrantyStatus",
      width: 130,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          Done: "green",
          Pending: "orange",
          Hold: "blue",
          Cancelled: "red",
        };
        return <Tag color={colorMap[value] || "default"}>{value || "-"}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewServiceDetails(record, "warranty")}
            style={{ padding: 0, color: "#1890ff" }}
            title="View Details"
          />
          <Tooltip
            title={
              canUpdateCommissioning
                ? "Edit"
                : "You don't have permission to edit warranty"
            }
          >
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditWarranty(record)}
              style={{ padding: 0 }}
              disabled={!canUpdateCommissioning}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Show loading state
  if (isPOLoading) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading PO details..." />
      </div>
    );
  }

  // Show error state
  if (isPOError) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert
          message="Error loading PO details"
          description={
            poError && typeof poError === "object" && "data" in poError
              ? (poError.data as any)?.message || "Failed to load PO details"
              : "Failed to load PO details. Please try again."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Show empty state if PO not found
  if (!selectedPO) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          minHeight: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="PO not found. Please select a valid PO from the dashboard." />
      </div>
    );
  }

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
          borderLeft: `4px solid ${colors.accent}`,
          boxShadow: shadows.card,
          padding: "24px 28px",
          marginBottom: 24,
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                Order Tracking
              </h2>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {selectedPO.id}
              </span>
              <Tag
                color={isPOClosed ? "error" : "success"}
                style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  fontWeight: 500,
                  borderRadius: 6,
                  border: "none",
                }}
              >
                {isPOClosed ? "Closed" : "Active"}
              </Tag>
            </div>
            <p
              style={{
                margin: "6px 0 0 0",
                fontSize: "0.9rem",
                color: colors.gray500,
              }}
            >
              View and manage order details, dispatches & commissioning
            </p>
          </div>
        </div>
        <Popconfirm
          title="Close PO"
          description="Are you sure you want to close this PO? This action cannot be undone."
          onConfirm={handleClosePO}
          okText="Yes, Close PO"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          disabled={!allAccordionsDone || isPOClosed}
        >
          <Button
            type="primary"
            danger
            icon={<LockOutlined />}
            disabled={!allAccordionsDone || isPOClosed}
            style={{
              borderRadius: 8,
              fontWeight: 500,
              height: 40,
              padding: "0 20px",
            }}
            title={
              isPOClosed
                ? "PO is already closed"
                : !allAccordionsDone
                  ? "Complete all sections before closing PO"
                  : "Close this PO"
            }
          >
            {isPOClosed ? "PO Closed" : "Close PO"}
          </Button>
        </Popconfirm>
      </motion.div>

      <Collapse defaultActiveKey={["1"]} accordion={false}>
        {/* PO Information Accordion */}
        <Panel header="PO Information" key="1">
          <Descriptions
            bordered
            column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
            size="small"
            labelStyle={{ fontWeight: 600, backgroundColor: "#fafafa" }}
          >
            <Descriptions.Item label="OSG Order ID">
              <Tag color="blue">{selectedPO.id}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {selectedPO.date}
            </Descriptions.Item>
            <Descriptions.Item label="Client Name">
              {selectedPO.clientName}
            </Descriptions.Item>
            <Descriptions.Item label="OSG PI No">
              {selectedPO.osgPiNo}
            </Descriptions.Item>
            <Descriptions.Item label="OSG PI Date">
              {selectedPO.osgPiDate}
            </Descriptions.Item>
            <Descriptions.Item label="Client PO No">
              {selectedPO.clientPoNo}
            </Descriptions.Item>
            <Descriptions.Item label="Client PO Date">
              {selectedPO.clientPoDate}
            </Descriptions.Item>
            <Descriptions.Item label="PO Status">
              <Tag color={getPoStatusColor(selectedPO.poStatus)}>
                {formatLabel(selectedPO.poStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="No of Dispatch">
              <Tag color="cyan">{formatLabel(selectedPO.noOfDispatch)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Client Address" span={2}>
              {selectedPO.clientAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Client Contact">
              {selectedPO.clientContact}
            </Descriptions.Item>
            <Descriptions.Item label="Client GST No.">
              {selectedPO.clientGST || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Assign Dispatch To">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{selectedPO.assignedUserName || "Not Assigned"}</span>
                {canUpdatePO ? (
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() =>
                      setIsUpdateAssignDispatchToModalVisible(true)
                    }
                    style={{ padding: 0, height: "auto" }}
                  >
                    Update
                  </Button>
                ) : (
                  <Tooltip title="You don't have permission to update PO">
                    <Button
                      type="link"
                      size="small"
                      icon={<EditOutlined />}
                      disabled
                      style={{ padding: 0, height: "auto" }}
                    >
                      Update
                    </Button>
                  </Tooltip>
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Site Location">
              {selectedPO.siteLocation}
            </Descriptions.Item>
            <Descriptions.Item label="OSC Support">
              <Tag color={selectedPO.oscSupport === "yes" ? "green" : "orange"}>
                {formatLabel(selectedPO.oscSupport)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag color={getPaymentStatusColor(selectedPO.paymentStatus)}>
                {formatLabel(selectedPO.paymentStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Dispatch Plan Date">
              {selectedPO.dispatchPlanDate}
            </Descriptions.Item>
            <Descriptions.Item label="Confirm Dispatch Date">
              {selectedPO.confirmDateOfDispatch}
            </Descriptions.Item>
            <Descriptions.Item label="Remarks" span={3}>
              {selectedPO.remarks}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {selectedPO.createdAt}
            </Descriptions.Item>
          </Descriptions>

          {/* Item Details Table */}
          {selectedPO.poItems && selectedPO.poItems.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <Title level={5} style={{ marginBottom: "1rem" }}>
                Item Details
              </Title>
              <Table
                columns={itemColumns}
                dataSource={selectedPO.poItems.map((item, index) => ({
                  ...item,
                  key: index,
                }))}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 900 }}
              />
            </div>
          )}
        </Panel>

        {/* Dispatch Details Accordion */}
        <Panel
          header={renderAccordionHeader(
            "Dispatch Details",
            dispatchStatusInfo.status
          )}
          key="2"
        >
          {/* Add Dispatch Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {canCreateDispatch ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddDispatch}
                style={{
                  background: colors.primary,
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Add Dispatch
              </Button>
            ) : (
              <Tooltip title="You don't have permission to create dispatches">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  disabled
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Add Dispatch
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Dispatch Details Table or Empty State */}
          {currentPODispatches.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={dispatchColumns}
                dataSource={currentPODispatches.map((dispatchItem) => ({
                  ...dispatchItem,
                  key: dispatchItem.dispatchId,
                }))}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 900 }}
                tableLayout="fixed"
              />
            </div>
          ) : (
            <Empty description="No dispatch details available" />
          )}
        </Panel>

        {/* Dispatch Document Accordion */}
        <Panel
          header={renderAccordionHeader("Dispatch Document", documentStatus)}
          key="3"
        >
          {/* Update Document Details Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {canCreateDispatch ? (
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleAddDocument}
                style={{
                  background: colors.primary,
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Update Document Details
              </Button>
            ) : (
              <Tooltip title="You don't have permission to update dispatch documents">
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  disabled
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Update Document Details
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Dispatch Documents Table or Empty State */}
          {dispatchesWithDocuments.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={documentColumns}
                dataSource={dispatchesWithDocuments.map((dispatchItem) => ({
                  ...dispatchItem,
                  key: dispatchItem.dispatchId,
                }))}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 1400 }}
                tableLayout="fixed"
              />
            </div>
          ) : (
            <Empty description="No dispatch documents available" />
          )}
        </Panel>

        {/* Delivery Confirmation Accordion */}
        <Panel
          header={renderAccordionHeader(
            "Delivery Confirmation",
            deliveryConfirmationStatus
          )}
          key="4"
        >
          {/* Update Delivery Information Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {canCreateDispatch ? (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleAddDeliveryConfirmation}
                disabled={dispatchesForDeliveryConfirmation.length === 0}
                style={{
                  background: colors.primary,
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Update Delivery Information
              </Button>
            ) : (
              <Tooltip title="You don't have permission to update delivery information">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  disabled
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Update Delivery Information
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Delivery Confirmation Table or Empty State */}
          {dispatchesWithDeliveryConfirmation.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={deliveryConfirmationColumns}
                dataSource={dispatchesWithDeliveryConfirmation.map(
                  (dispatchItem) => ({
                    ...dispatchItem,
                    key: dispatchItem.dispatchId,
                  })
                )}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 1000 }}
                tableLayout="fixed"
              />
            </div>
          ) : (
            <Empty
              description={
                dispatchesForDeliveryConfirmation.length === 0
                  ? "No dispatches with 'Done' status available for delivery confirmation"
                  : "No delivery confirmations available"
              }
            />
          )}
        </Panel>

        {/* Pre-Commissioning Accordion */}
        <Panel
          header={renderAccordionHeader(
            "Pre-Commissioning",
            preCommissioningAccordionStatus
          )}
          key="5"
        >
          {/* Update Pre-Commissioning Details Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {canCreateCommissioning ? (
              <Button
                type="primary"
                icon={<ToolOutlined />}
                onClick={handleAddPreCommissioning}
                disabled={dispatchesForPreCommissioning.length === 0}
                style={{
                  background: colors.primary,
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Update Pre-Commissioning Details
              </Button>
            ) : (
              <Tooltip title="You don't have permission to update pre-commissioning details">
                <Button
                  type="primary"
                  icon={<ToolOutlined />}
                  disabled
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Update Pre-Commissioning Details
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Pre-Commissioning Table or Empty State */}
          {currentPOPreCommissioning.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={preCommissioningColumns}
                dataSource={currentPOPreCommissioning.map((pc) => ({
                  ...pc,
                  key: pc.id,
                }))}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 1500 }}
                tableLayout="fixed"
              />
            </div>
          ) : (
            <Empty
              description={
                dispatchesForPreCommissioning.length === 0
                  ? "No dispatches with 'Done' delivery status available for pre-commissioning"
                  : "No pre-commissioning details available"
              }
            />
          )}
        </Panel>

        {/* Final Commissioning Accordion */}
        <Panel
          header={renderAccordionHeader(
            "Final Commissioning",
            commissioningAccordionStatus
          )}
          key="6"
        >
          {/* Update Commissioning Details Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {canCreateCommissioning ? (
              <Button
                type="primary"
                icon={<ToolOutlined />}
                onClick={handleAddCommissioning}
                disabled={preCommissioningForCommissioning.length === 0}
                style={{
                  background: colors.primary,
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Update Commissioning Details
              </Button>
            ) : (
              <Tooltip title="You don't have permission to update commissioning details">
                <Button
                  type="primary"
                  icon={<ToolOutlined />}
                  disabled
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Update Commissioning Details
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Commissioning Table or Empty State */}
          {commissionedEntries.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={commissioningColumns}
                dataSource={commissionedEntries.map((pc) => ({
                  ...pc,
                  key: pc.id,
                }))}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 1600 }}
                tableLayout="fixed"
              />
            </div>
          ) : (
            <Empty
              description={
                preCommissioningForCommissioning.length === 0
                  ? "No pre-commissioning entries with 'Done' status available for commissioning"
                  : "No commissioning details available"
              }
            />
          )}
        </Panel>

        {/* Warranty Certificate Accordion */}
        <Panel
          header={renderAccordionHeader(
            "Warranty Certificate",
            warrantyAccordionStatus
          )}
          key="7"
        >
          {/* Update Warranty Details Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {canCreateCommissioning ? (
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleAddWarranty}
                disabled={commissioningForWarranty.length === 0}
                style={{
                  background: colors.primary,
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Update Warranty Details
              </Button>
            ) : (
              <Tooltip title="You don't have permission to update warranty details">
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  disabled
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Update Warranty Details
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Warranty Certificate Table or Empty State */}
          {warrantyEntries.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={warrantyColumns}
                dataSource={warrantyEntries.map((pc) => ({
                  ...pc,
                  key: pc.id,
                }))}
                pagination={false}
                bordered
                size="small"
                scroll={{ x: 1100 }}
                tableLayout="fixed"
              />
            </div>
          ) : (
            <Empty
              description={
                commissioningForWarranty.length === 0
                  ? "No commissioning entries with 'Done' status available for warranty"
                  : "No warranty details available"
              }
            />
          )}
        </Panel>
      </Collapse>

      {/* Dispatch Form Modal */}
      <DispatchFormModal
        visible={isDispatchModalVisible}
        onClose={handleCloseModal}
        poId={selectedPO.id}
        poItems={selectedPO.poItems}
        editData={editingDispatch}
      />

      {/* Dispatch Document Form Modal */}
      <DispatchDocumentFormModal
        visible={isDocumentModalVisible}
        onClose={handleCloseDocumentModal}
        dispatches={currentPODispatches}
        editData={editingDocument}
        poId={poId}
      />

      {/* Delivery Confirmation Form Modal */}
      <DeliveryConfirmationFormModal
        visible={isDeliveryModalVisible}
        onClose={handleCloseDeliveryModal}
        dispatches={dispatchesForDeliveryConfirmation}
        editData={editingDelivery}
        poId={poId}
      />

      {/* Pre-Commissioning Form Modal */}
      <PreCommissioningFormModal
        visible={isPreCommissioningModalVisible}
        onClose={handleClosePreCommissioningModal}
        poId={selectedPO.id}
        dispatches={dispatchesForPreCommissioning}
        editData={editingPreCommissioning}
      />

      {/* Commissioning Form Modal */}
      <CommissioningFormModal
        visible={isCommissioningModalVisible}
        onClose={handleCloseCommissioningModal}
        poId={selectedPO.id}
        editData={editingCommissioning}
      />

      {/* Warranty Certificate Form Modal */}
      <WarrantyCertificateFormModal
        visible={isWarrantyModalVisible}
        onClose={handleCloseWarrantyModal}
        poId={selectedPO.id}
        editData={editingWarranty}
      />

      {/* Unified Dispatch Details View Modal */}
      <DispatchDetailsModal
        visible={isDispatchDetailsModalVisible}
        onClose={handleCloseDispatchDetailsModal}
        dispatch={viewingDispatchDetails}
        initialTab={dispatchDetailsTab}
      />

      {/* Unified Service Details View Modal */}
      <ServiceDetailsModal
        visible={isServiceDetailsModalVisible}
        onClose={handleCloseServiceDetailsModal}
        preCommissioning={viewingServiceDetails}
        initialTab={serviceDetailsTab}
      />

      {/* Update Assign Dispatch To Modal */}
      <UpdateAssignDispatchToModal
        visible={isUpdateAssignDispatchToModalVisible}
        onClose={() => setIsUpdateAssignDispatchToModalVisible(false)}
        poId={selectedPO.id}
        currentAssignDispatchTo={poResponse?.assignDispatchTo}
        currentAssignedUserName={poResponse?.assignedUserName}
      />
    </div>
  );
};

export default PODetails;
