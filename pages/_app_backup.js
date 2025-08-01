import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Analytics } from '@vercel/analytics/next';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ใน SSR router.pathname อาจไม่ถูกต้อง ให้ใช้ state ตรวจสอบ
  const isHome = isClient ? router.pathname === '/' : false;

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {!isHome && <Navbar />}
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        {!isHome && <Footer />}
      </div>
      <Analytics />
    </ErrorBoundary>
  );
}

export default MyApp;
