import React, { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ overlay = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="md:hidden p-3">
        <svg
          className={`w-8 h-8 ${overlay ? "text-white" : "text-primary"}`}
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col gap-0 items-center justify-start bg-blue-600 text-white text-xl animate-slideIn overflow-y-auto h-full px-0 py-0 w-full"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-4xl"
              aria-label="ปิดเมนู"
            >
              &times;
            </button>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="หน้าแรก รถมือสองเชียงใหม่ ครูหนึ่งรถสวย"
              title="กลับหน้าแรก รถมือสองเชียงใหม่ ครูหนึ่งรถสวย"
              className="w-full text-center py-5 border-b border-white/20 hover:bg-accent hover:text-primary transition-all duration-200 text-sm md:text-base font-semibold gap-6"
            >
              หน้าแรก | รถมือสองเชียงใหม่
            </Link>
            <Link
              href="/all-cars"
              onClick={() => setOpen(false)}
              aria-label="รถทั้งหมด ฟรีดาวน์ ผ่อนถูก ครูหนึ่งรถสวย"
              title="ดูรถมือสองเชียงใหม่ทั้งหมด ฟรีดาวน์ ผ่อนถูก"
              className="w-full text-center py-5 border-b border-white/20 hover:bg-accent hover:text-primary transition-all duration-200 text-sm md:text-base font-semibold gap-6"
            >
              รถทั้งหมด | ฟรีดาวน์ ผ่อนถูก
            </Link>
            <Link
              href="/promotion"
              onClick={() => setOpen(false)}
              aria-label="โปรโมชัน รถมือสอง ครูหนึ่งรถสวย"
              title="โปรโมชัน รถมือสองเชียงใหม่ ครูหนึ่งรถสวย"
              className="w-full text-center py-5 border-b border-white/20 hover:bg-accent hover:text-primary transition-all duration-200 text-sm md:text-base font-semibold gap-6"
            >
              โปรโมชัน รถมือสอง
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              aria-label="ติดต่อ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
              title="ติดต่อ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
              className="w-full text-center py-5 border-b border-white/20 hover:bg-accent hover:text-primary transition-all duration-200 text-sm md:text-base font-semibold gap-6"
            >
              ติดต่อ ครูหนึ่งรถสวย
            </Link>
            <a
              href="https://lin.ee/cJuakxZ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full text-center py-5 font-bold bg-accent text-primary hover:bg-primary hover:text-white transition-all duration-200 border-b border-white/20 flex items-center justify-center gap-2"
              aria-label="สอบถามผ่าน LINE ครูหนึ่งรถสวย"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span>สอบถามเลย</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
