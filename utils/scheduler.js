/**
 * Deferred scheduling utilities for non-critical client-side work.
 * Used to fetch supplemental car specs after the page is interactive,
 * without blocking rendering or INP.
 */

/**
 * Run a callback during browser idle time (or after a fallback delay).
 * @param {() => void} cb
 * @param {{ timeout?: number, fallbackDelayMs?: number }} [options]
 * @returns {() => void} cleanup function
 */
export const scheduleIdle = (cb, { timeout = 2500, fallbackDelayMs = 1200 } = {}) => {
  if (typeof window === 'undefined') return () => {};
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, fallbackDelayMs);
  return () => window.clearTimeout(id);
};

/**
 * Run a callback after the page has fully loaded AND during idle time.
 * This avoids contending with LCP/FCP resources on the main thread.
 * @param {() => void} cb
 * @param {{ timeout?: number, fallbackDelayMs?: number }} [idleOptions]
 * @returns {() => void} cleanup function
 */
export const scheduleAfterLoadThenIdle = (cb, idleOptions) => {
  if (typeof window === 'undefined') return () => {};
  if (document?.readyState === 'complete') {
    return scheduleIdle(cb, idleOptions);
  }

  let cancelled = false;
  const onLoad = () => {
    if (cancelled) return;
    cleanup = scheduleIdle(cb, idleOptions); // eslint-disable-line no-use-before-define
  };

  let cleanup = () => {};
  window.addEventListener('load', onLoad, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener('load', onLoad);
    cleanup();
  };
};
