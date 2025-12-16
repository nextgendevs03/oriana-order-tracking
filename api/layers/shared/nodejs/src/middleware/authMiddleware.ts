import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyAccessToken, JWTPayload } from '../utils/webtoken';
import { createErrorResponse, AppError } from './errorHandler';

/**
 * Extended event with user information
 */
export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user?: JWTPayload;
}

/**
 * JWT Authentication Middleware
 * Extracts and verifies JWT token from Authorization header
 *
 * Returns an error response (401) if:
 * - Authorization header is missing
 * - Token format is invalid
 * - Token verification fails
 *
 * Returns authenticated event with user info if token is valid
 */
export const authMiddleware = async (
  event: APIGatewayProxyEvent
): Promise<AuthenticatedEvent | APIGatewayProxyResult> => {
  try {
    // Extract token from Authorization header (case-insensitive)
    const authHeader =
      event.headers?.Authorization ||
      event.headers?.authorization ||
      event.headers?.['Authorization'] ||
      event.headers?.['authorization'];

    if (!authHeader) {
      return createErrorResponse(
        new AppError('Authorization header is missing', 401, 'UNAUTHORIZED')
      );
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('bearer ')) {
      return createErrorResponse(
        new AppError('Authorization header must start with "Bearer "', 401, 'UNAUTHORIZED')
      );
    }

    // Extract token (case-insensitive Bearer prefix)
    const token = authHeader.substring(authHeader.indexOf(' ') + 1).trim();

    if (!token) {
      return createErrorResponse(new AppError('Token is missing', 401, 'UNAUTHORIZED'));
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to event
    const authenticatedEvent: AuthenticatedEvent = {
      ...event,
      user: decoded,
    };

    return authenticatedEvent;
  } catch (error) {
    // Handle specific JWT errors
    let errorMessage = 'Invalid or expired token';
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        errorMessage = 'Access token has expired';
      } else if (error.message.includes('Invalid')) {
        errorMessage = 'Invalid access token';
      } else {
        errorMessage = error.message;
      }
    }

    return createErrorResponse(new AppError(errorMessage, 401, 'UNAUTHORIZED'));
  }
};

// Optional: Helper function to extract user from authenticated event

export const getAuthenticatedUser = (event: AuthenticatedEvent): JWTPayload => {
  if (!event.user) {
    throw new Error('User not authenticated');
  }
  return event.user;
};
