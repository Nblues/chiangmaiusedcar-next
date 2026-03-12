
import fs from "fs";
let c = fs.readFileSync("app/admin/valuation/page.tsx", "utf8");

let newHero = `<div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-thai antialiased selection:bg-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Modern 2026 Hero Header */}
        <div className="relative overflow-hidden mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 via-primary-900 to-black p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 -mb-20 w-64 h-64 rounded-full bg-primary/30 blur-3xl mix-blend-screen pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 text-center sm:text-left">
            <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,152,0,0.2)] bg-white flex items-center justify-center p-3 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <picture>
                <source srcSet="/logo/logo_main_optimized.webp" type="image/webp" />
                <img
                  src="/logo/logo_main.png"
                  alt="โลโก้ ครูหนึ่งรถสวย"
                  className="object-contain w-full h-full scale-[1.15]"
                />
              </picture>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-md">
                ระบบประเมินราคากลางรถมือสอง
                <br className="hidden sm:block md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">มาตรฐาน 2026</span>
              </h1>
              <p className="text-slate-300 tracking-wide text-sm md:text-base font-light max-w-xl leading-relaxed">
                วิเคราะห์โครงสร้างราคาด้วยข้อมูล <span className="font-semibold text-accent">Real-time</span> ที่ล้ำสมัย แม่นยำที่สุดแห่งยุค
              </p>
            </div>
          </div>
          <div className="relative z-10 hidden lg:flex items-center whitespace-nowrap bg-white/5 text-white border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full font-medium shadow-xl tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            ส่วนงานผู้บริหาร
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">
          {/* Input Section - 4/12 width on Desktop */}
          <div className="lg:col-span-4 h-full">
            <Card className="h-full shadow-2xl shadow-indigo-50/50 border border-slate-200/60 rounded-[2rem] bg-white/95 backdrop-blur-2xl overflow-hidden flex flex-col">
              <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-500 to-accent"></div>`;

c = c.replace(/<div className="min-h-screen bg-\[\#f8f9fa\] p-4 sm:p-6 lg:p-8 font-thai">[\s\S]*?<div className="h-2 w-full bg-gradient-to-r from-\[\#1a237e\] to-\[\#ff9800\]"><\/div>/, newHero);

// Update title headers inside Card
c = c.replace(/<h2 className="text-xl font-bold text-\[\#1a237e\] mb-1 flex items-center">/g, `<h2 className="text-2xl font-black text-primary mb-1 flex items-center tracking-tight">`);

// Update the labels
c = c.replace(/className="block text-sm font-semibold text-gray-700 mb-2"/g, `className="block text-sm font-bold text-slate-700 mb-2 tracking-wide"`);

// Update selects/inputs
c = c.replace(/className="w-full bg-white border-2 border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-4 focus:ring-\[\#1a237e\]\/10 focus:border-\[\#1a237e\] transition-all shadow-sm py-3 px-4 outline-none hover:border-gray-300"/g, `className="w-full bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-primary/40 text-slate-800 text-[15px] font-medium rounded-2xl focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all duration-300 shadow-sm py-3.5 px-4 outline-none"`);

// Remove "bg-gradient-to-br from-[#1a237e] to-[#0d134a]" from evaluate button
c = c.replace(/className="w-full relative overflow-hidden group bg-gradient-to-br from-\[\#1a237e\] to-\[\#0d134a\] text-white rounded-xl py-4 flex items-center justify-center space-x-2 shadow-lg shadow-\[\#1a237e\]\/30 hover:shadow-xl hover:shadow-\[\#1a237e\]\/40 transition-all font-bold text-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"/g, `className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-blue-800 to-primary text-white rounded-2xl py-4 flex items-center justify-center space-x-3 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 font-bold text-lg hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"`);

// Update right panel header
c = c.replace(/<div className="absolute top-0 right-0 w-64 h-64 bg-\[\#ff9800\]\/5 rounded-full blur-3xl -z-10"><\/div>/, `<div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>`);
c = c.replace(/<div className="absolute bottom-0 left-0 w-64 h-64 bg-\[\#1a237e\]\/5 rounded-full blur-3xl -z-10"><\/div>/, `<div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>`);

fs.writeFileSync("app/admin/valuation/page.tsx", c);
console.log("Replaced");

