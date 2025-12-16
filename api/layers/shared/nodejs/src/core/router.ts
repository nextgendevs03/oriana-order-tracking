import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as LambdaContext } from 'aws-lambda';
import { Container } from 'inversify';
import { routeRegistry } from '../decorators/registry';
import { RouteMetadata, HttpMethod } from '../decorators/metadata';
import { parameterResolver, RequestContext } from './parameter-resolver';
import {
  createSuccessResponse,
  createErrorResponse,
  handleOptions,
  ValidationError,
} from '../middleware/errorHandler';
import { authMiddleware, AuthenticatedEvent } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';

interface MatchedRoute {
  controller: Function;
  route: RouteMetadata;
  pathParams: Record<string, string>;
  basePath: string;
}

/**
 * Public routes that don't require authentication
 * Format: { method: 'POST', path: '/api/login' }
 */
const PUBLIC_ROUTES: Array<{ method: HttpMethod; path: string }> = [
  { method: 'POST', path: '/api/login' },
];

/**
 * Router class for matching and dispatching requests to controllers
 */
export class Router {
  private container: Container;
  private lambdaName: string;

  constructor(container: Container, lambdaName: string) {
    this.container = container;
    this.lambdaName = lambdaName;
  }

  /**
   * Check if a route is public (doesn't require authentication)
   */
  private isPublicRoute(method: HttpMethod, path: string): boolean {
    return PUBLIC_ROUTES.some((route) => route.method === method && route.path === path);
  }

  /**
   * Handle an incoming API Gateway request
   */
  async handleRequest(
    event: APIGatewayProxyEvent,
    context: LambdaContext
  ): Promise<APIGatewayProxyResult> {
    const method = event.httpMethod.toUpperCase() as HttpMethod;
    const path = event.path;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    try {
      // Find matching route
      const match = this.matchRoute(method, path);

      if (!match) {
        logger.warn('No route matched', { method, path });
        return createErrorResponse(new ValidationError(`No route found for ${method} ${path}`));
      }

      logger.debug('Route matched', {
        controller: match.controller.name,
        method: match.route.methodName,
        pathParams: match.pathParams,
        path,
      });

      // Apply authentication middleware for protected routes
      let authenticatedEvent: AuthenticatedEvent | APIGatewayProxyEvent = event;
      if (!this.isPublicRoute(method, path)) {
        logger.debug('Route requires authentication', { method, path });

        const authResult = await authMiddleware(event);

        // If authMiddleware returns an error response, return it immediately
        if ('statusCode' in authResult && 'body' in authResult) {
          logger.warn('Authentication failed', { method, path, statusCode: authResult.statusCode });
          return authResult;
        }

        // Otherwise, use the authenticated event
        authenticatedEvent = authResult as AuthenticatedEvent;
        logger.debug('Authentication successful', {
          username: (authenticatedEvent as AuthenticatedEvent).user?.username,
          method,
          path,
        });
      } else {
        logger.debug('Public route - skipping authentication', { method, path });
      }

      // Get controller instance from DI container
      const controllerInstance = this.container.get(match.controller) as object;

      // Build request context with authenticated event
      const requestContext: RequestContext = {
        event: authenticatedEvent,
        context,
        pathParams: match.pathParams,
      };

      // Resolve parameters
      const args = parameterResolver.resolveParameters(
        controllerInstance,
        match.route.propertyKey,
        requestContext
      );

      // Invoke the controller method
      const methodFn = (controllerInstance as Record<string | symbol, Function>)[
        match.route.propertyKey
      ];
      const result = await methodFn.apply(controllerInstance, args);

      // If result is already an API Gateway response, return it directly
      if (this.isApiGatewayResponse(result)) {
        return result;
      }

      // Otherwise, wrap in success response
      return createSuccessResponse(result);
    } catch (error) {
      // Log error with sanitized information to avoid logging huge minified Prisma errors
      const errorObj = error as Error & { code?: string; meta?: unknown };
      const isPrismaError = errorObj.name?.startsWith('PrismaClient');

      if (isPrismaError) {
        // For Prisma errors, log only essential information
        logger.error('Error handling request', {
          type: errorObj.name,
          code: errorObj.code,
          meta: errorObj.meta,
          message: errorObj.message?.substring(0, 200) || 'No message',
        });
      } else {
        // For other errors, log with limited message length
        logger.error('Error handling request', {
          name: errorObj.name,
          message: errorObj.message?.substring(0, 500) || 'No message',
          stack: errorObj.stack?.split('\n').slice(0, 10).join('\n') || undefined,
        });
      }

      return createErrorResponse(error as Error);
    }
  }

  /**
   * Match a request to a registered route
   */
  private matchRoute(method: HttpMethod, path: string): MatchedRoute | null {
    const controllerData = routeRegistry.getRoutesForLambda(this.lambdaName);

    for (const { controller, routes, basePath } of controllerData) {
      for (const route of routes) {
        if (route.method !== method) {
          continue;
        }

        const fullPath = this.joinPaths(basePath, route.path);
        const pathParams = this.matchPath(fullPath, path);

        if (pathParams !== null) {
          return { controller, route, pathParams, basePath };
        }
      }
    }

    return null;
  }

  /**
   * Match a route pattern against actual path and extract parameters
   * Pattern uses {paramName} syntax (AWS API Gateway style)
   */
  private matchPath(pattern: string, actualPath: string): Record<string, string> | null {
    // Normalize paths
    const patternParts = pattern.split('/').filter(Boolean);
    const actualParts = actualPath.split('/').filter(Boolean);

    if (patternParts.length !== actualParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const actualPart = actualParts[i];

      // Check if this is a path parameter {paramName}
      const paramMatch = patternPart.match(/^\{(\w+)\}$/);

      if (paramMatch) {
        // Extract parameter value
        params[paramMatch[1]] = decodeURIComponent(actualPart);
      } else if (patternPart !== actualPart) {
        // Static path segment doesn't match
        return null;
      }
    }

    return params;
  }

  /**
   * Join path segments correctly
   */
  private joinPaths(basePath: string, routePath: string): string {
    const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    const route = routePath.startsWith('/') ? routePath : `/${routePath}`;
    return route === '/' ? base || '/' : `${base}${route}`;
  }

  /**
   * Check if result is already an API Gateway response
   */
  private isApiGatewayResponse(result: unknown): result is APIGatewayProxyResult {
    return (
      typeof result === 'object' && result !== null && 'statusCode' in result && 'body' in result
    );
  }
}

/**
 * Create a router instance for a specific lambda
 */
export function createRouter(container: Container, lambdaName: string): Router {
  return new Router(container, lambdaName);
}
