const fs = require('fs');

let c = fs.readFileSync('lib/shopify.mjs', 'utf8');

const regex = /const query = `([\s\S]*?)`;/g;
let match;
const matches = [];

while ((match = regex.exec(c)) !== null) {
  matches.push({
    full: match[0],
    inner: match[1]
  });
}

// 1. AdminSpecByIdsQuery (line 42) - no vars
// 2. AllProductsQuery - no template vars inside
// 3. CarSpecsByHandlesQuery - uses ${varDefs} and ${fields}
// 4. HomepageProductsQuery - uses ${limitNum} 
// 5. BrandCountsQuery - no template vars
// 6. CarByHandleQuery - uses ${handle}

const mjs = `// Auto-generated Shopify GraphQL queries
import { metafieldRefSelection } from './helpers/parsers.mjs';

export const AdminSpecByIdsQuery = \`${matches[0]?.inner || ''}\`;

export const AllProductsQuery = \`${matches[1]?.inner || ''}\`;

export const getCarSpecsByHandlesQuery = (varDefs, fields) => \`${matches[2]?.inner?.replace(/\$\{varDefs\}/g, '\\${varDefs}').replace(/\$\{fields\}/g, '\\${fields}')}\`;

export const getHomepageProductsQuery = (limitNum) => \`${matches[3]?.inner?.replace(/\$\{limitNum\}/g, '\\${limitNum}')}\`;

export const BrandCountsQuery = \`${matches[4]?.inner || ''}\`;

export const getCarByHandleQuery = (handle) => \`${matches[5]?.inner?.replace(/\$\{handle\}/g, '\\${handle}')}\`;
`;

fs.writeFileSync('lib/shopify/queries.mjs', mjs);

// Now replace in lib/shopify.mjs

c = c.replace(matches[0].full, 'const query = AdminSpecByIdsQuery;');
c = c.replace(matches[1].full, 'const query = AllProductsQuery;');
c = c.replace(matches[2].full, 'const query = getCarSpecsByHandlesQuery(varDefs, fields);');
c = c.replace(matches[3].full, 'const query = getHomepageProductsQuery(limitNum);');
c = c.replace(matches[4].full, 'const query = BrandCountsQuery;');
c = c.replace(matches[5].full, 'const query = getCarByHandleQuery(handle);');


let lines = c.split('\n');
lines.splice(9, 0, `import { AdminSpecByIdsQuery, AllProductsQuery, getCarSpecsByHandlesQuery, getHomepageProductsQuery, BrandCountsQuery, getCarByHandleQuery } from './shopify/queries.mjs';`);
fs.writeFileSync('lib/shopify.mjs', lines.join('\n'));

console.log('Queries completely extracted!');
