import React from 'react';
import dynamic from 'next/dynamic';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';

// Import แบบ dynamic ปิด SSR เพื่อลด hydration mismatch
const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

function MyApp({ Component, pageProps }) {
  // รองรับ layout แบบเฉพาะหน้าถ้ามี
  const getLayout = Component.getLayout || (page => page);

  return getLayout(
    <>
      <div className="relative z-0 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
}

export default MyApp;
