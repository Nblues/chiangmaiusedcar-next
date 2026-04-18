import { getAllCars } from '../../lib/shopify.mjs';

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cars = await getAllCars();
    const siteUrl = 'https://www.chiangmaiusedcar.com';

    let xmlItems = '';

    for (const car of cars) {
      // ตรวจสอบข้อมูลเพื่อไม่ให้ส่งรถที่ลบไปแล้วไปให้ Facebook
      if (!car || !car.handle) continue;
      
      const id = car.id?.split('/').pop() || car.handle;
      const title = escapeXml(car.title || 'รถมือสองเชียงใหม่');
      // ลบ HTML tags เพื่อให้ Facebook อ่านออกง่ายๆ
      const rawHtml = car.descriptionHtml || car.description || '';
      const descriptionText = rawHtml
        .replace(/<[^>]+>/g, ' ') // Strip HTML
        .replace(/\s+/g, ' ')
        .trim();
      const description = escapeXml(descriptionText || title);
      
      const link = `${siteUrl}/car/${car.handle}`;
      
      // ดึงรูปแรก
      let imageLink = `${siteUrl}/herobanner/chiangmaiusedcar.webp`; // Fallback image
      if (Array.isArray(car.images) && car.images.length > 0 && car.images[0].url) {
        imageLink = car.images[0].url;
      }
      imageLink = escapeXml(imageLink);
      
      const brand = escapeXml(car.vendor || car.brand || 'Toyota');
      const condition = 'used'; // Facebook Catalog condition
      const availability = car.availableForSale ? 'in stock' : 'out of stock';
      
      // ราคา
      const priceAmount = car.price?.amount || '0.00';
      const price = `${priceAmount} THB`; // ต้องมีรหัสสกุลเงิน

      xmlItems += `
        <item>
          <g:id>${id}</g:id>
          <g:title>${title}</g:title>
          <g:description>${description}</g:description>
          <g:link>${link}</g:link>
          <g:image_link>${imageLink}</g:image_link>
          <g:brand>${brand}</g:brand>
          <g:condition>${condition}</g:condition>
          <g:availability>${availability}</g:availability>
          <g:price>${price}</g:price>
        </item>`;
    }

    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>ครูหนึ่งรถสวย เชียงใหม่ (Chiangmai Used Car)</title>
    <link>${siteUrl}</link>
    <description>ศูนย์รวมรถยนต์มือสองคุณภาพดี อันดับ 1 ในเชียงใหม่</description>
    ${xmlItems}
  </channel>
</rss>`;

    // ตั้งค่า Content-Type เป็น XML
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    
    return res.status(200).send(xmlData);
  } catch (error) {
    console.error('Error generating FB Catalog XML:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
