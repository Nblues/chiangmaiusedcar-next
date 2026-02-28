const fs = require('fs');

let c = fs.readFileSync('lib/shopify.mjs', 'utf8');

// Function 1: getAllCars
let idx1 = c.indexOf('      const getAny = keys => {');
let end1 = c.indexOf('return {', idx1);
if (idx1 > -1 && end1 > -1) {
  let chunk = c.substring(idx1, end1);
  c = c.replace(chunk, `      const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);\n\n      `);
}

// Function 2: getCarSpecsByHandles
let idx2 = c.indexOf('      const getAny = keys => {', end1);
let marker2 = 'if (hasValue(model)) payload.model = model;';
let end2 = c.indexOf(marker2, idx2);
if (idx2 > -1 && end2 > -1) {
  let chunk = c.substring(idx2, end2 + marker2.length);
  c = c.replace(chunk, `      const parsed = parseCarData({
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
      if (hasValue(model)) payload.model = model;`);
}

// Function 3: getHomepageCars
let end3_idx = c.indexOf('return {', idx2);
let idx3 = c.indexOf('      const getAny = keys => {', end3_idx);
let end3 = c.indexOf('return {', idx3);
if (idx3 > -1 && end3 > -1) {
  let chunk = c.substring(idx3, end3);
  c = c.replace(chunk, `      const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);\n\n      `);
}

// Function 4: getCarByHandle
let idx4 = c.indexOf('    const getAny = keys => {', end3);
let end4 = c.indexOf('return {', idx4);
if (idx4 > -1 && end4 > -1) {
  let chunk = c.substring(idx4, end4);
  c = c.replace(chunk, `    const { year, mileage, transmission, drivetrain, fuelType, brand, model, installment, category, bodyType } = normalizeCarSpec(mergedSpec, parsed, n.vendor);\n\n    `);
}

if (!c.includes('normalizeCarSpec')) {
    let lines = c.split('\n');
    lines.splice(8, 0, `import { normalizeCarSpec } from './shopify/helpers/normalize.mjs';`);
    c = lines.join('\n');
}

fs.writeFileSync('lib/shopify.mjs', c);
console.log('done replacements');
