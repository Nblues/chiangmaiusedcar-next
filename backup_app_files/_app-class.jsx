import React, { Component } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

// Import components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

// Wrapper function component for router
function MyAppWrapper(props) {
  const router = useRouter();
  return <MyApp {...props} router={router} />;
}

class MyApp extends Component {
  componentDidMount() {
    // Basic initialization
    console.log('App initialized');

    // Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Google Analytics Consent Mode
    if (typeof window !== 'undefined') {
      window.gtag =
        window.gtag ||
        function () {
          (window.dataLayer = window.dataLayer || []).push(arguments);
        };

      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      });
    }

    // Router event handlers
    const handleRouteComplete = url => {
      console.log('Route completed:', url);
    };

    this.props.router.events.on('routeChangeComplete', handleRouteComplete);
  }

  componentWillUnmount() {
    // Cleanup router events
    this.props.router.events.off('routeChangeComplete', () => {});
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 bg-gray-50">
          <Component {...pageProps} />
        </main>
        <Footer />
        <CookieConsent />
        <PWAInstallPrompt />
        <Analytics />
        <GoogleAnalytics gaId="G-81DK266FDR" />
      </div>
    );
  }
}

// Web Vitals function
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }
}

export default MyAppWrapper;
