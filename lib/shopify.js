/* eslint-disable @typescript-eslint/no-require-imports */
// This file is intentionally CommonJS to support Node scripts using `require('../lib/shopify')`.
// It proxies to the real ESM implementation in `lib/shopify.mjs` to avoid accidental mock data.

const path = require('path');
const { pathToFileURL } = require('url');

let shopifyModulePromise = null;

function loadShopifyModule() {
  if (!shopifyModulePromise) {
    const shopifyModuleUrl = pathToFileURL(path.join(__dirname, './shopify.mjs')).href;
    shopifyModulePromise = import(shopifyModuleUrl);
  }
  return shopifyModulePromise;
}

async function getAllCars(...args) {
  const mod = await loadShopifyModule();
  return mod.getAllCars(...args);
}

module.exports = {
  getAllCars,
};
