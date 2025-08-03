import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';

// Import BlogCMS แบบ dynamic ปิด SSR
const BlogCMS = dynamic(() => import('../../components/BlogCMS'), { ssr: false });

export default function BlogCMSPage() {
  return (
    <>
      <SEO
        title="Blog CMS - ระบบจัดการบทความ | ครูหนึ่งรถสวย"
        description="ระบบจัดการบทความสำหรับเขียนและแก้ไขบทความบล็อก"
        url="https://chiangmaiusedcar.com/blog/cms"
        noindex={true} // ไม่ให้ search engine index หน้านี้
      />
      <BlogCMS />
    </>
  );
}
