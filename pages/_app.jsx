import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

// Import แบบ dynamic ปิด SSR เพื่อลด hydration mismatch
const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // ป้องกัน router errors และ handle route changes ที่ถูกยกเลิก
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled`);
        return;
      }
      console.error('Route change error:', err);
    };

    const handleRouteChangeStart = url => {
      console.log('Route change started:', url);
    };

    const handleRouteChangeComplete = url => {
      console.log('Route change completed:', url);
    };

    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeError', handleRouteChangeError);
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // รองรับ layout แบบเฉพาะหน้าถ้ามี
  const getLayout = Component.getLayout || (page => page);

  return (
    <>
      <div className="relative z-0 min-h-screen flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{getLayout(<Component {...pageProps} />)}</main>
        <Footer />
      </div>
      <Analytics />
      <GoogleAnalytics gaId="G-81DK266FDR" />
    </>
  );
}

export default MyApp;
