#!/usr/bin/env node

/**
 * Script to help setup Vercel Environment Variables
 * This script provides the exact commands to run
 */

console.log('🔧 Vercel Environment Variables Setup\n');

console.log('📋 Run these commands in your terminal:\n');

const envVars = [
  {
    name: 'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
    value: 'service_qlcksif',
  },
  {
    name: 'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
    value: 'template_zd6e3f6',
  },
  {
    name: 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
    value: 'P3wnNJB_Y_PddrdBJ',
  },
];

envVars.forEach((env, index) => {
  console.log(`${index + 1}. vercel env add ${env.name} production`);
  console.log(`   Enter value: ${env.value}\n`);
});

console.log('🚀 After setting all variables, redeploy:');
console.log('   vercel --prod\n');

console.log('🌐 Or set via Vercel Dashboard:');
console.log(
  '   https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-next/settings/environment-variables\n'
);

console.log('✅ Expected result after setup:');
console.log(
  '   EmailJS config: {serviceId: "service_qlcksif", templateId: "template_zd6e3f6", publicKey: "SET"}'
);
