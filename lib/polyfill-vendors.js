/**
 * Polyfill for server-side vendors.js to fix "self is not defined" error
 * This file patches the global scope before vendors.js is loaded
 */

const Module = require('module');
const originalRequire = Module.prototype.require;

// Setup global polyfills immediately
if (typeof global !== 'undefined') {
  global.self = global;
  global.webpackChunk_N_E = global.webpackChunk_N_E || [];
  global.window = undefined;
  global.document = undefined;
  global.navigator = {
    userAgent: 'Node.js Server',
    platform: 'Node.js',
  };
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

if (typeof globalThis !== 'undefined') {
  globalThis.self = globalThis;
  globalThis.webpackChunk_N_E = globalThis.webpackChunk_N_E || [];
}

// Patch require to inject polyfills before loading vendors.js
Module.prototype.require = function (id) {
  if (id.includes('vendors.js') || id.includes('server/vendors')) {
    // Ensure polyfills are active before loading vendors
    if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
      global.self = global;
      global.webpackChunk_N_E = global.webpackChunk_N_E || [];
    }
  }
  return originalRequire.apply(this, arguments);
};

console.log('[polyfill-vendors] Global polyfills applied for server-side rendering');

module.exports = {};
