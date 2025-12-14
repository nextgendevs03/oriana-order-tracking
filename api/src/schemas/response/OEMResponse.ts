export interface OEMResponse {
  oemId: string;
  name: string;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
