export interface UserResponse {
  userId?: string;
  username: string;
  email: string;
  password: string;
  role: string;

  isActive: boolean;

  // add other fields needed for response here
}

export interface UserListResponse {
  items: UserResponse[];
}
