// Probe production admin login endpoints using Node fetch
// Usage: node dev/scripts/probe-login.mjs [baseUrl]

const baseUrl = process.argv[2] || 'https://www.chiangmaiusedcar.com';
const username = 'kngoodcar';
const password = 'Kn-goodcar**5277';

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify(body),
    redirect: 'manual',
  });
  let text = '';
  try {
    text = await res.text();
  } catch {}
  return { status: res.status, headers: Object.fromEntries(res.headers), body: text };
}

(async () => {
  console.log(`Base URL: ${baseUrl}`);
  console.log('--- DEBUG-LOGIN ---');
  try {
    const d = await postJson(`${baseUrl}/api/admin/debug-login`, { username, password });
    console.log('Status:', d.status);
    console.log('Headers:', d.headers);
    console.log('Body:', d.body);
  } catch (e) {
    console.error('Debug-login error:', e.message);
  }

  console.log('\n--- LOGIN ---');
  try {
    const d = await postJson(`${baseUrl}/api/admin/login`, { username, password });
    console.log('Status:', d.status);
    console.log('Set-Cookie:', d.headers['set-cookie']);
    console.log('Body:', d.body);
  } catch (e) {
    console.error('Login error:', e.message);
  }
})();
