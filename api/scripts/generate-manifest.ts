#!/usr/bin/env ts-node
/**
 * Manifest Generator Script
 *
 * Scans all controllers with decorators and generates app-manifest.json
 * This file is read by CDK during synth to create API Gateway routes.
 *
 * Usage: npx ts-node scripts/generate-manifest.ts
 * Or:    npm run build:manifest
 */

import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';

// Import decorators from shared layer
import { routeRegistry, AppManifest } from '@oriana/shared';

// Import all controllers to trigger decorator registration
// Add new controllers here as they are created
import '../src/controllers/POController';
// import '../src/controllers/DispatchController';
// import '../src/controllers/DeliveryController';

async function generateManifest(): Promise<void> {
  console.log('🔍 Scanning controllers for routes...\n');

  // Generate manifest from registry
  const manifest: AppManifest = routeRegistry.generateManifest();

  // Log discovered routes
  for (const [lambdaName, lambda] of Object.entries(manifest.lambdas)) {
    console.log(`📦 Lambda: ${lambdaName}`);
    console.log(`   Handler: ${lambda.handler}`);
    console.log(`   Controller: ${lambda.controller}`);
    console.log('   Routes:');

    for (const route of lambda.routes) {
      console.log(`     ${route.method.padEnd(7)} ${route.path} → ${route.action}()`);
    }
    console.log('');
  }

  // Write manifest file
  const outputPath = path.join(__dirname, '..', 'app-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated: ${outputPath}`);
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Lambdas: ${Object.keys(manifest.lambdas).length}`);
  console.log(
    `   Total Routes: ${Object.values(manifest.lambdas).reduce((sum, l) => sum + l.routes.length, 0)}`
  );
}

// Run the generator
generateManifest().catch((error) => {
  console.error('❌ Failed to generate manifest:', error);
  process.exit(1);
});
