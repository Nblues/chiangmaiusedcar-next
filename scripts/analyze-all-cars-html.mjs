import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());
const filePath = path.join(repoRoot, 'all-cars.html');

if (!fs.existsSync(filePath)) {
  console.error(`Missing file: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');

const count = (re) => (raw.match(re) || []).length;

const imgTags = count(/<img\b/gi);
const imgWithSrc = count(/<img[^>]*\ssrc=/gi);
const jsonLdScripts = count(/application\/ld\+json/gi);
const itemListMentions = count(/"@type"\s*:\s*"ItemList"/g);
const productMentions = count(/"@type"\s*:\s*"Product"/g);

const srcs = [];
const srcRe = /<img[^>]*\ssrc="([^"]+)"/gi;
let match;
while ((match = srcRe.exec(raw)) && srcs.length < 20) {
  srcs.push(match[1]);
}

console.log(JSON.stringify({
  filePath,
  bytes: Buffer.byteLength(raw, 'utf8'),
  imgTags,
  imgWithSrc,
  jsonLdScripts,
  itemListMentions,
  productMentions,
  sampleImgSrc: srcs,
}, null, 2));
