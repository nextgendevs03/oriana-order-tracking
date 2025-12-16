import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  Controller,
  Post,
  Body,
  createSuccessResponse,
  ValidationError,
  createErrorResponse,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IAuthService } from '../services/AuthService';
import { LoginRequest, LoginResponse } from '../schemas';

export interface IAuthController {
  login(data: LoginRequest): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api', lambdaName: 'auth' })
@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  @Post('/login')
  async login(@Body() data: LoginRequest): Promise<APIGatewayProxyResult> {
    if (!data.username || !data.password) {
      throw new ValidationError('Username and password are required');
    }

    try {
      // Call auth service to validate credentials and generate tokens
      const result: LoginResponse = await this.authService.login(data);

      // Verify tokens are present in response
      if (!result.accessToken || !result.refreshToken) {
        throw new Error('Tokens were not generated during login');
      }

      // Return success response with login data including tokens
      return createSuccessResponse(result, 200);
    } catch (error) {
      return createErrorResponse(error as Error);
    }
  }
}
