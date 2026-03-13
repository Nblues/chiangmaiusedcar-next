const { execFileSync } = require('child_process');
const fs = require('fs');

// Read the key value
const apiKey = 'AIzaSyDvV6AhitPTR1hdmI6_WXay591Pt3gz_NU';

// Write to a temp file for stdin
fs.writeFileSync('tmp_env_val.txt', apiKey + '\n');

try {
  // Using vercel CLI via node
  const result = execFileSync('cmd', ['/c', 'type tmp_env_val.txt | vercel env add GEMINI_API_KEY production --force'], { encoding: 'utf8', timeout: 30000 });
  console.log('Success:', result);
} catch (err) {
  console.error('Error:', err.stdout || err.message);
}
