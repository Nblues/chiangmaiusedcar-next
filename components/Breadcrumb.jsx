import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Breadcrumb({ items = [], carTitle = null }) {
  const router = useRouter();

  // Auto-generate breadcrumb from URL if no items provided
  const generateBreadcrumb = () => {
    const pathSegments = router.asPath.split('/').filter(segment => segment);
    const breadcrumbItems = [{ label: 'หน้าแรก', href: '/' }];

    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip query parameters
      const cleanSegment = segment.split('?')[0];

      let label = cleanSegment;
      let href = currentPath;

      // Map common paths to Thai labels
      switch (cleanSegment) {
        case 'all-cars':
          label = 'รถทั้งหมด';
          break;
        case 'blog':
          label = 'ข่าวสาร';
          break;
        case 'about':
          label = 'เกี่ยวกับเรา';
          break;
        case 'contact':
          label = 'ติดต่อ';
          break;
        case 'promotion':
          label = 'โปรโมชัน';
          break;
        case 'credit-check':
          label = 'เช็คเครดิต';
          break;
        case 'payment-calculator':
          label = 'คำนวนค่างวด';
          break;
        case 'car':
          label = 'รายละเอียดรถ';
          break;
        default:
          // For car detail pages, use car title if provided
          if (router.pathname.includes('/car/') && carTitle && index === pathSegments.length - 1) {
            label = carTitle;
          } else {
            // Decode and clean up URL segment
            label = decodeURIComponent(cleanSegment).replace(/-/g, ' ');
          }
      }

      breadcrumbItems.push({
        label,
        href: index === pathSegments.length - 1 ? null : href, // Last item has no link
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumb();

  // Generate JSON-LD schema for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://chiangmaiusedcar.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-primary hover:text-accent transition-colors duration-200 font-prompt"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-600 font-prompt font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
