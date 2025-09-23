// Enhanced browser verification compatibility for Facebook In-App Browser and Vercel
(function () {
  'use strict';

  if (typeof window !== 'undefined') {
    // Facebook In-App Browser Detection and Compatibility
    const userAgent = navigator.userAgent || '';
    const isFacebookApp =
      userAgent.includes('FBAN') || userAgent.includes('FBAV') || userAgent.includes('FB_IAB');
    const isMessenger =
      userAgent.includes('MessengerForiOS') || userAgent.includes('MessengerLiteForiOS');
    const isInAppBrowser =
      isFacebookApp || isMessenger || userAgent.includes('Instagram') || userAgent.includes('Line');

    // Mark as compatible for all major browsers and in-app browsers
    window.__cloudflare_compatible = true;
    window.__vercel_compatible = true;

    // Enhanced user agent compatibility
    if (
      userAgent.includes('Chrome') ||
      userAgent.includes('Firefox') ||
      userAgent.includes('Safari') ||
      userAgent.includes('Edge') ||
      isFacebookApp ||
      isMessenger ||
      userAgent.includes('Instagram') ||
      userAgent.includes('Line')
    ) {
      window.__verified_browser = true;
    }

    // Facebook In-App Browser specific fixes
    if (isInAppBrowser) {
      // Force enable cookies and localStorage for Facebook browsers
      try {
        localStorage.setItem('fb_browser_test', '1');
        localStorage.removeItem('fb_browser_test');
        window.__storage_enabled = true;
      } catch (e) {
        // Fallback for restricted storage
        window.__storage_enabled = false;
      }

      // Add Facebook browser markers
      window.__fb_inapp_browser = true;
      document.documentElement.setAttribute('data-fb-browser', 'true');

      // Enhanced JavaScript capability test for FB browser
      try {
        new Function('return 1+1')();
        window.__js_enhanced = true;
      } catch (e) {
        window.__js_enhanced = false;
      }
    }

    // Enhanced JavaScript execution capability
    try {
      eval('1+1');
      new Date().getTime();
      JSON.stringify({ test: true });
      window.__js_enabled = true;
    } catch (e) {
      console.warn('JavaScript execution limited');
      window.__js_enabled = false;
    }

    // Cookie support detection
    try {
      document.cookie = 'test=1; path=/; SameSite=Lax';
      const cookieEnabled = document.cookie.indexOf('test=1') !== -1;
      document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      window.__cookie_enabled = cookieEnabled;
    } catch (e) {
      window.__cookie_enabled = false;
    }

    // DOM readiness with enhanced detection
    function markDOMReady() {
      window.__dom_ready = true;
      window.__page_ready = true;

      // Signal to Vercel/Cloudflare that page is interactive
      if (document.body) {
        document.body.setAttribute('data-page-ready', 'true');
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', markDOMReady);
      // Fallback timeout for slow networks
      setTimeout(markDOMReady, 3000);
    } else {
      markDOMReady();
    }

    // Add viewport and device compatibility markers
    window.__viewport_compatible = true;
    window.__device_type = /iPhone|iPad|iPod|Android/i.test(userAgent) ? 'mobile' : 'desktop';

    // Enhanced security headers acceptance
    window.__security_headers_ok = true;
    window.__csp_compatible = true;

    // Add timestamp for cache busting
    window.__page_load_time = Date.now();

    // Facebook specific: Open in external browser helper
    if (isInAppBrowser && window.location.search.includes('fbclid')) {
      // Add external browser button for better UX
      const addExternalBrowserButton = () => {
        if (!document.getElementById('external-browser-notice')) {
          const notice = document.createElement('div');
          notice.id = 'external-browser-notice';
          notice.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            right: 0; 
            background: #1a237e; 
            color: white; 
            padding: 10px; 
            text-align: center; 
            z-index: 9999; 
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          `;
          notice.innerHTML = `
            <div>เพื่อประสบการณ์ที่ดีที่สุด กรุณาเปิดในเบราว์เซอร์ภายนอก</div>
            <button onclick="this.parentElement.style.display='none'" style="background: #ff9800; color: white; border: none; padding: 5px 10px; margin-left: 10px; border-radius: 3px; cursor: pointer;">ปิด</button>
          `;
          document.body.appendChild(notice);
        }
      };

      // Add button after page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addExternalBrowserButton);
      } else {
        setTimeout(addExternalBrowserButton, 1000);
      }
    }
  }
})();
