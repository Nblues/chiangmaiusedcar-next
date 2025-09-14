// Test script to check car descriptions
import { getAllCars } from './lib/shopify.mjs';

async function testDescriptions() {
  try {
    console.log('Fetching cars...');
    const cars = await getAllCars();
    
    console.log(`Found ${cars.length} cars`);
    
    // Find cars with descriptions
    const carsWithDesc = cars.filter(car => car.description && car.description.trim().length > 10);
    
    console.log(`Cars with descriptions: ${carsWithDesc.length}`);
    
    if (carsWithDesc.length > 0) {
      const car = carsWithDesc[0];
      console.log('\n=== EXAMPLE CAR ===');
      console.log('Title:', car.title);
      console.log('Handle:', car.handle);
      console.log('\n=== DESCRIPTION ===');
      console.log('Raw description:');
      console.log(JSON.stringify(car.description, null, 2));
      
      console.log('\n=== ANALYSIS ===');
      console.log('Length:', car.description.length);
      console.log('Has \\n:', car.description.includes('\n'));
      console.log('Has \\r\\n:', car.description.includes('\r\n'));
      console.log('Has \\r:', car.description.includes('\r'));
      
      // Count line breaks
      const newlines = (car.description.match(/\n/g) || []).length;
      const returns = (car.description.match(/\r/g) || []).length;
      console.log('\\n count:', newlines);
      console.log('\\r count:', returns);
      
      console.log('\n=== PROCESSED HTML ===');
      const processedHtml = car.description
        .replace(/\n/g, '<br />')
        .replace(/\r\n/g, '<br />')
        .replace(/\r/g, '<br />');
      
      console.log('After processing:');
      console.log(processedHtml);
    } else {
      console.log('No cars with substantial descriptions found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testDescriptions();