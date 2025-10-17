// Simple URL probe: prints status, content-type, and first 400 chars of body
// Usage: node dev/scripts/probe-urls.mjs <url1> <url2> ...

const urls = process.argv.slice(2);
if (urls.length === 0) {
  process.stderr.write('Usage: node dev/scripts/probe-urls.mjs <url1> <url2> ...\n');
  process.exit(1);
}

async function probe(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    const ct = res.headers.get('content-type') || '';
    const text = await res.text();
    const body = text.length > 400 ? text.slice(0, 400) + '...' : text;
    process.stdout.write(`URL: ${url}\n`);
    process.stdout.write(`Status: ${res.status}\n`);
    process.stdout.write(`Content-Type: ${ct}\n`);
    try {
      const json = JSON.parse(text);
      process.stdout.write(`Parsed JSON keys: ${Object.keys(json).join(', ')}\n`);
      if (json.host || json.vercelUrl || json.vercelId) {
        process.stdout.write(
          `host: ${json.host || ''} vercelUrl: ${json.vercelUrl || ''} vercelId: ${json.vercelId || ''}\n`
        );
      }
    } catch {
      process.stdout.write(`Body: ${body}\n`);
    }
    process.stdout.write('---\n');
  } catch (err) {
    process.stdout.write(`URL: ${url}\n`);
    process.stdout.write(`Error: ${err.message}\n`);
    process.stdout.write('---\n');
  }
}

Promise.all(urls.map(probe)).then(() => process.exit(0));
