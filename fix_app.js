const fs = require('fs');
let code = fs.readFileSync('pages/_app.jsx', 'utf8');

code = code.replace(
  /const run = \(\) => \{\s*setAnalyticsReady\(true\);\s*Promise\.all/g,
  'const run = () => {\n      Promise.all'
);

const newEffect = `  // Defer Google Analytics aggressively until user interaction or 5 seconds idle
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;
    if (isAdminRoute) return;
    if (!cookieConsent?.analytics) return;

    let timeoutId;
    let loaded = false;

    const loadAnalytics = () => {
      if (loaded) return;
      loaded = true;
      setAnalyticsReady(true);
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };

    const handleInteraction = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setTimeout(() => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
        } else {
          loadAnalytics();
        }
      }, 100);
    };

    const interactionEvents = ['scroll', 'click', 'touchstart', 'mousemove', 'keydown'];
    
    interactionEvents.forEach(event => {
      window.addEventListener(event, handleInteraction, { passive: true, once: true });
    });

    timeoutId = setTimeout(loadAnalytics, 5000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [isAdminRoute, cookieConsent?.analytics]);
`;

code = code.replace(
  '  // Defer non-critical client-only runtime guards to an async chunk',
  newEffect + '\n  // Defer non-critical client-only runtime guards to an async chunk'
);

fs.writeFileSync('pages/_app.jsx', code);
console.log('Fixed pages/_app.jsx');
