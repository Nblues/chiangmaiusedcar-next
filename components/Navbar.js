import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-orange-600 text-white">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg">ครูหนึ่งรถสวย</Link>
        <div className="space-x-4">
          <Link href="/all-cars">รถทั้งหมด</Link>
          <Link href="/promotion">โปรโมชั่น</Link>
          <Link href="/blog">บทความ</Link>
          <Link href="/contact">ติดต่อเรา</Link>
        </div>
      </div>
    </nav>
  );
}
