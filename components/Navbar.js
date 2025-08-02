import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/all-cars', label: 'รถทั้งหมด' },
  { href: '/promotion', label: 'โปรโมชัน' },
  { href: '/blog', label: 'บทความ' },
  { href: '/contact', label: 'ติดต่อ' },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = href =>
    router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  return (
    <nav className="bg-white shadow z-50 sticky top-0 left-0 font-prompt">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Image
            src="/logo/logo_main.png"
            alt="โลโก้ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-gold bg-white shadow"
            priority
          />
          <span>ครูหนึ่งรถสวย</span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(nav => (
            <Link
              key={nav.href}
              href={nav.href}
              className={`font-semibold hover:text-gold transition ${
                isActive(nav.href) ? 'text-gold underline underline-offset-8' : 'text-primary'
              }`}
            >
              {nav.label}
            </Link>
          ))}
          <a
            href="https://lin.ee/cJuakxZ"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631..." />
            </svg>
            สอบถามผ่าน LINE
          </a>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          aria-label="เปิดเมนู"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Mobile Menu Dropdown */}
      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} navLinks={navLinks} />
    </nav>
  );
}
