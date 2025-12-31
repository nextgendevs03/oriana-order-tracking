export interface UserInfo {
  username: string;
  email: string;
  roleName?: string | null;
  roleId?: number | null;
  permissions: string[]; // Array of permission codes
}
export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  refreshExpiresIn: number; // seconds
  user: UserInfo;
}
