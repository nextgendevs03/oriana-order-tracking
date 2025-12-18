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

    // Generate JWT tokens after successful password validation
    const tokenPayload: JWTPayload = {
      username: user.username,
      email: user.email,
      // roles: user.userRoles?.map((ur) => ur.role.roleName),
    };

    // Generate both access and refresh tokens
    const tokens = generateTokens(tokenPayload);

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
        // roles: user.userRoles?.map((ur) => ur.role.roleName),
      },
    };
  }
}
