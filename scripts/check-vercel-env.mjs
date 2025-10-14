#!/usr/bin/env node
/**
 * Check if required environment variables are set on Vercel
 * Usage: node scripts/check-vercel-env.mjs
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const REQUIRED_VARS = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'SESSION_SECRET'];

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

async function checkVercelCLI() {
  try {
    await execAsync('vercel --version');
    return true;
  } catch {
    return false;
  }
}

async function getVercelEnvVars() {
  try {
    const { stdout } = await execAsync('vercel env ls');
    return stdout;
  } catch (error) {
    throw new Error(`Failed to get Vercel env vars: ${error.message}`);
  }
}

async function main() {
  log(COLORS.blue, '\n🔍 Checking Vercel Environment Variables...\n');

  // Check if Vercel CLI is installed
  const hasVercelCLI = await checkVercelCLI();

  if (!hasVercelCLI) {
    log(COLORS.yellow, '⚠️  Vercel CLI not installed');
    log(COLORS.yellow, '   Install: npm i -g vercel or pnpm add -g vercel\n');
    log(COLORS.blue, '📖 Manual check instead:');
    log(COLORS.blue, '   1. Go to https://vercel.com/dashboard');
    log(COLORS.blue, '   2. Select your project');
    log(COLORS.blue, '   3. Settings → Environment Variables');
    log(COLORS.blue, '   4. Check if these exist:\n');
    REQUIRED_VARS.forEach(varName => {
      log(COLORS.blue, `      • ${varName}`);
    });
    log(COLORS.yellow, '\n   If missing, follow: VERCEL_ENV_QUICK_SETUP.md\n');
    return;
  }

  // Get environment variables from Vercel
  log(COLORS.blue, 'Fetching environment variables from Vercel...\n');

  try {
    const envOutput = await getVercelEnvVars();

    // Check each required variable
    const results = {};
    REQUIRED_VARS.forEach(varName => {
      results[varName] = envOutput.includes(varName);
    });

    // Display results
    log(COLORS.blue, '📊 Results:\n');

    let allPresent = true;
    REQUIRED_VARS.forEach(varName => {
      if (results[varName]) {
        log(COLORS.green, `   ✅ ${varName} - Found`);
      } else {
        log(COLORS.red, `   ❌ ${varName} - Missing`);
        allPresent = false;
      }
    });

    console.log('');

    if (allPresent) {
      log(COLORS.green, '✅ All required environment variables are set!\n');
      log(COLORS.blue, '🚀 Next steps:');
      log(COLORS.blue, '   1. Make sure the values are correct');
      log(COLORS.blue, '   2. Redeploy if you just added them');
      log(COLORS.blue, '   3. Test login at https://www.chiangmaiusedcar.com/admin/login\n');
    } else {
      log(COLORS.red, '❌ Missing required environment variables!\n');
      log(COLORS.yellow, '📖 Follow the setup guide:');
      log(COLORS.yellow, '   • Quick: VERCEL_ENV_QUICK_SETUP.md');
      log(COLORS.yellow, '   • Detailed: VERCEL_ENV_VARIABLES_REQUIRED.md\n');
    }
  } catch (error) {
    log(COLORS.red, `\n❌ Error: ${error.message}\n`);
    log(COLORS.yellow, '💡 Try running: vercel login');
    log(COLORS.yellow, '   Then link your project: vercel link\n');
  }
}

main().catch(error => {
  log(COLORS.red, `\n❌ Unexpected error: ${error.message}\n`);
  process.exit(1);
});
