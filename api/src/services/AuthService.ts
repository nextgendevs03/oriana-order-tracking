import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IAuthRepository } from '../repositories/AuthRepository';
import { LoginRequest, LoginResponse } from '../schemas';
import { ValidationError, AppError } from '@oriana/shared';
import { generateTokens, JWTPayload } from '@oriana/shared';

export interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.AuthRepository) private authRepository: IAuthRepository) {}

  async login(data: LoginRequest): Promise<LoginResponse> {
    if (!data.username || !data.password) {
      throw new ValidationError('Username and password are required');
    }

    const user = await this.authRepository.findByUsernameOrEmail(data.username);

    if (!user) {
      throw new AppError('Invalid username or password', 401, 'UNAUTHORIZED');
    }

    const isPasswordValid = await this.authRepository.validatePassword(user, data.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid username or password', 401, 'UNAUTHORIZED');
    }

    // Extract role and permissions
    const userWithRole = user as unknown as {
      role?: {
        roleId: number;
        roleName: string;
        rolePermissions?: Array<{
          permission: {
            permissionCode: string;
            isActive: boolean;
          };
        }>;
      } | null;
    };

    const role = userWithRole.role;

    // Extract permission codes from role permissions (only active permissions)
    const permissionCodes: string[] =
      role?.rolePermissions
        ?.filter((rp) => rp.permission.isActive)
        .map((rp) => rp.permission.permissionCode)
        .filter((code): code is string => Boolean(code)) || [];

    // Generate JWT tokens after successful password validation
    const tokenPayload: JWTPayload = {
      username: user.username,
      email: user.email,
      role: role?.roleName,
    };

    // Generate both access and refresh tokens
    const tokens = await generateTokens(tokenPayload);

    // Verify tokens were generated successfully
    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new AppError('Failed to generate authentication tokens', 500, 'TOKEN_GENERATION_ERROR');
    }

    // Return login response with tokens
    return {
      success: true,
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresIn: tokens.refreshExpiresIn,
      user: {
        username: user.username,
        email: user.email,
        roleName: role?.roleName || null,
        roleId: role?.roleId || null,
        permissions: permissionCodes,
      },
    };
  }
}
