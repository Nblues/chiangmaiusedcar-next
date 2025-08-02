// components/CarActionButtons.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CarActionButtons({ car }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && car?.handle) {
      setLiked(!!localStorage.getItem(`fav-${car.handle}`));
    }
  }, [car]);

  const handleLike = () => {
    if (!car?.handle) return;
    if (liked) {
      localStorage.removeItem(`fav-${car.handle}`);
      setLiked(false);
    } else {
      localStorage.setItem(`fav-${car.handle}`, '1');
      setLiked(true);
    }
  };

  const shareCar = () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.origin + '/car/' + car.handle
        : 'https://chiangmaiusedcar.com/car/' + car.handle;
    if (navigator.share) {
      navigator.share({
        title: car.title,
        url,
      });
    } else {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6 w-full">
      <a
        href="https://lin.ee/cJuakxZ"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg transition"
        title="สอบถามผ่าน LINE"
      >
        {/* ใส่ SVG LINE ICON */}
        LINE
      </a>
      <a
        href="tel:0940649018"
        className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg shadow-lg transition"
        title="โทรศัพท์"
      >
        โทร 094-064-9018
      </a>
      <a
        href="https://page.line.me/oa_id"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-lg transition"
        title="Line Official"
      >
        LINE OA
      </a>
      <a
        href="https://www.facebook.com/KN2car"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-lg transition"
        title="ดูบน Facebook"
      >
        Facebook
      </a>
      {/* แชร์ */}
      <button
        onClick={shareCar}
        className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg shadow-lg transition"
        title="แชร์"
      >
        แชร์
      </button>
      {/* บันทึกหัวใจ */}
      <button
        onClick={handleLike}
        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-2xl ${
          liked ? 'bg-pink-500' : 'bg-gray-200'
        } hover:bg-pink-400 text-primary font-bold text-lg shadow-lg transition`}
        title={liked ? 'ลบออกจากรถที่บันทึก' : 'บันทึกรถ (Favorite)'}
      >
        {liked ? 'บันทึกแล้ว' : 'บันทึกรถ'}
      </button>
    </div>
  );
}
