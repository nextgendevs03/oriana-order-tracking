export interface UserInfo {
  username: string;
  email: string;
  // roles: string[];
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
