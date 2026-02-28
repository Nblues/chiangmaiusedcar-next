const fs = require('fs');
const file = 'lib/shopify.mjs';
let content = fs.readFileSync(file, 'utf8');

const queries = [];
let queryCount = 0;

// The queries are mostly defined as:
// const query = `
//   query ...`

const matches = [];
const regex = /const query = `([\s\S]*?)`;/g;
let match;

while ((match = regex.exec(content)) !== null) {
  matches.push({
    full: match[0],
    inner: match[1],
    index: match.index,
  });
}

const names = [
  'AdminSpecByIdsQuery',
  'AllProductsQuery',
  'CarSpecsByHandlesQuery',
  'HomepageProductsQuery',
  'BrandCountsQuery',
  'CarByHandleQuery',
];

let queriesExports = `// Auto-generated export of Shopify GraphQL queries\n\n`;

matches.forEach((m, idx) => {
  const name = names[idx];
  if (!name) return;

  queriesExports += `export const ${name} = \`${m.inner}\`;\n\n`;
  content = content.replace(m.full, `const query = ${name};`);
});

fs.writeFileSync('lib/shopify/queries.mjs', queriesExports);
fs.writeFileSync(file, content);

// Add import for queries
let lines = fs.readFileSync(file, 'utf8').split('\n');
lines.splice(9, 0, `import { ${names.join(', ')} } from './shopify/queries.mjs';`);
fs.writeFileSync(file, lines.join('\n'));

console.log('Queries extracted successfully!');
