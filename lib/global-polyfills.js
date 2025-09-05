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

// Also handle globalThis for modern Node.js environments
if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
  }

  // Define webpack chunk loading system for globalThis
  if (typeof globalThis.webpackChunk_N_E === 'undefined') {
    globalThis.webpackChunk_N_E = [];
  }
}

// Ensure self is available in all environments
if (typeof self === 'undefined') {
  if (typeof global !== 'undefined') {
    global.self = global;
  } else if (typeof globalThis !== 'undefined') {
    globalThis.self = globalThis;
  }
}

module.exports = {};
