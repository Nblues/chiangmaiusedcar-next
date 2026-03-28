const fs = require("fs");
let file = "pages/used-cars-chiang-mai-brand/[brand].jsx";
let content = fs.readFileSync(file, "utf8");

const oldSEO = `      <SEO
        title={\`รถมือสอง \${brandInfo.label} เชียงใหม่ ฟรีดาวน์ ไมล์แท้\`}
        description={\`รวมรถมือสอง \${brandInfo.label} เชียงใหม่ สภาพนางฟ้า ฟรีดาวน์ ไมล์แท้ พร้อมตรวจสอบประวัติได้ \${totalCars} คัน คลิกดูรายละเอียดและโปรโมชั่นพิเศษได้เลย\`}
        url={url}`;

const newSEO = `      <SEO
        title={\`รถมือสอง \${brandInfo.label} เชียงใหม่ สภาพดี ฟรีดาวน์ ออกรถ 0 บาท\${safePage > 1 ? \` หน้า \${safePage}\` : ""}\`}
        description={\`รวมรถ \${brandInfo.label} มือสอง เชียงใหม่ สภาพนางฟ้า ไมล์แท้ ฟรีดาวน์ มีให้เลือก \${totalCars} คัน รับประกันเครื่องยนต์และเกียร์ ออกรถ 0 บาท ที่ครูหนึ่งรถสวย\`}
        url={url}`;

content = content.replace(oldSEO, newSEO);

fs.writeFileSync(file, content);
console.log("Brand SEO updated!");

