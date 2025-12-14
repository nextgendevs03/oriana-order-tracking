export interface CreateOEMRequest {
  name: string;
  status: boolean;
  createdBy?: string;
}

export interface UpdateOEMRequest {
  name?: string;
  status?: boolean;
  updatedBy?: string;
}
