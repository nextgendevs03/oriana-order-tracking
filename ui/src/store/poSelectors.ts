import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";

// ============= BASE SELECTORS =============

export const selectPOList = (state: RootState) => state.po.poList;
export const selectDispatchDetails = (state: RootState) => state.po.dispatchDetails;
export const selectPreCommissioningDetails = (state: RootState) => state.po.preCommissioningDetails;

// ============= PO SELECTORS =============

export const selectPOById = (poId: string) =>
  createSelector([selectPOList], (poList) =>
    poList.find((po) => po.id === poId) || null
  );

// ============= DISPATCH SELECTORS =============

export const selectDispatchesByPOId = (poId: string) =>
  createSelector([selectDispatchDetails], (dispatches) =>
    dispatches.filter((d) => d.poId === poId)
  );

export const selectDispatchesWithDocuments = (poId: string) =>
  createSelector([selectDispatchesByPOId(poId)], (dispatches) =>
    dispatches.filter((d) => !!d.dispatchStatus)
  );

export const selectDispatchesForDeliveryConfirmation = (poId: string) =>
  createSelector([selectDispatchesByPOId(poId)], (dispatches) =>
    dispatches.filter((d) => d.dispatchStatus === "done")
  );

export const selectDispatchesWithDeliveryConfirmation = (poId: string) =>
  createSelector([selectDispatchesByPOId(poId)], (dispatches) =>
    dispatches.filter((d) => !!d.deliveryStatus)
  );

export const selectDispatchesForPreCommissioning = (poId: string) =>
  createSelector([selectDispatchesByPOId(poId)], (dispatches) =>
    dispatches.filter((d) => d.deliveryStatus === "done")
  );

// ============= PRE-COMMISSIONING SELECTORS =============

export const selectPreCommissioningByPOId = (poId: string) =>
  createSelector([selectPreCommissioningDetails], (pcDetails) =>
    pcDetails.filter((pc) => pc.poId === poId)
  );

export const selectPreCommissioningForCommissioning = (poId: string) =>
  createSelector([selectPreCommissioningDetails], (pcDetails) =>
    pcDetails.filter((pc) => pc.poId === poId && pc.preCommissioningStatus === "Done")
  );

export const selectCommissionedEntries = (poId: string) =>
  createSelector([selectPreCommissioningDetails], (pcDetails) =>
    pcDetails.filter((pc) => pc.poId === poId && pc.commissioningStatus)
  );

export const selectCommissioningForWarranty = (poId: string) =>
  createSelector([selectPreCommissioningDetails], (pcDetails) =>
    pcDetails.filter((pc) => pc.poId === poId && pc.commissioningStatus === "Done")
  );

export const selectWarrantyEntries = (poId: string) =>
  createSelector([selectPreCommissioningDetails], (pcDetails) =>
    pcDetails.filter((pc) => pc.poId === poId && pc.warrantyStatus)
  );

// ============= ACCORDION STATUS SELECTORS =============

export type AccordionStatus = "Not Started" | "In-Progress" | "Done";

export interface DispatchStatusInfo {
  status: AccordionStatus;
  totalQty: number;
  dispatchedQty: number;
}

// Dispatch Details Status
// Uses 'quantity' (actual items) not 'totalQuantity' (which includes spare)
export const selectDispatchStatusInfo = (poId: string) =>
  createSelector(
    [selectPOById(poId), selectDispatchesByPOId(poId)],
    (selectedPO, dispatches): DispatchStatusInfo => {
      if (!selectedPO) return { status: "Not Started", totalQty: 0, dispatchedQty: 0 };

      // Total quantity from PO items (using quantity, not totalQuantity)
      const totalQty = selectedPO.poItems.reduce((sum, item) => sum + item.quantity, 0);

      // Total dispatched quantity from all dispatches
      const dispatchedQty = dispatches.reduce((sum, d) => {
        return sum + d.dispatchedItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      if (dispatches.length === 0) {
        return { status: "Not Started", totalQty, dispatchedQty };
      } else if (dispatchedQty >= totalQty) {
        return { status: "Done", totalQty, dispatchedQty };
      } else {
        return { status: "In-Progress", totalQty, dispatchedQty };
      }
    }
  );

// Dispatch Document Status
// Done: Dispatch Details is Done AND all dispatch entries have dispatchStatus === "done"
// Not Started: No entries
// In-Progress: Entries present but not all dispatchStatus are "done"
export const selectDocumentStatus = (poId: string) =>
  createSelector(
    [selectDispatchStatusInfo(poId), selectDispatchesByPOId(poId), selectDispatchesForDeliveryConfirmation(poId)],
    (dispatchInfo, dispatches, dispatchesWithDoneStatus): AccordionStatus => {
      // No entries - Not Started
      if (dispatches.length === 0) return "Not Started";
      
      // Check if any dispatch has document details (dispatchStatus field)
      const dispatchesWithDocuments = dispatches.filter((d) => !!d.dispatchStatus);
      if (dispatchesWithDocuments.length === 0) return "Not Started";
      
      // Done: Dispatch Details accordion is Done AND all dispatches have dispatchStatus === "done"
      if (
        dispatchInfo.status === "Done" &&
        dispatchesWithDoneStatus.length >= dispatches.length
      ) {
        return "Done";
      }
      
      // In-Progress: Entries present but not all conditions met
      return "In-Progress";
    }
  );

// Delivery Confirmation Status
export const selectDeliveryStatus = (poId: string) =>
  createSelector(
    [selectDispatchesForDeliveryConfirmation(poId), selectDispatchesWithDeliveryConfirmation(poId)],
    (forConfirmation, withConfirmation): AccordionStatus => {
      if (forConfirmation.length === 0) return "Not Started";
      if (withConfirmation.length === 0) return "Not Started";
      if (withConfirmation.length >= forConfirmation.length) return "Done";
      return "In-Progress";
    }
  );

// Pre-Commissioning Status
export const selectPreCommissioningStatusInfo = (poId: string) =>
  createSelector(
    [selectDispatchesForPreCommissioning(poId), selectPreCommissioningByPOId(poId)],
    (dispatches, pcEntries): AccordionStatus => {
      // Get total serial numbers count from dispatches with done delivery status
      let totalSerials = 0;
      dispatches.forEach((d) => {
        d.dispatchedItems.forEach((item) => {
          if (item.serialNumbers) {
            const serials = item.serialNumbers.split(",").map((s) => s.trim()).filter((s) => s !== "");
            totalSerials += serials.length;
          }
        });
      });

      if (totalSerials === 0) return "Not Started";
      if (pcEntries.length === 0) return "Not Started";
      if (pcEntries.length >= totalSerials) return "Done";
      return "In-Progress";
    }
  );

// Commissioning Status
export const selectCommissioningStatusInfo = (poId: string) =>
  createSelector(
    [selectPreCommissioningForCommissioning(poId), selectCommissionedEntries(poId)],
    (forCommissioning, commissioned): AccordionStatus => {
      if (forCommissioning.length === 0) return "Not Started";
      if (commissioned.length === 0) return "Not Started";
      if (commissioned.length >= forCommissioning.length) return "Done";
      return "In-Progress";
    }
  );

// Warranty Certificate Status
export const selectWarrantyStatusInfo = (poId: string) =>
  createSelector(
    [selectCommissioningForWarranty(poId), selectWarrantyEntries(poId)],
    (forWarranty, warrantyEntries): AccordionStatus => {
      if (forWarranty.length === 0) return "Not Started";
      if (warrantyEntries.length === 0) return "Not Started";
      if (warrantyEntries.length >= forWarranty.length) return "Done";
      return "In-Progress";
    }
  );

