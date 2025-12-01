const esbuild = require('esbuild');
const path = require('path');

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

const buildOptions = {
  entryPoints: ['src/handlers/po.handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  // Output as po.js (not po.handler.js) to simplify Lambda handler path
  outfile: 'dist/handlers/po.js',
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
        const outputs = Object.entries(result.metafile.outputs);
        for (const [file, info] of outputs) {
          const sizeKB = (info.bytes / 1024).toFixed(2);
          console.log(`${file}: ${sizeKB} KB`);
        }
      }
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();

