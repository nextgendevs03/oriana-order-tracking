export interface DispatchFormValues {
  deliveryCount: number;
  dispatchType: "Single" | "Multiple";
  projectName: string;
  projectLocation: string;
  deliveryAddress: string;
  googleMapLink?: string;
  deliveryQuantity: number;
  dispatchDate: string | Date;
}
