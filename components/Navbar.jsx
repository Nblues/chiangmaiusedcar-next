import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/all-cars', label: 'รถทั้งหมด' },
  { href: '/about', label: 'เกี่ยวกับเรา' },
  { href: '/promotion', label: 'โปรโมชัน' },
  { href: '/blog', label: 'ข่าวสาร' },
  { href: '/contact', label: 'ติดต่อ' },
  { href: '/credit-check', label: 'เช็คเครดิต' },
  { href: '/payment-calculator', label: 'คำนวนค่างวด' },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = href => router.pathname === href;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold shadow-lg">
              <Image
                src="/logo/logo_main.png"
                alt="ครูหนึ่งรถสวย โลโก้"
                width={48}
                height={48}
                className="w-full h-full object-cover scale-125"
                priority
              />
            </div>
            <div className="text-2xl font-bold text-primary font-prompt">ครูหนึ่งรถสวย</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium font-prompt transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-accent hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-prompt ml-4 text-sm"
            >
              LINE สอบถาม
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-white hover:bg-primary focus:outline-none"
          >
            {mobileOpen ? 'ปิด' : 'เมนู'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-md mt-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium font-prompt ${
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-primary hover:bg-accent hover:text-white'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="block btn-primary text-center mt-4"
                onClick={() => setMobileOpen(false)}
              >
                LINE สอบถาม
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
