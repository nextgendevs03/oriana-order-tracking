export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface ListUserRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userName?: string;
  email?: string;
  role?: string;
  status?: string;
}
