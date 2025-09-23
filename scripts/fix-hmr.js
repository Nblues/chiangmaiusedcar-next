#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(PROJECT_ROOT, '.next');

/**
 * Fix WebSocket HMR issues in Next.js
 * - Check if running in dev or prod mode
 * - Disable HMR logs in production
 * - Reset .next/ directory and restart in development
 * - Force WebSocket connection forwarding for proxy
 */

function isProductionMode() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.NETLIFY;
}

function isDevelopmentMode() {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m', // Reset
  };

  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    log(`Removed directory: ${dirPath}`, 'success');
  }
}

function executeCommand(command, description) {
  try {
    log(`Executing: ${description}`, 'info');
    execSync(command, {
      stdio: 'pipe',
      cwd: PROJECT_ROOT,
      env: { ...process.env },
    });
    log(`✅ ${description} completed`, 'success');
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'error');
    throw error;
  }
}

function createHMRConfig() {
  const hmrConfig = {
    development: {
      webpackHMR: true,
      refreshOnUpdate: true,
      websocketUrl: 'ws://localhost:3000/_next/webpack-hmr',
      retryAttempts: 3,
      retryDelay: 1000,
    },
    production: {
      webpackHMR: false,
      refreshOnUpdate: false,
      websocketUrl: null,
      disableLogs: true,
    },
  };

  const configPath = path.join(PROJECT_ROOT, 'hmr.config.json');
  fs.writeFileSync(configPath, JSON.stringify(hmrConfig, null, 2));
  log(`Created HMR config: ${configPath}`, 'success');
}

function updateNextConfig() {
  const nextConfigPath = path.join(PROJECT_ROOT, 'next.config.js');

  if (!fs.existsSync(nextConfigPath)) {
    log('next.config.js not found', 'warning');
    return;
  }

  let content = fs.readFileSync(nextConfigPath, 'utf8');

  // Add WebSocket HMR configuration
  const hmrConfig = `
  // WebSocket HMR Configuration
  webpack: (config, { dev, isServer }) => {
    // Existing webpack configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // HMR WebSocket configuration for development
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        hot: true,
        liveReload: true,
        client: {
          webSocketURL: 'ws://localhost:3000/_next/webpack-hmr',
          overlay: {
            errors: true,
            warnings: false,
          },
          reconnect: 3,
        },
      };
    }

    return config;
  },`;

  // Replace existing webpack config or add new one
  if (content.includes('webpack:')) {
    // Update existing webpack config
    content = content.replace(/webpack:\s*\([^}]+\}\s*,?\s*\)/s, hmrConfig.trim());
  } else {
    // Add webpack config before the closing bracket
    content = content.replace(
      /};?\s*module\.exports/,
      `${hmrConfig}\n};

module.exports`
    );
  }

  fs.writeFileSync(nextConfigPath, content);
  log('Updated next.config.js with HMR configuration', 'success');
}

function fixProductionHMR() {
  log('🔧 Production mode detected - Disabling HMR logs', 'info');

  // Create environment variable to disable HMR warnings
  const envLocalPath = path.join(PROJECT_ROOT, '.env.local');
  let envContent = '';

  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf8');
  }

  const hmrDisableConfig = `
# Disable HMR logs in production
NEXT_TELEMETRY_DISABLED=1
DISABLE_HMR_LOGS=true
FAST_REFRESH=false
`;

  if (!envContent.includes('DISABLE_HMR_LOGS')) {
    envContent += hmrDisableConfig;
    fs.writeFileSync(envLocalPath, envContent);
    log('Added HMR disable config to .env.local', 'success');
  }

  log('✅ Production HMR configuration completed', 'success');
}

function fixDevelopmentHMR() {
  log('🔧 Development mode detected - Resetting HMR environment', 'info');

  try {
    // Step 1: Remove .next directory
    log('Step 1: Removing .next directory...', 'info');
    removeDirectory(NEXT_DIR);

    // Step 2: Clear package manager cache
    log('Step 2: Clearing package manager cache...', 'info');
    try {
      executeCommand('pnpm store prune', 'Clear pnpm cache');
    } catch {
      try {
        executeCommand('npm cache clean --force', 'Clear npm cache');
      } catch {
        log('Could not clear package cache, continuing...', 'warning');
      }
    }

    // Step 3: Reinstall dependencies
    log('Step 3: Reinstalling dependencies...', 'info');
    try {
      executeCommand('pnpm install', 'Reinstall dependencies with pnpm');
    } catch {
      executeCommand('npm install', 'Reinstall dependencies with npm');
    }

    // Step 4: Update configuration
    log('Step 4: Updating HMR configuration...', 'info');
    createHMRConfig();
    updateNextConfig();

    // Step 5: Start development server
    log('Step 5: Starting development server...', 'info');
    log('🚀 Starting Next.js development server with HMR...', 'success');

    try {
      executeCommand('pnpm dev', 'Start development server with pnpm');
    } catch {
      executeCommand('npm run dev', 'Start development server with npm');
    }
  } catch (error) {
    log(`❌ Development HMR fix failed: ${error.message}`, 'error');

    // Fallback: Basic reset
    log('🔄 Attempting basic reset...', 'warning');
    removeDirectory(NEXT_DIR);
    log('Please manually run: npm run dev or pnpm dev', 'info');
  }
}

function createProxyConfig() {
  const proxyConfigPath = path.join(PROJECT_ROOT, 'proxy.config.js');

  const proxyConfig = `
/**
 * Proxy configuration for WebSocket HMR forwarding
 * Use this with your reverse proxy (nginx, Apache, etc.)
 */

module.exports = {
  // For nginx
  nginx: {
    location: '/_next/webpack-hmr',
    config: \`
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    \`
  },
  
  // For Apache
  apache: {
    config: \`
      ProxyPreserveHost On
      ProxyRequests Off
      
      # WebSocket HMR support
      RewriteEngine on
      RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
      RewriteCond %{HTTP:CONNECTION} Upgrade$ [NC]
      RewriteRule /_next/webpack-hmr(.*) ws://localhost:3000/_next/webpack-hmr$1 [P,L]
      
      # Regular proxy
      ProxyPass /_next/webpack-hmr http://localhost:3000/_next/webpack-hmr
      ProxyPassReverse /_next/webpack-hmr http://localhost:3000/_next/webpack-hmr
    \`
  },
  
  // For Node.js proxy
  nodejs: {
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: {
      '^/_next/webpack-hmr': '/_next/webpack-hmr'
    }
  }
};
`;

  fs.writeFileSync(proxyConfigPath, proxyConfig);
  log(`Created proxy configuration: ${proxyConfigPath}`, 'success');
}

function main() {
  log('🔍 Next.js WebSocket HMR Fix Tool', 'info');
  log(`Project root: ${PROJECT_ROOT}`, 'info');
  log(`Node environment: ${process.env.NODE_ENV || 'undefined'}`, 'info');

  // Create proxy configuration for reference
  createProxyConfig();

  if (isProductionMode()) {
    log('📦 Production environment detected', 'info');
    fixProductionHMR();
  } else if (isDevelopmentMode()) {
    log('🛠️ Development environment detected', 'info');
    fixDevelopmentHMR();
  } else {
    log('❓ Unknown environment, assuming development', 'warning');
    fixDevelopmentHMR();
  }

  log('🎉 HMR fix process completed!', 'success');
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  log('🛑 Process interrupted by user', 'warning');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('🛑 Process terminated', 'warning');
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = {
  main,
  fixProductionHMR,
  fixDevelopmentHMR,
  createProxyConfig,
};
