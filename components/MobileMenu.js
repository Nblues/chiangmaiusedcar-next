import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ overlay = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="md:hidden p-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 12H21"
            stroke={overlay ? '#0036A0' : '#0036A0'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 6H21"
            stroke={overlay ? '#0036A0' : '#0036A0'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 18H21"
            stroke={overlay ? '#0036A0' : '#0036A0'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-primary">เมนู</h2>
              <button onClick={() => setOpen(false)} className="p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="#0036A0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="#0036A0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="block py-2 px-4 text-primary hover:bg-gold/10 rounded"
                    onClick={() => setOpen(false)}
                  >
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <Link
                    href="/all-cars"
                    className="block py-2 px-4 text-primary hover:bg-gold/10 rounded"
                    onClick={() => setOpen(false)}
                  >
                    รถทั้งหมด
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promotion"
                    className="block py-2 px-4 text-primary hover:bg-gold/10 rounded"
                    onClick={() => setOpen(false)}
                  >
                    โปรโมชั่น
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="block py-2 px-4 text-primary hover:bg-gold/10 rounded"
                    onClick={() => setOpen(false)}
                  >
                    บทความ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block py-2 px-4 text-primary hover:bg-gold/10 rounded"
                    onClick={() => setOpen(false)}
                  >
                    ติดต่อเรา
                  </Link>
                </li>
              </ul>

              <div className="mt-6">
                <a
                  href="https://lin.ee/cJuakxZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gold text-black px-5 py-3 rounded-full font-bold text-center hover:bg-primary hover:text-white border-2 border-gold transition-all"
                >
                  สอบถามผ่าน LINE
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
