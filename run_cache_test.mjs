import { getCarByHandle } from './lib/shopify.mjs';

async function run() {
  console.log('Fetching handle car...');
  console.time('Fetch 1');
  const c1 = await getCarByHandle('รถมือสอง-honda-city-1-0-turbo-sv-ปี-2021');
  console.timeEnd('Fetch 1');
  console.log('1 done:', !!c1);
  
  console.time('Fetch 2');
  const c2 = await getCarByHandle('รถมือสอง-honda-city-1-0-turbo-sv-ปี-2021');
  console.timeEnd('Fetch 2');
  console.log('2 done (Cached):', !!c2);
}

run().catch(console.error);
