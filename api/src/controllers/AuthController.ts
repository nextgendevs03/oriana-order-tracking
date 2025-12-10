import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Controller, Post, Body, createSuccessResponse, ValidationError } from '@oriana/shared';
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

    const result: LoginResponse = await this.authService.login(data);

    if (result.success) {
      return createSuccessResponse(result, 200);
    } else {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: result.message,
        }),
      };
    }
  }
}
