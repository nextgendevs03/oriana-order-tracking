#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/stacks/api-stack";
import { getEnvironmentConfig, Environment } from "../lib/config/environment";

const app = new cdk.App();

// Get AWS account and region from environment or CDK context
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region:
    process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "ap-south-1",
};

// Create stacks for each environment
const environments: Environment[] = ["dev", "qa", "prod"];

environments.forEach((environment) => {
  const config = getEnvironmentConfig(environment);

  new ApiStack(app, config.stackName, {
    config,
    env,
  });
});

app.synth();
