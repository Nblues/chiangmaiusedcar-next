import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
      <SEO title="ติดต่อ ครูหนึ่งรถสวย" />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">ติดต่อเรา</h1>
        <p>ที่อยู่: 320 หมู่ 2 ต.สันพระเนตร อ.สันทราย จ.เชียงใหม่ 50210</p>
        <p>โทร: <a href="tel:+66940649018" className="text-orange-600">094-064-9018</a></p>
        <p>LINE: <a href="https://lin.ee/cJuakxZ" className="text-green-600">@ครูหนึ่งรถสวย</a></p>
        <p>Facebook: <a href="https://www.facebook.com/nuengblues" className="text-blue-600">nuengblues</a></p>
        <p>Email: <a href="mailto:kn2carcenter@gmail.com">kn2carcenter@gmail.com</a></p>
        <div className="mt-6">
          <iframe
            title="Google Map"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBQZWDYWFwmz9keRDqlpOzYYbutXUX_zEo&q=320+หมู่+2+ต.สันพระเนตร+อ.สันทราย+จ.เชียงใหม่+50210">
          </iframe>
        </div>
      </main>
    </>
  );
}
