
import fs from "fs";
let c = fs.readFileSync("app/admin/valuation/page.tsx", "utf8");

// Tweak Results Cards and inner layouts
c = c.replace(/className="h-full relative overflow-hidden bg-white\/50 border border-slate-200 shadow-xl shadow-slate-200\/40 rounded-\[2rem\] backdrop-blur-xl flex flex-col"/g, `className="h-full relative overflow-hidden bg-white/80 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] backdrop-blur-2xl flex flex-col"`);

// Same for the bottom full history card
c = c.replace(/className="relative overflow-hidden bg-white\/50 border border-slate-200 shadow-xl shadow-slate-200\/40 rounded-\[2rem\] backdrop-blur-xl"/g, `className="relative overflow-hidden bg-white/80 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] backdrop-blur-2xl"`);

// Results section header text
c = c.replace(/<h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">/g, `<h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">`);

fs.writeFileSync("app/admin/valuation/page.tsx", c);
console.log("Replaced cards");

