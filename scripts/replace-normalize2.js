const fs = require('fs');
const file = 'lib/shopify.mjs';
let content = fs.readFileSync(file, 'utf8');

const regex = /const getAny = [\s\S]*?(?=return \{)/g;
let i = 0;
content = content.replace(regex, (match) => {
  i++;
  console.log('Replacing match', i, 'Length:', match.length);
  return `const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);\n\n      `;
});

// Add import if not present
if (!content.includes('normalizeCarSpec')) {
  content = content.replace(
    /import \{ hasValue, metafieldsToList, specFromMetafields \} from '\.\/shopify\/helpers\/parsers\.mjs';/,
    `import { hasValue, metafieldsToList, specFromMetafields } from './shopify/helpers/parsers.mjs';\nimport { normalizeCarSpec } from './shopify/helpers/normalize.mjs';`
  );
}

fs.writeFileSync(file, content);
console.log('Done replacement');
