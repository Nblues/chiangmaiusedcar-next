
import fs from "fs";
let c = fs.readFileSync("app/admin/valuation/page.tsx", "utf8");

// Tweak the evaluate button inside Card to use modern styles
c = c.replace(/ผสานพลังข้อมูล Big Data/, "ผสานพลังข้อมูล Big Data & AI");

fs.writeFileSync("app/admin/valuation/page.tsx", c);
console.log("Replaced");

