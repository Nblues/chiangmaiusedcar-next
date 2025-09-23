#!/usr/bin/env node

/**
 * Fix Vercel Environment Variables for Shopify API
 * Updates SHOPIFY_DOMAIN from incorrect .myshopify.com to correct .com
 */

const { execSync } = require('child_process');

console.log('🔧 Fixing Vercel Environment Variables...');
console.log('========================================');

const envVars = [
  {
    key: 'SHOPIFY_DOMAIN',
    value: 'kn-goodcar.com',
    description: 'Shopify store domain (corrected from .myshopify.com)',
  },
  {
    key: 'SHOPIFY_STOREFRONT_TOKEN',
    value: 'bb70cb008199a94b83c98df0e45ada67',
    description: 'Shopify Storefront API access token',
  },
];

try {
  console.log('📋 Environment variables to update:');
  envVars.forEach(env => {
    console.log(`  - ${env.key}: ${env.value}`);
    console.log(`    ${env.description}`);
  });

  console.log('\n🚀 Updating Vercel environment variables...');

  // Update each environment variable for production
  envVars.forEach(env => {
    const command = `vercel env add ${env.key} production`;
    console.log(`\n📝 Setting ${env.key}...`);
    console.log(`Command: ${command}`);
    console.log(`Value: ${env.value}`);

    try {
      // Note: This requires manual input in terminal
      console.log('⚠️  Manual step required:');
      console.log(`   Run: vercel env add ${env.key} production`);
      console.log(`   Enter value: ${env.value}`);
    } catch (error) {
      console.log(`❌ Failed to set ${env.key}: ${error.message}`);
    }
  });

  console.log('\n✅ Environment variable commands prepared!');
  console.log('\n📋 Manual steps to complete:');
  console.log('1. Run the commands above to set environment variables');
  console.log('2. Or go to Vercel Dashboard → Settings → Environment Variables');
  console.log('3. Update SHOPIFY_DOMAIN to: kn-goodcar.com');
  console.log('4. Redeploy with: vercel --prod');
} catch (error) {
  console.error('❌ Error updating environment variables:', error.message);
  process.exit(1);
}
