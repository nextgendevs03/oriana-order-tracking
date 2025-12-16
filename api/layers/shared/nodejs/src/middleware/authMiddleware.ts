import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { verifyAccessToken, JWTPayload } from '../utils/webtoken';
import { createErrorResponse } from './errorHandler';

/**
 * Extended event with user information
 */
export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user?: JWTPayload;
}

/*
 * JWT Authentication Middleware
 * Extracts and verifies JWT token from Authorization header
 *
 * Usage in controller:
 *
 * @Get('/protected')
 * @UseAuth() // Add this decorator
 * async protectedRoute(@Request() event: AuthenticatedEvent) {
 *   const userId = event.user?.userId;
 *   // ...
 * }
 *  */
export const authMiddleware = async (
  event: APIGatewayProxyEvent
): Promise<AuthenticatedEvent | APIGatewayProxyResult> => {
  try {
    // Extract token from Authorization header
    const authHeader = event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader) {
      return createErrorResponse(new Error('Authorization header is missing'));
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return createErrorResponse(new Error('Authorization header must start with "Bearer "'));
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return createErrorResponse(new Error('Token is missing'));
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
    const errorMessage = error instanceof Error ? error.message : 'Invalid token';
    return createErrorResponse(new Error(errorMessage));
  }
};

// Optional: Helper function to extract user from authenticated event

export const getAuthenticatedUser = (event: AuthenticatedEvent): JWTPayload => {
  if (!event.user) {
    throw new Error('User not authenticated');
  }
  return event.user;
};
