import { getCarByHandle } from './lib/shopify.mjs';

async function test() {
  const product = await getCarByHandle('honda-cr-v-2-0-s-4wd-2016-1'); 
  console.log("BRAND:", product.brand);
  console.log("VENDOR:", product.vendor);
  console.log("DESC LENGTH:", product.description?.length);
  console.log("DESC PREVIEW:", product.description?.substring(0, 50));
}

test();
