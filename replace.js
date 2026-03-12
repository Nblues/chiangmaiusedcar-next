const fs=require('fs');
let c=fs.readFileSync('app/admin/valuation/page.tsx','utf8');
c=c.replace(/<div className="min-h-screen bg-\[\#f8f9fa\] p-4 sm:p-6 lg:p-8 font-thai">[\s\S]*?(?=<div className="h-2 w-full bg-gradient-to-r)/, \<div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-thai antialiased selection:bg-accent selection:text-white">
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
                ประเมินราคากลางรถมือสอง
                <br className="hidden sm:block md:hidden" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
                  มาตรฐานประเทศไทย
                </span>
              </h1>
              <p className="text-slate-300 tracking-wide text-sm md:text-base font-light max-w-xl leading-relaxed">
                วิเคราะห์โครงสร้างราคาด้วย{' '}
                <span className="font-semibold text-accent">Google AI</span> เที่ยงตรงและแม่นยำ สำหรับศูนย์รถยนต์ชั้นนำ
              </p>
            </div>
          </div>
          <div className="relative z-10 hidden lg:flex items-center whitespace-nowrap bg-white/5 text-white border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full font-medium shadow-xl tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            ระบบสำหรับผู้บริหาร
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">
          {/* Input Section - 4/12 width on Desktop */}
          <div className="lg:col-span-4 h-full">
            <Card className="h-full shadow-xl shadow-slate-200/50 border border-slate-100 rounded-[2rem] bg-white/95 backdrop-blur-xl overflow-hidden flex flex-col">
              \
);
fs.writeFileSync('app/admin/valuation/page.tsx', c);
