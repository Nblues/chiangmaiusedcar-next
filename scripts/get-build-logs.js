#!/usr/bin/env node

/**
 * Get detailed build logs from Vercel deployment
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require('https');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Get deployment ID from command line or use latest error deployment
const deploymentId = process.argv[2] || 'dpl_Fdi8AjJ6qpHfYKefuSBJXRrAvJve';

// Read token from Vercel config
const authPath = path.join(process.env.USERPROFILE || process.env.HOME, '.vercel', 'auth.json');
let token = process.env.VERCEL_TOKEN;

if (!token && fs.existsSync(authPath)) {
  try {
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    token = auth.token;
  } catch {
    // Ignore
  }
}

if (!token) {
  console.error('❌ No Vercel token found. Set VERCEL_TOKEN environment variable.');
  process.exit(1);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}

async function getBuildLogs() {
  try {
    console.log(`๐Ÿ"  Fetching logs for deployment: ${deploymentId}\n`);

    // Get deployment events
    const events = await makeRequest(
      `/v1/deployments/${deploymentId}/events?teamId=chiangmaiusedcars-projects`
    );

    if (events.error) {
      console.error('โŒ Error:', events.error.message);
      return;
    }

    if (!Array.isArray(events)) {
      console.error('โŒ Unexpected response format');
      console.log(JSON.stringify(events, null, 2));
      return;
    }

    console.log(`๐Ÿ"Š Found ${events.length} events\n`);

    // Filter and display relevant events
    const buildEvents = events.filter(
      e =>
        e.type === 'stderr' ||
        e.type === 'stdout' ||
        e.type === 'command' ||
        (e.payload && (e.payload.text || e.payload.message))
    );

    if (buildEvents.length === 0) {
      console.log('โ„น๏ธ  No build logs found. Deployment may have failed before build started.');
      console.log('\n⚠️  Common causes:');
      console.log('   1. Build command configuration error');
      console.log('   2. Install command failed');
      console.log('   3. pnpm/npm installation issue');
      console.log('   4. Vercel project configuration problem');
      console.log('\n💡 Check Vercel Dashboard for more details:');
      console.log('   https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup');
      return;
    }

    console.log('📄 Build Events:\n');
    buildEvents.forEach((event, i) => {
      const text =
        (event.payload && (event.payload.text || event.payload.message)) || event.text || '';
      const type = event.type || 'unknown';
      const timestamp = event.created ? new Date(event.created).toLocaleTimeString() : '';

      console.log(`[${i + 1}] ${timestamp} [${type}]`);
      if (text) {
        console.log(`    ${text}`);
      }
      console.log('');
    });

    // Save to file
    const outputFile = 'vercel-build-logs.json';
    fs.writeFileSync(outputFile, JSON.stringify(events, null, 2));
    console.log(`\n๐Ÿ'พ Full logs saved to: ${outputFile}`);
  } catch (error) {
    console.error('โŒ Error fetching logs:', error.message);
    process.exit(1);
  }
}

getBuildLogs();
