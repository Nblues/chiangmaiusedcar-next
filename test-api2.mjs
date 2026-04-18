import { getAllCars } from './lib/shopify.mjs';

async function run() {
  try {
    console.log('Fetching cars from shopify.mjs...');
    const cars = await getAllCars();
    console.log('Total cars:', cars?.length);
    if (cars && cars.length > 0) {
      console.log('Sample format of first car:', {
        id: cars[0].id,
        title: cars[0].title,
        handle: cars[0].handle,
        updatedAt: cars[0].updatedAt
      });
    }
  } catch (error) {
    console.error('Error fetching cars:', error);
  }
}
run();