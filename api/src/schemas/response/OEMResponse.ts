export interface OEMResponse {
  oemId: string;
  name: string;
  status: 'Active' | 'Inactive';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
