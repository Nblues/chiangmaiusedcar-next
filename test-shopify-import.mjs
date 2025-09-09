// Test direct import of shopify functions
import { getAllCars, getHomepageCars, getCarByHandle } from './lib/shopify.mjs';

console.log('Testing shopify imports...');
console.log('getAllCars:', typeof getAllCars);
console.log('getHomepageCars:', typeof getHomepageCars);
console.log('getCarByHandle:', typeof getCarByHandle);

// Test call
async function testApi() {
  try {
    console.log('Testing getHomepageCars...');
    const cars = await getHomepageCars(3);
    console.log('Cars fetched:', cars?.length || 0);
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testApi();
