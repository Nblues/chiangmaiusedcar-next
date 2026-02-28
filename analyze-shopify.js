
const fs = require('fs');
const code = fs.readFileSync('lib/shopify.mjs', 'utf8');

// Basic AST check using a simple regex since babel isn't loaded
const funcs = code.match(/export async function (\w+)/g);
console.log('Exported Functions:', funcs);

