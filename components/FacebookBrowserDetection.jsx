import { useEffect } from 'react';

/**
 * Facebook/Messenger Browser Detection Hook
 * ตรวจจับและจัดการ layout สำหรับ Facebook in-app browser
 */
export function useFacebookBrowserDetection() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent || '';
    const isFacebookBrowser = /FBAN|FBAV|Messenger/i.test(userAgent);

    if (isFacebookBrowser) {
      // Add fbwebview class to html element
      document.documentElement.classList.add('fbwebview');

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Facebook/Messenger browser detected:', userAgent);
      }

      // Add additional viewport meta if not exists
      const existingViewport = document.querySelector('meta[name="viewport"]');
      if (!existingViewport || !existingViewport.content.includes('viewport-fit=cover')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';

        // Remove existing viewport and add new one
        if (existingViewport) {
          existingViewport.remove();
        }
        document.head.appendChild(viewport);
      }

      // Force layout recalculation
      document.body.style.transform = 'translateZ(0)';

      // Enhanced image handling for Facebook browser
      const handleImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          // Basic styling
          if (!img.style.maxWidth) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          }

          // Handle Next.js Image loading issues in Facebook browser
          if (img.hasAttribute('data-nimg')) {
            img.style.display = 'block';
            img.style.objectFit = 'cover';

            // Force reload if image failed to load
            if (!img.complete || img.naturalHeight === 0) {
              const originalSrc = img.src;
              img.src = '';
              setTimeout(() => {
                img.src = originalSrc;
              }, 100);
            }
          }
        });
      };

      // Initial image handling
      handleImages();

      // Handle dynamically loaded images
      const observer = new MutationObserver(() => {
        handleImages();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Cleanup observer
      const cleanup = () => observer.disconnect();
      window.addEventListener('beforeunload', cleanup);
    }

    // Cleanup function
    return () => {
      if (isFacebookBrowser) {
        document.documentElement.classList.remove('fbwebview');
      }
    };
  }, []);

  return null;
}

/**
 * Facebook Browser Detection Component
 * ใช้ใน _app.jsx เพื่อตรวจจับ Facebook browser
 */
export default function FacebookBrowserDetection() {
  useFacebookBrowserDetection();
  return null;
}
