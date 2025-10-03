/**
 * Global polyfill for Next.js 14 compatibility
 * This file MUST be imported before any other modules in _app.jsx
 * Enhanced to handle webpack chunk loading and self references
 */

// Polyfill for server-side rendering compatibility
if (typeof global !== 'undefined') {
  // Define 'self' globally for server environment - CRITICAL for webpack chunks
  if (typeof global.self === 'undefined') {
    global.self = global;
  }

  // Define webpack chunk loading system for server environment
  if (typeof global.webpackChunk_N_E === 'undefined') {
    global.webpackChunk_N_E = [];
  }

  // Define 'window' globally for server environment
  if (typeof global.window === 'undefined') {
    global.window = global;
  }

  // Define 'document' globally for server environment
  if (typeof global.document === 'undefined') {
    global.document = {};
  }

  // Define 'navigator' globally for server environment
  if (typeof global.navigator === 'undefined') {
    global.navigator = {
      userAgent: 'Node.js Server',
    };
  }

  // Define 'localStorage' globally for server environment
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }
}

// Also handle modern Node.js environments
if (typeof global !== 'undefined' && typeof globalThis === 'undefined') {
  global.globalThis = global;
}

// Ensure self is available in all environments
if (typeof self === 'undefined' && typeof global !== 'undefined') {
  global.self = global;
}

module.exports = {};
