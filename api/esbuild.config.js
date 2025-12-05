const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const isWatch = process.argv.includes('--watch');

// Plugin to rewrite @oriana/shared imports to /opt/nodejs/dist (Lambda layer path)
const sharedLayerPlugin = {
  name: 'shared-layer-alias',
  setup(build) {
    // Intercept @oriana/shared imports BEFORE default resolution
    // Use a high-priority filter that runs first
    build.onResolve({ filter: /^@oriana\/shared/ }, (args) => {
      // Handle both @oriana/shared and @oriana/shared/subpath
      if (args.path === '@oriana/shared') {
        return { path: '/opt/nodejs/dist', external: true };
      }
      const subpath = args.path.replace('@oriana/shared/', '');
      return { path: `/opt/nodejs/dist/${subpath}`, external: true };
    });
  },
};

/**
 * Auto-discover all lambda configuration files from src/lambdas/*.lambda.ts
 * Each file should export a handler created with createLambdaHandler()
 */
function discoverLambdas() {
  const lambdasDir = path.join(__dirname, 'src/lambdas');
  
  // Create lambdas directory if it doesn't exist
  if (!fs.existsSync(lambdasDir)) {
    console.warn('⚠️  No src/lambdas directory found. Creating it...');
    fs.mkdirSync(lambdasDir, { recursive: true });
    return [];
  }

  // Find all *.lambda.ts files
  const pattern = path.join(lambdasDir, '*.lambda.ts').replace(/\\/g, '/');
  const lambdaFiles = glob.sync(pattern);

  if (lambdaFiles.length === 0) {
    console.warn('⚠️  No lambda files found in src/lambdas/');
    console.warn('   Create files like: src/lambdas/po.lambda.ts');
    return [];
  }

  console.log(`\n🔍 Discovered ${lambdaFiles.length} lambda(s):`);
  
  const entryPoints = lambdaFiles.map((file) => {
    // Extract lambda name from filename (e.g., po.lambda.ts -> po)
    const basename = path.basename(file, '.lambda.ts');
    console.log(`   - ${basename} (${path.relative(__dirname, file)})`);
    
    return {
      in: file,
      out: `handlers/${basename}`,
    };
  });

  console.log('');
  return entryPoints;
}

// Discover lambdas at build time
const entryPoints = discoverLambdas();

// Skip build if no lambdas found
if (entryPoints.length === 0) {
  console.log('No lambdas to build. Exiting.');
  process.exit(0);
}

const buildOptions = {
  entryPoints,
  bundle: true,
  platform: 'node',
  target: 'node22',
  outdir: 'dist',
  format: 'cjs',
  sourcemap: true,
  minify: false, // Keep false for debugging
  // Don't use tsconfig paths for resolution - our plugin handles @oriana/shared
  tsconfigRaw: JSON.stringify({
    compilerOptions: {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  }),
  external: [
    // AWS SDK v3 is included in Lambda runtime
    '@aws-sdk/*',
    // Layer dependencies - will be loaded from /opt/nodejs
    '/opt/nodejs/*',
    // Prisma is bundled in the Lambda layer
    '@prisma/client',
  ],
  plugins: [sharedLayerPlugin],
  // Optimize for Lambda
  treeShaking: true,
  metafile: true,
  logLevel: 'info',
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      const result = await esbuild.build(buildOptions);
      
      // Output build size info
      if (result.metafile) {
        console.log('\n📦 Build output:');
        const outputs = Object.entries(result.metafile.outputs);
        for (const [file, info] of outputs) {
          if (file.endsWith('.js')) {
            const sizeKB = (info.bytes / 1024).toFixed(2);
            console.log(`   ${file}: ${sizeKB} KB`);
          }
        }
      }
      
      console.log('\n✅ Build complete!\n');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
