const url = process.argv[2] ?? 'http://localhost:3000/';

try {
  const res = await fetch(url);
  console.log('status', res.status);
  process.exitCode = res.ok ? 0 : 1;
} catch (err) {
  console.error('err', err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
}
