import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IAuthRepository } from '../repositories/AuthRepository';
import { LoginRequest, LoginResponse } from '../schemas';
import { ValidationError, AppError } from '@oriana/shared';

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

    return {
      success: true,
      message: 'Login successful',
    };
  }
}
