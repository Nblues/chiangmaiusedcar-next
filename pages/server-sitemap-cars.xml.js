import { getAllCars } from '../lib/shopify.mjs';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
    }
  });
}

function createPrettyUrl(handle) {
  if (!handle) return '';
  const safeDecode = value => {
    try {
      return decodeURIComponent(String(value));
    } catch {
      return String(value);
    }
  };
  let cleanHandle = safeDecode(handle);
  const thaiWords = ['ปี', 'รุ่น', 'ปีที่', 'ปีคศ', 'เกียร์'];
  thaiWords.forEach(word => {
    cleanHandle = cleanHandle.replace(new RegExp(`-${word}-`, 'g'), '-');
    cleanHandle = cleanHandle.replace(new RegExp(`-${encodeURIComponent(word)}-`, 'gi'), '-');
  });
  cleanHandle = cleanHandle.replace(/[\u0E00-\u0E7F]+/g, '');
  cleanHandle = cleanHandle
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  return cleanHandle.toLowerCase() || handle;
}

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  try {
    const cars = await getAllCars();

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/xml');

    const lastModifiedAllCars = (() => {
      let latestTs = 0;
      for (const car of cars || []) {
        if (!car.availableForSale) continue;
        const ts = car?.updatedAt ? new Date(car.updatedAt).getTime() : 0;
        if (Number.isFinite(ts) && ts > latestTs) latestTs = ts;
      }
      return latestTs > 0 ? new Date(latestTs).toISOString() : new Date().toISOString();
    })();

    const carNodes = cars
      .filter(car => car.availableForSale)
      .map(car => {
        const cleanCarUrl = createPrettyUrl(car.handle);
        const lastModified = car.updatedAt || new Date().toISOString();
        return `
            <url>
                <loc>https://www.chiangmaiusedcar.com/car/${escapeXml(cleanCarUrl)}</loc>
                <lastmod>${lastModified}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.9</priority>
            </url>
          `;
      })
      .join('');

    const carsPerPage = 8;
    const totalPages = Math.ceil((cars?.length || 0) / carsPerPage);
    const catalogNodes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => {
      const page = i + 2;
      return `
            <url>
                <loc>https://www.chiangmaiusedcar.com/all-cars?page=${page}</loc>
                <lastmod>${lastModifiedAllCars}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.7</priority>
            </url>
        `;
    }).join('');

    const brandConfigs = [
      { slug: 'toyota', tokens: ['toyota'] },
      { slug: 'honda', tokens: ['honda'] },
      { slug: 'isuzu', tokens: ['isuzu'] },
      { slug: 'nissan', tokens: ['nissan'] },
      { slug: 'mazda', tokens: ['mazda'] },
      { slug: 'mitsubishi', tokens: ['mitsubishi'] },
      { slug: 'ford', tokens: ['ford'] },
    ];
    let brandNodes = '';
    const brandPerPage = 24;

    for (const brand of brandConfigs) {
      const tokens = brand.tokens || [];
      const brandCars = (cars || []).filter(car => {
        const hay = `${car?.vendor || ''} ${car?.brand || ''} ${car?.title || ''}`.toLowerCase();
        return tokens.some(t => hay.includes(t));
      });

      const brandTotalPages = Math.ceil((brandCars.length || 0) / brandPerPage);
      if (brandTotalPages <= 1) continue;

      const brandLastmod = (() => {
        let latestTs = 0;
        for (const car of brandCars) {
          if (!car.availableForSale) continue;
          const ts = car?.updatedAt ? new Date(car.updatedAt).getTime() : 0;
          if (Number.isFinite(ts) && ts > latestTs) latestTs = ts;
        }
        return latestTs > 0 ? new Date(latestTs).toISOString() : lastModifiedAllCars;
      })();

      for (let page = 2; page <= brandTotalPages; page += 1) {
        brandNodes += `
                <url>
                    <loc>https://www.chiangmaiusedcar.com/used-cars-chiang-mai-brand/${brand.slug}?page=${page}</loc>
                    <lastmod>${brandLastmod}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.6</priority>
                </url>
            `;
      }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${carNodes}${catalogNodes}${brandNodes}
</urlset>`;

    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (e) {
    console.error('Error generating sitemap:', e);
    res.statusCode = 500;
    res.write(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    );
    res.end();
    return { props: {} };
  }
}
