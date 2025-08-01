import React, { useState } from 'react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Navbar({ overlay = false }) {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || overlay
          ? 'bg-white/90 shadow-lg backdrop-blur border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3 font-prompt">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo/logo_main.png"
            alt="ครูหนึ่งรถสวย"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-contain border border-gold"
          />
          <span className="text-xl font-bold text-primary tracking-tight">ครูหนึ่งรถสวย</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-2 lg:gap-4">
          <li>
            <Link
              href="/"
              className="px-4 py-2 rounded hover:bg-gold/10 hover:text-gold font-semibold transition-colors"
            >
              หน้าแรก
            </Link>
          </li>
          <li>
            <Link
              href="/all-cars"
              className="px-4 py-2 rounded hover:bg-gold/10 hover:text-gold font-semibold transition-colors"
            >
              รถทั้งหมด
            </Link>
          </li>
          <li>
            <Link
              href="/promotion"
              className="px-4 py-2 rounded hover:bg-gold/10 hover:text-gold font-semibold transition-colors"
            >
              โปรโมชั่น
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="px-4 py-2 rounded hover:bg-gold/10 hover:text-gold font-semibold transition-colors"
            >
              บทความ
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="px-4 py-2 rounded hover:bg-gold/10 hover:text-gold font-semibold transition-colors"
            >
              ติดต่อเรา
            </Link>
          </li>
        </ul>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://lin.ee/cJuakxZ"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-black px-5 py-2 rounded-full font-bold hover:bg-primary hover:text-white border-2 border-gold transition-all"
          >
            สอบถามผ่าน LINE
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <MobileMenu overlay={scrolled || overlay} />
        </div>
      </nav>
    </header>
  );
}
