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
  // If data is an object (not array or null), spread it directly into response
  // This avoids double nesting with RTK Query which already wraps responses in 'data'
  // For arrays and primitives, wrap them in a data field
  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);

  const response = {
    ...(isObject ? data : {}),
    success: true,
    ...(!isObject && data !== null && data !== undefined ? { data } : {}),
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

/**
 * Format Prisma errors into user-friendly messages
 */
const formatPrismaError = (
  error: Error
): { statusCode: number; code: string; message: string } | null => {
  const errorName = error.name || '';
  const errorMessage = error.message || '';

  // Prisma validation errors (missing required fields, invalid data)
  if (errorName === 'PrismaClientValidationError') {
    // Extract the missing field from the error message
    const missingFieldMatch = errorMessage.match(/Argument `(\w+)` is missing/);
    if (missingFieldMatch) {
      return {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: `Missing required field: ${missingFieldMatch[1]}`,
      };
    }
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid data provided',
    };
  }

  // Prisma known request errors (unique constraint, foreign key, etc.)
  if (errorName === 'PrismaClientKnownRequestError') {
    const prismaError = error as Error & { code?: string; meta?: { target?: string[] } };

    switch (prismaError.code) {
      case 'P2002': // Unique constraint violation
        const fields = prismaError.meta?.target?.join(', ') || 'field';
        return {
          statusCode: 409,
          code: 'DUPLICATE_ERROR',
          message: `A record with this ${fields} already exists`,
        };
      case 'P2003': // Foreign key constraint failed
        return {
          statusCode: 400,
          code: 'REFERENCE_ERROR',
          message: 'Referenced record does not exist',
        };
      case 'P2025': // Record not found
        return {
          statusCode: 404,
          code: 'NOT_FOUND',
          message: 'Record not found',
        };
      default:
        // Log unknown Prisma error codes with full details
        logger.error('Unhandled Prisma error', {
          code: prismaError.code,
          name: prismaError.name,
          message: prismaError.message,
          meta: prismaError.meta,
        });
        return {
          statusCode: 400,
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
        };
    }
  }

  // Prisma connection errors
  if (errorName === 'PrismaClientInitializationError') {
    logger.error('Database connection failed', { error: errorMessage });
    return {
      statusCode: 503,
      code: 'DATABASE_UNAVAILABLE',
      message: 'Unable to connect to database',
    };
  }

  // Check if it's any other Prisma error (starts with PrismaClient)
  if (errorName.startsWith('PrismaClient')) {
    logger.error('Unhandled Prisma error', {
      name: errorName,
      message: errorMessage,
      stack: error.stack,
    });
    return {
      statusCode: 500,
      code: 'DATABASE_ERROR',
      message: 'A database error occurred',
    };
  }

  return null;
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
    // Check for Prisma errors first
    const prismaError = formatPrismaError(error);
    if (prismaError) {
      statusCode = prismaError.statusCode;
      code = prismaError.code;
      message = prismaError.message;
      logger.warn('Prisma error', { code, message, originalError: error.name });
    } else {
      // Only log unexpected errors with full details
      logger.error('Unhandled error', error);
    }
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
