// components/CarActionButtons.js

export default function CarActionButtons({ car }) {
  const shareCar = () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.origin + '/car/' + car.handle
        : 'https://chiangmaiusedcar.com/car/' + car.handle;

    const shareData = {
      title: `${car.title} - ครูหนึ่งรถสวย`,
      text: `${car.title} ราคา ฿${Number(car.price.amount).toLocaleString()} บาท รถมือสองคุณภาพ ฟรีดาวน์ ผ่อนถูก`,
      url: url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      // Fallback to copy URL
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          alert('คัดลอกลิงก์แล้ว!');
        });
      } else {
        // Fallback to Facebook share
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 font-prompt text-center">ติดต่อสอบถาม</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LINE Official Account */}
        <a
          href="https://lin.ee/cJuakxZ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-6 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-prompt"
          title="สอบถามผ่าน LINE Official Account"
        >
          LINE OA
        </a>

        {/* Phone Call */}
        <a
          href="tel:0940649018"
          className="flex items-center justify-center px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-prompt"
          title="โทรศัพท์สอบถาม"
        >
          โทร 094-064-9018
        </a>

        {/* Share */}
        <button
          onClick={shareCar}
          className="flex items-center justify-center px-6 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-prompt"
          title="แชร์รถคันนี้"
        >
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
