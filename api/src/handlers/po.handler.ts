import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createContainer } from '../container/po.container';
import { createRouter, Router, logger, createErrorResponse, handleOptions } from '@oriana/shared';

// Import controller to register decorators
import '../controllers/POController';

// Initialize outside handler for container reuse (Lambda best practice)
let isInitialized = false;
let initPromise: Promise<void> | null = null;
let initError: Error | null = null;
let router: Router | null = null;

const LAMBDA_NAME = 'po';

const initialize = async (): Promise<void> => {
  // Fast path: already initialized
  if (isInitialized) {
    return;
  }

  // If previous initialization failed, throw the error
  if (initError) {
    throw initError;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    await initPromise;
    return;
  }

  // Start new initialization
  initPromise = (async () => {
    const startTime = Date.now();
    logger.info('Initializing Lambda container and DB connection...');

    try {
      // Create DI container
      const container = await createContainer();

      // Create router for this lambda
      router = createRouter(container, LAMBDA_NAME);

      isInitialized = true;

      const duration = Date.now() - startTime;
      logger.info(`Lambda container initialized in ${duration}ms`);
    } catch (error) {
      initError = error as Error;
      throw error;
    }
  })();

  await initPromise;
};

// Trigger initialization on cold start (OUTSIDE handler)
initialize().catch((error) => {
  logger.error('Failed to initialize during cold start', error);
});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  logger.setContext({
    requestId: context.awsRequestId,
    functionName: context.functionName,
  });

  const startTime = Date.now();
  logger.info('Incoming request', {
    method: event.httpMethod,
    path: event.path,
    pathParameters: event.pathParameters,
  });

  try {
    await initialize();

    if (!router) {
      throw new Error('Router not initialized');
    }

    const response = await router.handleRequest(event, context);

    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      statusCode: response.statusCode,
      duration: `${duration}ms`,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Unhandled error in handler', { error, duration: `${duration}ms` });
    return createErrorResponse(error as Error);
  } finally {
    logger.clearContext();
  }
};
