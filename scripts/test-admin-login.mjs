// Quick local test for admin login endpoint
// Usage: node scripts/test-admin-login.mjs
import http from 'http';

const payload = JSON.stringify({
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'changeme123',
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = http.request(options, res => {
  const cookies = res.headers['set-cookie'] || [];
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Set-Cookie:', cookies);
    try {
      console.log('Body:', JSON.parse(data));
    } catch {
      console.log('Body:', data);
    }
  });
});

req.on('error', err => {
  console.error('Request error:', err.message);
});

req.write(payload);
req.end();
