import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
      <SEO
        title="ติดต่อ ครูหนึ่งรถสวย"
        description="ติดต่อซื้อรถมือสองเชียงใหม่กับ ครูหนึ่งรถสวย โทร 094-0649018 หรือแชทผ่าน LINE และ Facebook ได้เลย"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            name: 'ครูหนึ่งรถสวย',
            image: 'https://chiangmaiusedcar.com/logo.webp',
            telephone: '+66940649018',
            email: 'kn2carcenter@gmail.com',
            url: 'https://chiangmaiusedcar.com/contact',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '320 หมู่ 2',
              addressLocality: 'สันพระเนตร',
              addressRegion: 'สันทราย',
              postalCode: '50210',
              addressCountry: 'TH',
            },
            sameAs: ['https://www.facebook.com/KN2car', 'https://lin.ee/cJuakxZ'],
          }),
        }}
      />

      <main className="max-w-xl mx-auto p-4 font-prompt">
        <h1 className="text-2xl font-bold mb-4 text-primary">ติดต่อเรา</h1>

        <div className="space-y-3 text-gray-800">
          <p>
            <strong className="text-gold">ที่อยู่:</strong> 320 หมู่ 2 ต.สันพระเนตร อ.สันทราย
            จ.เชียงใหม่ 50210
          </p>
          <p>
            <strong className="text-gold">โทรศัพท์:</strong>{' '}
            <a href="tel:+66940649018" className="text-gold hover:text-primary font-bold">
              094-0649018
            </a>
          </p>
          <p>
            <strong className="text-gold">Email:</strong>{' '}
            <a href="mailto:kn2carcenter@gmail.com" className="text-primary hover:text-gold">
              kn2carcenter@gmail.com
            </a>
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-gold">ติดต่อทางเราได้ที่</h2>
            <div className="space-y-2">
              <p>
                <strong className="text-gold">Facebook:</strong>{' '}
                <a
                  href="https://www.facebook.com/KN2car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-gold font-bold"
                >
                  ครูหนึ่งรถสวย
                </a>
              </p>
              <p>
                <strong className="text-gold">LINE:</strong>{' '}
                <a
                  href="https://lin.ee/cJuakxZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-primary font-bold"
                >
                  @ครูหนึ่งรถสวย
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl overflow-hidden shadow-xl">
            <iframe
              title="แผนที่ร้านครูหนึ่งรถสวย"
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[350px]"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBQZWDYWFwmz9keRDqlpOzYYbutXUX_zEo&q=320+หมู่+2+ต.สันพระเนตร+อ.สันทราย+จ.เชียงใหม่+50210`}
            ></iframe>
          </div>
        </div>
      </main>
    </>
  );
}
