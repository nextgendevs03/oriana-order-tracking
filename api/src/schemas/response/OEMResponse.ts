export interface OEMResponse {
  oemId: string;
  name: string;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OEMListResponse {
  data: OEMResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
