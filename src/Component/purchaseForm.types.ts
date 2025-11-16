export type ClearanceStatus = "Pending" | "Approved" | "Option 3";

export interface PurchaseFormValues {
  clearance: ClearanceStatus;
  taxInvoiceNo: string;
  invoiceDate: string | Date;
  eWayBill: string;
  deliveryChallan: string;
  dispatchDate: string | Date;
  packingList: string;
}
