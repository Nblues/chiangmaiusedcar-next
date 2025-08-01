import React from 'react';
import dynamic from 'next/dynamic';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';

// import แบบ dynamic ปิด SSR
const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <Analytics />
    </>
  );
}

export default MyApp;
