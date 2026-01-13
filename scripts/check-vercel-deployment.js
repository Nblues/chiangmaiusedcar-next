#!/usr/bin/env node

/**
 * Check Vercel deployment status and fetch build logs
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_NAME = 'chiangmaiusedcar-setup';
const TEAM_ID = 'chiangmaiusedcars-projects';

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable is required');
  process.exit(1);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
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
          reject(new Error(`Failed to parse JSON: ${data}`));
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
}

async function getDeployments() {
  try {
    console.log('🔍 Fetching recent deployments...\n');

    const response = await makeRequest(
      `/v6/deployments?teamId=${TEAM_ID}&projectId=${PROJECT_NAME}&limit=10`
    );

    if (response.error) {
      console.error('❌ Error:', response.error.message);
      return;
    }

    const deployments = response.deployments || [];

    console.log(`📦 Found ${deployments.length} recent deployments:\n`);

    for (const deployment of deployments) {
      const status =
        deployment.readyState === 'READY'
          ? '✅'
          : deployment.readyState === 'ERROR'
            ? '❌'
            : deployment.readyState === 'BUILDING'
              ? '🔨'
              : '⏳';

      const age = Math.round((Date.now() - deployment.createdAt) / (1000 * 60 * 60));
      const env = deployment.target || 'preview';

      console.log(
        `${status} ${deployment.readyState.padEnd(10)} | ${env.padEnd(10)} | ${age}h ago`
      );
      console.log(`   URL: ${deployment.url}`);
      console.log(`   ID:  ${deployment.uid}`);

      // Show error details if available
      if (deployment.readyState === 'ERROR') {
        console.log(`   🔍 Fetching build logs...`);
        try {
          const logs = await makeRequest(
            `/v1/deployments/${deployment.uid}/events?teamId=${TEAM_ID}`
          );

          if (logs && Array.isArray(logs)) {
            const errorLogs = logs.filter(
              log =>
                log.type === 'stderr' ||
                (log.payload &&
                  log.payload.text &&
                  log.payload.text.toLowerCase().includes('error'))
            );

            if (errorLogs.length > 0) {
              console.log(`   ⚠️  Error messages:`);
              errorLogs.slice(0, 5).forEach(log => {
                const text = log.payload?.text || log.text || '';
                if (text) {
                  console.log(`      ${text.substring(0, 150)}`);
                }
              });
            } else {
              console.log(`   ℹ️  No specific error messages found in logs`);
            }
          }
        } catch (e) {
          console.log(`   ⚠️  Could not fetch logs: ${e.message}`);
        }
      }

      console.log('');
    }

    // Summary
    const errorCount = deployments.filter(d => d.readyState === 'ERROR').length;
    const readyCount = deployments.filter(d => d.readyState === 'READY').length;

    console.log('\n📊 Summary:');
    console.log(`   ✅ Ready: ${readyCount}`);
    console.log(`   ❌ Error: ${errorCount}`);
    console.log(`   🔨 Building/Other: ${deployments.length - errorCount - readyCount}`);

    if (errorCount > 0) {
      console.log('\n💡 Tip: Check the Vercel dashboard for detailed build logs:');
      console.log(`   https://vercel.com/${TEAM_ID}/${PROJECT_NAME}`);
    }
  } catch (error) {
    console.error('❌ Error fetching deployments:', error.message);
    process.exit(1);
  }
}

getDeployments();
