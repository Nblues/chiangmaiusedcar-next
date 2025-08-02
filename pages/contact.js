import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
      <SEO title="ติดต่อ ครูหนึ่งรถสวย" />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">ติดต่อเรา</h1>
        <div className="space-y-3 text-text-secondary">
          <p>
            <span className="font-medium text-text-primary">ที่อยู่:</span> 320 หมู่ 2 ต.สันพระเนตร อ.สันทราย จ.เชียงใหม่ 50210
          </p>
          <p>
            <span className="font-medium text-text-primary">โทร:</span> <a href="tel:+66940649018" className="link-primary font-medium">094-064-9018</a>
          </p>
          <p>
            <span className="font-medium text-text-primary">LINE:</span> <a href="https://lin.ee/cJuakxZ" className="link-success font-medium">@ครูหนึ่งรถสวย</a>
          </p>
          <p>
            <span className="font-medium text-text-primary">Facebook:</span> <a href="https://www.facebook.com/nuengblues" className="link-info font-medium">nuengblues</a>
          </p>
          <p>
            <span className="font-medium text-text-primary">Email:</span> <a href="mailto:kn2carcenter@gmail.com" className="link-primary">kn2carcenter@gmail.com</a>
          </p>
        </div>
        <div className="mt-6">
          <iframe
            title="Google Map"
            width="100%"
            height="350"
            className="border border-secondary-300 rounded-md"
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
