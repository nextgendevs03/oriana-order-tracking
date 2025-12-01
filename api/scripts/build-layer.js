const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Build script for the shared Lambda layer
 * Creates a bundled layer that eliminates problematic node_modules (inversify long paths)
 * This fixes the Windows SAM CLI "Failed to calculate hash" error
 */

const layerSrcPath = path.join(__dirname, '../layers/shared/nodejs');
const bundledOutputPath = path.join(__dirname, '../layers/shared/bundled');

async function buildLayer() {
  console.log('🔧 Building shared Lambda layer...\n');

  try {
    // Step 1: Install dependencies in the layer source
    console.log('📦 Installing layer dependencies...');
    execSync('npm install', { cwd: layerSrcPath, stdio: 'inherit' });

    // Step 2: Build with esbuild (bundles inversify, sequelize, reflect-metadata)
    console.log('\n⚡ Bundling layer with esbuild...');
    execSync('npm run build', { cwd: layerSrcPath, stdio: 'inherit' });

    // Step 3: Create bundled output directory
    // Lambda layers for Node.js must have content in nodejs/ subdirectory
    // This ensures content is mounted at /opt/nodejs/ when layer is attached
    console.log('\n📁 Creating bundled layer output...');
    if (fs.existsSync(bundledOutputPath)) {
      fs.rmSync(bundledOutputPath, { recursive: true });
    }
    
    // Create nodejs subdirectory (Lambda layer convention)
    const nodejsPath = path.join(bundledOutputPath, 'nodejs');
    fs.mkdirSync(nodejsPath, { recursive: true });

    // Step 4: Copy bundled dist to nodejs/dist
    const srcDist = path.join(layerSrcPath, 'dist');
    const destDist = path.join(nodejsPath, 'dist');
    fs.cpSync(srcDist, destDist, { recursive: true });

    // Note: pg and all dependencies are now bundled into dist/index.js
    // No need for separate node_modules - everything is in the single bundle
    console.log('📦 All dependencies bundled (including pg)');

    // Step 5: Create package.json for the bundled layer
    const packageJson = {
      name: '@oriana/shared-layer',
      version: '1.0.0',
      main: 'dist/index.js',
    };
    fs.writeFileSync(
      path.join(nodejsPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Calculate final size
    const totalSize = getFolderSize(bundledOutputPath);
    console.log(`\n✅ Bundled layer created: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Output: ${bundledOutputPath}`);

  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

function getFolderSize(folderPath) {
  let totalSize = 0;
  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getFolderSize(filePath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

buildLayer();

