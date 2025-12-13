export interface CreateOEMRequest {
  name: string;
  status: 'Active' | 'Inactive';
  createdBy?: string;
}

export interface UpdateOEMRequest {
  name?: string;
  status?: 'Active' | 'Inactive';
  updatedBy?: string;
}
