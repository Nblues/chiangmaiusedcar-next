const fs = require('fs');

let c = fs.readFileSync('lib/shopify.mjs', 'utf8');

c = c.replace(/const metafieldRefSelection = `[\s\S]*?\n    }\n  `;/g, '');

fs.writeFileSync('lib/shopify.mjs', c);
