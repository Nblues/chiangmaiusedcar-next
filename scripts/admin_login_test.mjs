// Simple E2E test for admin login -> verify using Node 20 fetch
// Usage: node scripts/admin_login_test.mjs

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function main() {
  try {
    const loginRes = await fetch(`${BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'changeme123' }),
    });

    const setCookie = loginRes.headers.get('set-cookie') || '';
    const loginText = await loginRes.text();
    console.log('Login status:', loginRes.status);
    console.log('Set-Cookie header present:', Boolean(setCookie));
    if (loginRes.status >= 400) {
      console.log('Login response:', loginText);
      process.exit(1);
    }

    // Extract admin_session from Set-Cookie
    const match = setCookie.match(/admin_session=([^;]+)/);
    if (!match) {
      console.error('admin_session cookie not found in Set-Cookie');
      process.exit(1);
    }
    const adminSession = match[1];

    const verifyRes = await fetch(`${BASE}/api/admin/verify`, {
      headers: {
        Cookie: `admin_session=${adminSession}`,
      },
    });

    const verifyText = await verifyRes.text();
    console.log('Verify status:', verifyRes.status);
    console.log('Verify body:', verifyText);

    if (verifyRes.ok) {
      console.log('Auth flow OK ✅');
    } else {
      console.error('Auth flow FAILED ❌');
      process.exit(1);
    }
  } catch (err) {
    console.error('Test errored:', err);
    process.exit(1);
  }
}

main();
