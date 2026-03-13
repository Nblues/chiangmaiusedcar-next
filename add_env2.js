const { execFileSync } = require('child_process');
const fs = require('fs');
fs.writeFileSync('tmp_env_val.txt', 'AIzaSyDvV6AhitPTR1hdmI6_WXay591Pt3gz_NU\n');

for (const env of ['preview', 'development']) {
  try {
    const result = execFileSync('cmd', ['/c', 'type tmp_env_val.txt | vercel env add GEMINI_API_KEY ' + env + ' --force'], { encoding: 'utf8', timeout: 30000 });
    console.log(env + ':', result.trim());
  } catch (err) {
    console.log(env + ' error:', err.stdout || err.message);
  }
}

// Trigger redeploy
try {
  const result = execFileSync('vercel.cmd', ['--prod', '--force'], { encoding: 'utf8', timeout: 60000 });
  console.log('Deploy:', result.trim());
} catch (err) {
  console.log('Deploy result:', err.stdout || err.message);
}
