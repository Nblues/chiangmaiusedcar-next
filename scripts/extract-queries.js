const fs = require('fs');

const shopifyFile = 'lib/shopify.mjs';
let content = fs.readFileSync(shopifyFile, 'utf8');

// Match `const query = \`...\`;`
// Since they are inside functions, we can find them and replace them.

const queryNames = ['AdminSpecByIdsQuery', 'AllProductsQuery', 'CarSpecsByHandlesQuery', 'HomepageProductsQuery', 'BrandCountsQuery', 'CarByHandleQuery'];

// Actually, it's easier to create a queries file manually.
