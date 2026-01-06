const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/fetch-json.mjs <url>');
  process.exit(2);
}

try {
  const res = await fetch(url);
  const text = await res.text();

  console.log('status', res.status);
  const contentType = res.headers.get('content-type') || '';
  console.log('content-type', contentType);

  // Print a safe preview (avoid huge output)
  const max = 8000;
  const preview = text.length > max ? text.slice(0, max) + `\n...truncated (${text.length} chars)` : text;
  console.log(preview);

  process.exitCode = res.ok ? 0 : 1;
} catch (err) {
  console.error('err', err instanceof Error ? err.message : String(err));
  process.exit(1);
}
