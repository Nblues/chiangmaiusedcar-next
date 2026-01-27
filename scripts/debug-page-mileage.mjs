import 'dotenv/config';
import { getAllCars } from '../lib/shopify.mjs';

const page = Number(process.argv[2] || 3);
const url = `http://127.0.0.1:3000/all-cars?page=${page}`;

const cars = await getAllCars();

const res = await fetch(url);
const html = await res.text();

const re = /\/car\/([^"?#]+)(?:\?|"|#)/g;
const handles = [];
let match;
while ((match = re.exec(html))) {
  const handle = decodeURIComponent(match[1]);
  if (!handles.includes(handle)) handles.push(handle);
}

console.log(JSON.stringify({ page, status: res.status, handles: handles.length }));

for (const handle of handles) {
  const car = cars.find(x => x.handle === handle);
  const description = String(car?.description || '');
  console.log(
    JSON.stringify({
      handle,
      year: car?.year ?? null,
      mileage: car?.mileage ?? null,
      descHasMileageToken: description.includes('ไมล์') || description.includes('เลขไมล์'),
    })
  );
}
