import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import ClientOnly from '../components/ClientOnly';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  // Check if page has a custom layout
  const getLayout =
    Component.getLayout ||
    (page => (
      <>
        <ClientOnly
          fallback={
            <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-orange-500 h-16"></nav>
          }
        >
          <Navbar />
        </ClientOnly>
        {page}
        <ClientOnly>
          <Footer />
        </ClientOnly>
        <ClientOnly>
          <CookieConsent />
        </ClientOnly>
        <ClientOnly>
          <PWAInstallPrompt />
        </ClientOnly>
      </>
    ));

  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
    </>
  );
}
