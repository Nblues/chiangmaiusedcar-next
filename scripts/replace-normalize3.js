// Custom script for safe, targeted replacements
const fs = require('fs');

let c = fs.readFileSync('lib/shopify.mjs', 'utf8');

// 1. getAllCars
c = c.replace(
  /const getAny = keys => \{\s*for \(const k of keys\) \{\s*if \(hasValue\(mergedSpec\[k\]\)\) return mergedSpec\[k\];\s*\}\s*return null;\s*\};\s*\/\/ Prefer Shopify metafields[\s\S]*?bodyType:\s*'ประเภทตัวถัง',\s*\]\);/m,
  `const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);`
);

// 2. getCarSpecsByHandles
c = c.replace(
  /const getAny = keys => \{\s*for \(const k of keys\) \{\s*if \(hasValue\(mergedSpec\[k\]\)\) return mergedSpec\[k\];\s*\}\s*return null;\s*\};\s*const parsed = parseCarData\(\{[\s\S]*?const model = getAny\(\['model', 'รุ่น'\]\);\s*if \(hasValue\(brand\)\) payload\.brand = brand;\s*if \(hasValue\(model\)\) payload\.model = model;/m,
  `const parsed = parseCarData({
        id: item.id,
        handle: item.handle,
        title: item.title || '',
        description: item.description || '',
        vendor: item.vendor || undefined,
        productType: item.productType || undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
      });

      const payload = {};
      const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, item.vendor);

      if (hasValue(year)) payload.year = year;
      if (hasValue(mileage)) payload.mileage = mileage;
      if (hasValue(transmission)) payload.transmission = transmission;
      if (hasValue(drivetrain)) {
        payload.drivetrain = drivetrain;
        payload.drive_type = drivetrain;
      }
      if (hasValue(fuelType)) {
        payload.fuelType = fuelType;
        payload.fuel_type = fuelType;
      }
      if (hasValue(installment)) payload.installment = installment;
      if (hasValue(category)) payload.category = category;
      if (hasValue(bodyType)) payload.body_type = bodyType;
      if (hasValue(brand)) payload.brand = brand;
      if (hasValue(model)) payload.model = model;`
);

// 3. getHomepageCars
c = c.replace(
  /const getAny = keys => \{\s*for \(const k of keys\) \{\s*if \(hasValue\(mergedSpec\[k\]\)\) return mergedSpec\[k\];\s*\}\s*return null;\s*\};\s*\/\/ Prefer Shopify metafields[\s\S]*?bodyType:\s*'ประเภทตัวถัง',\s*\]\);/m,
  `const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);`
);

// 4. getCarByHandle
c = c.replace(
  /const getAny = keys => \{\s*for \(const k of keys\) \{\s*if \(hasValue\(mergedSpec\[k\]\)\) return mergedSpec\[k\];\s*\}\s*return null;\s*\};\s*\/\/ Strict: show specs ONLY[\s\S]*?bodyType:\s*'ประเภทตัวถัง',\s*\]\);/m,
  `const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);`
);

const importStr = `import { normalizeCarSpec } from './shopify/helpers/normalize.mjs';\n`;
if (!c.includes('normalizeCarSpec')) {
  let lines = c.split('\n');
  lines.splice(8, 0, `import { normalizeCarSpec } from './shopify/helpers/normalize.mjs';`);
  c = lines.join('\n');
}

fs.writeFileSync('lib/shopify.mjs', c);
console.log('done replacements');
