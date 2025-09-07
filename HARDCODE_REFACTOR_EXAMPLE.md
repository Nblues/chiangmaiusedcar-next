// ตัวอย่างการใช้ Business Config ใน contact.jsx

import { BUSINESS_INFO, createBusinessUrl, createPhoneLink, createMapsLink, createPlaceLink } from '../config/business';

// แทนที่ hardcoded values ด้วย config const breadcrumbSchema = { '@context': 'https://schema.org', '@type':
'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item:
createBusinessUrl('/') }, { '@type': 'ListItem', position: 2, name: 'ติดต่อเรา', item: createBusinessUrl('/contact') },
], };

const organizationSchema = { '@context': 'https://schema.org', '@type': 'AutoDealer', name: BUSINESS_INFO.name,
alternateName: BUSINESS_INFO.alternateName, description: BUSINESS_INFO.seo.description, url: BUSINESS_INFO.baseUrl,
telephone: `+66${BUSINESS_INFO.phone.replace(/-/g, '').substring(1)}`, email: BUSINESS_INFO.email, address: { '@type':
'PostalAddress', streetAddress: BUSINESS_INFO.address.street, addressLocality: BUSINESS_INFO.address.district,
addressRegion: BUSINESS_INFO.address.province, postalCode: BUSINESS_INFO.address.postalCode, addressCountry:
BUSINESS_INFO.address.country, }, geo: { '@type': 'GeoCoordinates', latitude: BUSINESS_INFO.coordinates.latitude,
longitude: BUSINESS_INFO.coordinates.longitude, }, openingHours: BUSINESS_INFO.operatingHours.format, sameAs:
Object.values(BUSINESS_INFO.socialMedia).filter(Boolean), };

// ใช้ในส่วน UI <a href={createPhoneLink()} className="..."> {BUSINESS_INFO.phone} </a>

<a href={BUSINESS_INFO.socialMedia.line} className="...">
  LINE: สอบถามเลย
</a>

<a href={createMapsLink()} className="...">
  📍 Google Maps  
</a>

<a href={createPlaceLink()} className="...">
  ⭐ รีวิว Google
</a>
