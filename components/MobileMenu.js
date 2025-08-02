import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileMenu({ open, setOpen, navLinks }) {
  const router = useRouter();

  const isActive = href =>
    router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-200 ${
          open ? 'block' : 'hidden'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      ></div>
      {/* Slide Menu */}
      <div
        className={`fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col`}
      >
        <div className="flex flex-col gap-3 p-6 pt-8">
          {navLinks.map(nav => (
            <Link
              key={nav.href}
              href={nav.href}
              className={`py-2 font-semibold text-lg ${
                isActive(nav.href) ? 'text-gold underline underline-offset-8' : 'text-primary'
              }`}
              onClick={() => setOpen(false)}
            >
              {nav.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-6">
          <a
            href="https://lin.ee/cJuakxZ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition"
            onClick={() => setOpen(false)}
          >
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631..." />
            </svg>
            สอบถามผ่าน LINE
          </a>
        </div>
      </div>
    </>
  );
}
