const fs=require('fs');
let c=fs.readFileSync('app/admin/valuation/page.tsx', 'utf8');
let html=fs.readFileSync('hero.txt','utf8');
c=c.replace(/<div className="min-h-screen bg-\[\#f8f9fa\] p-4 sm:p-6 lg:p-8 font-thai">[\s\S]*?(?=<div className="h-2 w-full bg-gradient-to-r)/, html);
fs.writeFileSync('app/admin/valuation/page.tsx', c);
console.log('Done!');
