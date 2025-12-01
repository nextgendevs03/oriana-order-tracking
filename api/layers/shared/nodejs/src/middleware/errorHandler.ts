import { APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Pre-computed CORS headers for performance
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
} as const;

// Cache headers for responses
const getCacheHeaders = (maxAge: number = 0): Record<string, string> => {
  if (maxAge > 0) {
    return {
      'Cache-Control': `max-age=${maxAge}, must-revalidate`,
    };
  }
  return {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };
};

export const createSuccessResponse = <T>(
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse['meta'],
  cacheMaxAge: number = 0
): APIGatewayProxyResult => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };

  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      ...getCacheHeaders(cacheMaxAge),
    },
    body: JSON.stringify(response),
  };
};

export const createErrorResponse = (error: Error | AppError): APIGatewayProxyResult => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
  } else {
    // Only log unexpected errors
    logger.error('Unhandled error', error);
  }

  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      ...getCacheHeaders(0),
    },
    body: JSON.stringify(response),
  };
};

// Pre-computed OPTIONS response for CORS preflight
const OPTIONS_RESPONSE: APIGatewayProxyResult = {
  statusCode: 204,
  headers: CORS_HEADERS,
  body: '',
};

export const handleOptions = (): APIGatewayProxyResult => OPTIONS_RESPONSE;
