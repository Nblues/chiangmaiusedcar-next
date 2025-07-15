export default function Footer() {
  const site = process.env.SITE_URL;
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-4 md:grid-cols-3">
        <div>
          <h3 className="font-semibold mb-2">ครูหนึ่งรถสวย</h3>
          <p>320 หมู่ 2 ต.สันพระเนตร อ.สันทราย จ.เชียงใหม่ 50210</p>
          <p>โทร <a href="tel:+66940649018" className="text-orange-600">094-064-9018</a></p>
          <p><a href="https://lin.ee/cJuakxZ" className="text-green-600">สอบถามผ่าน LINE</a></p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">ติดตามเรา</h3>
          <ul className="space-y-1">
            <li><a href="https://www.facebook.com/nuengblues" target="_blank">Facebook</a></li>
            <li><a href="https://youtube.com/@chiangraiusedcar" target="_blank">YouTube</a></li>
            <li><a href="https://www.tiktok.com/@krunueng_usedcar" target="_blank">TikTok</a></li>
          </ul>
        </div>
        <div>
          <iframe
            title="แผนที่ครูหนึ่งรถสวย"
            loading="lazy"
            width="100%"
            height="200"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.MAPS_API_KEY||''}&q=18.8078,99.0405&zoom=15`}>
          </iframe>
        </div>
      </div>
      <div className="text-center pb-4 text-sm">&copy; {new Date().getFullYear()} ครูหนึ่งรถสวย</div>
    </footer>
  );
}
