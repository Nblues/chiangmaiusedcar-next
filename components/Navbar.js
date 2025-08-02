import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary-600 text-text-inverse shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg nav-link">
          ครูหนึ่งรถสวย
        </Link>
        <div className="space-x-4">
          <Link href="/all-cars" className="nav-link">
            รถทั้งหมด
          </Link>
          <Link href="/promotion" className="nav-link">
            โปรโมชั่น
          </Link>
          <Link href="/blog" className="nav-link">
            บทความ
          </Link>
          <Link href="/contact" className="nav-link">
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </nav>
  );
}
