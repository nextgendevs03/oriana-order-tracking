import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnOutput, Duration } from "aws-cdk-lib";
import { EnvironmentConfig } from "../../config/environment";
import { AppManifest, RouteManifestEntry } from "../../utils/manifest-reader";

export interface ApiGatewayConstructProps {
  config: EnvironmentConfig;
  lambdaFunctions: Record<string, lambda.Function>;
  manifest: AppManifest;
}

export class ApiGatewayConstruct extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
    super(scope, id);

    const { config, lambdaFunctions, manifest } = props;

    // Create REST API
    this.api = new apigateway.RestApi(this, "OrianaApi", {
      restApiName: `oriana-api-${config.environment}`,
      description: config.description,
      deployOptions: {
        stageName: config.apiStageName,
        tracingEnabled: config.enableXRay,
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        maxAge: Duration.days(1),
      },
    });

    // Create routes from manifest
    this.createRoutesFromManifest(manifest, lambdaFunctions);

    // Output the API URL
    new CfnOutput(this, "ApiUrl", {
      value: this.api.url,
      description: `API Gateway URL for ${config.environment}`,
      exportName: `OrianaApiUrl-${config.environment}`,
    });
  }

  /**
   * Create API Gateway routes from the app manifest
   */
  private createRoutesFromManifest(
    manifest: AppManifest,
    lambdaFunctions: Record<string, lambda.Function>,
  ): void {
    // Track created resources to avoid duplicates
    const resourceCache: Map<string, apigateway.IResource> = new Map();
    resourceCache.set("", this.api.root);

    for (const [lambdaName, lambdaConfig] of Object.entries(manifest.lambdas)) {
      const lambdaFunction = lambdaFunctions[lambdaName];

      if (!lambdaFunction) {
        console.warn(
          `⚠️  Lambda function '${lambdaName}' not found, skipping routes`,
        );
        continue;
      }

      const integration = new apigateway.LambdaIntegration(lambdaFunction);

      for (const route of lambdaConfig.routes) {
        this.addRoute(route, integration, resourceCache);
      }
    }

    console.log(`   Created ${resourceCache.size - 1} API resources`);
  }

  /**
   * Add a single route to API Gateway
   */
  private addRoute(
    route: RouteManifestEntry,
    integration: apigateway.LambdaIntegration,
    resourceCache: Map<string, apigateway.IResource>,
  ): void {
    // Get or create the resource for this path
    const resource = this.getOrCreateResource(route.path, resourceCache);

    // Add the method
    resource.addMethod(route.method, integration);

    console.log(
      `   ${route.method.padEnd(7)} ${route.path} → ${route.controller}.${route.action}()`,
    );
  }

  /**
   * Get or create a resource for a path
   */
  private getOrCreateResource(
    path: string,
    resourceCache: Map<string, apigateway.IResource>,
  ): apigateway.IResource {
    // Normalize path
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    // Check cache
    if (resourceCache.has(normalizedPath)) {
      return resourceCache.get(normalizedPath)!;
    }

    // Split path into segments
    const segments = normalizedPath.split("/").filter(Boolean);

    let currentResource: apigateway.IResource = this.api.root;
    let currentPath = "";

    for (const segment of segments) {
      currentPath = `${currentPath}/${segment}`;

      if (resourceCache.has(currentPath)) {
        currentResource = resourceCache.get(currentPath)!;
      } else {
        // Create new resource
        currentResource = currentResource.addResource(segment);
        resourceCache.set(currentPath, currentResource);
      }
    }

    return currentResource;
  }
}
