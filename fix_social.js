const fs = require('fs');
const p = 'components/UsedCarsChiangMaiDeferred.jsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/aria-label="ติดตาม Facebook เพจหลัก ครูหนึ่งรถสวย"/g, '');
c = c.replace(/aria-label="เข้าร่วม Facebook กลุ่ม FC ครูหนึ่งรถสวย"/g, '');
c = c.replace(/aria-label="ติดตาม TikTok ครูหนึ่งรถสวย"/g, '');
c = c.replace(/aria-label="ติดตาม YouTube วิดีโอรีวิว ครูหนึ่งรถสวย"/g, '');
c = c.replace(/aria-label="ติดตาม Lemon8 ครูหนึ่งรถสวย"/g, '');
c = c.replace(/aria-label="แชท LINE ครูหนึ่งรถสวย"/g, '');

c = c.replace(/text-blue-500/g, 'text-blue-700');
c = c.replace(/text-red-600/g, 'text-red-700');
// text-yellow-500 is used on bg for the icon, leave it if it's text-white on yellow
// Wait, the SVG has text-white. So text-yellow-500 is the bg-yellow-500. No, text-yellow-600 is used for text.
c = c.replace(/text-yellow-600/g, 'text-yellow-700');
c = c.replace(/text-green-600/g, 'text-green-700');

fs.writeFileSync(p, c);
