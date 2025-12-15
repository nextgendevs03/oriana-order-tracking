export interface CreateOEMRequest {
  name: string;
  isActive: boolean;
  createdBy?: string;
}

export interface UpdateOEMRequest {
  name?: string;
  isActive?: boolean;
  updatedBy?: string;
}
