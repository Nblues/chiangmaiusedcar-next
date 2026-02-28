const fs = require('fs');
const file = 'pages/car/[handle].jsx';
let pt = fs.readFileSync(file, 'utf8');

const regex = /const recommendedCars = safeCars\s*\.filter\([\s\S]*?\}\);/m;

const newLogic = `const currentCategory = (car.category || car.body_type || '').toLowerCase().trim();
    const currentModel = (car.model || '').toLowerCase().trim();

    const recommendedCars = safeCars
      .filter(
        c =>
          c &&
          c.handle !== car.handle &&
          c.availableForSale !== false &&
          c.price?.amount &&
          Number(c.price.amount) > 0
      )
      .map(c => {
        let score = 0;
        const carPrice = Number(c.price.amount);
        const carBrand = c.vendor || c.brand || '';
        const carYear = Number(c.year) || 0;
        const carCategory = (c.category || c.body_type || '').toLowerCase().trim();
        const carModel = (c.model || '').toLowerCase().trim();

        // 1. คะแนนตามประเภทซ้ำกัน (สำคัญที่สุด)
        if (currentCategory && carCategory) {
          if (carCategory === currentCategory) {
            score += 1500;
          } else if (currentCategory.includes(carCategory) || carCategory.includes(currentCategory)) {
            score += 800; // ใกล้เคียงกัน เช่น SUV กับ Mini SUV
          }
        }

        // 2. คะแนนรุ่นรถ (Model) ตรงกัน
        if (carModel && currentModel && carModel === currentModel) {
          score += 600;
        }

        // 3. คะแนนยี่ห้อ (Brand) ตรงกัน 
        if (carBrand && currentBrand && carBrand.toLowerCase() === currentBrand.toLowerCase()) {
          score += 300;
        }

        // 4. คะแนนราคา (ใกล้เคียงดีกว่า - ห่างกัน 100% คะแนนจะเป็น 0)
        const priceDiff = Math.abs(carPrice - currentPrice);
        const priceScore = currentPrice > 0 ? Math.max(0, 500 - (priceDiff / currentPrice) * 500) : 0;
        score += priceScore;

        // 5. คะแนนตามปี (ใกล้เคียงดีกว่า - ห่างกัน 1 ปี โดนหัก 30)
        if (currentYear > 0 && carYear > 0) {
          const yearDiff = Math.abs(carYear - currentYear);
          const yearScore = Math.max(0, 200 - yearDiff * 30);
          score += yearScore;
        }

        return { ...c, similarityScore: score };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 4)
      // ส่งเฉพาะฟิลด์ที่จำเป็นไปยัง client เพื่อลด payload
      .map(c => ({
        id: c.id,
        status: carStatuses?.[c.id]?.status || 'available',
        tags: Array.isArray(c.tags) ? c.tags : [],
        handle: c.handle,
        title: c.title,
        vendor: c.vendor || c.brand,
        brand: c.brand,
        category: c.category || c.body_type || null,
        year: c.year,
        mileage: c.mileage,
        transmission: c.transmission,
        installment: c.installment,
        fuelType: c.fuelType || c.fuel_type,
        fuel_type: c.fuel_type || c.fuelType,
        price: { amount: Number(c.price.amount) },
        images: Array.isArray(c.images) && c.images.length > 0 ? [{ url: c.images[0].url }] : [],
      }));`;

let newCode = pt.replace(regex, newLogic);
if(newCode === pt) {
  console.log("REPLACE FAILED!");
} else {
  fs.writeFileSync(file, newCode, 'utf8');
  console.log("REPLACE SUCCESS!");
}
