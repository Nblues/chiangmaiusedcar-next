/**
 * Polyfills for Next.js 15 compatibility
 * These polyfills fix common issues with server-side rendering
 */

// Fix for "self is not defined" error
if (typeof self === 'undefined') {
  if (typeof globalThis !== 'undefined') {
    globalThis.self = globalThis;
  } else if (typeof window !== 'undefined') {
    window.self = window;
  } else if (typeof global !== 'undefined') {
    global.self = global;
  }
}

// Fix for "window is not defined" error in server environment
if (typeof window === 'undefined') {
  global.window = {};
}

// Fix for "document is not defined" error in server environment
if (typeof document === 'undefined') {
  global.document = {};
}

// Fix for "navigator is not defined" error in server environment
if (typeof navigator === 'undefined') {
  global.navigator = {
    userAgent: 'Node.js',
  };
}

// Fix for "localStorage is not defined" error in server environment
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

// Fix for "sessionStorage is not defined" error in server environment
if (typeof sessionStorage === 'undefined') {
  global.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

// Export for ES modules
export {};
