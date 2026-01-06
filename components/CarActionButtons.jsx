// components/CarActionButtons.js

export default function CarActionButtons({ car }) {
  const shareCar = async () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.origin + '/car/' + car.handle
        : 'https://chiangmaiusedcar.com/car/' + car.handle;

    const shareData = {
      title: `${car.title} - ครูหนึ่งรถสวย`,
      text: `${car.title} ราคา ฿${Number(car.price.amount).toLocaleString()} บาท รถมือสองคุณภาพ ฟรีดาวน์ ผ่อนถูก`,
      url: url,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy URL
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          alert('คัดลอกลิงก์แล้ว!');
        } else {
          // Fallback to Facebook share
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank',
            'width=600,height=400'
          );
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Share failed:', error);
      // Final fallback to Facebook share
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
        'width=600,height=400'
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 font-prompt text-center">ติดต่อสอบถาม</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LINE Official Account */}
        <a
          href="https://lin.ee/8ugfzstD"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-6 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-prompt"
          title="สอบถามผ่าน LINE Official Account"
          aria-label="ติดต่อผ่าน LINE Official Account"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.627-.285-.627-.629V8.108c0-.345.281-.63.627-.63.211 0 .402.08.53.242l2.5 3.397V8.108c0-.345.281-.63.629-.63.348 0 .631.285.631.63v4.771z" />
          </svg>
          LINE OA
        </a>

        {/* Phone Call */}
        <a
          href="tel:0940649018"
          className="flex items-center justify-center px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-prompt"
          title="โทรศัพท์สอบถาม"
          aria-label="โทรศัพท์สอบถาม 094-064-9018"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          โทร 094-064-9018
        </a>

        {/* Share */}
        <button
          onClick={shareCar}
          className="flex items-center justify-center px-6 py-4 rounded-xl bg-accent hover:bg-accent-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-prompt"
          title="แชร์รถคันนี้"
          aria-label="แชร์ข้อมูลรถคันนี้"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          แชร์
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-center text-sm text-gray-600 font-prompt">
        <p>ติดต่อเรา 24/7 ให้คำปรึกษาฟรี</p>
        <p>บริการส่งรถถึงหน้าบ้าน ทั่วประเทศ</p>
      </div>
    </div>
  );
}
