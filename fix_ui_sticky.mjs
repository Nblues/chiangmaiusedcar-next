
import fs from "fs";
let c = fs.readFileSync("app/admin/valuation/page.tsx", "utf8");

// Table Header for "จัดการ"
c = c.replace(/<TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-center">\s*จัดการ\s*<\/TableHead>/g, `<TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-100">
                            จัดการ
                          </TableHead>`);

// Table Cell for buttons in compact table
c = c.replace(/<TableCell className="whitespace-nowrap px-6 py-3 text-center">/g, `<TableCell className="whitespace-nowrap px-6 py-3 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-50/50">`);

// Table Cell for buttons in full table
c = c.replace(/<TableCell className="whitespace-nowrap px-6 py-4 text-center">/g, `<TableCell className="whitespace-nowrap px-6 py-4 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-50/50">`);

fs.writeFileSync("app/admin/valuation/page.tsx", c);
console.log("Replaced sticky");

