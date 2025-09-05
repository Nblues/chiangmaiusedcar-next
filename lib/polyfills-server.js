/**
 * Server-side polyfills for Next.js 15 compatibility
 * This file is loaded during webpack build process for server-side code
 */

if (typeof globalThis !== 'undefined') {
  // Fix for "self is not defined" error in server environment
  if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
  }

  // Fix for "window is not defined" error in server environment
  if (typeof globalThis.window === 'undefined') {
    globalThis.window = globalThis;
  }

  // Fix for "document is not defined" error in server environment
  if (typeof globalThis.document === 'undefined') {
    globalThis.document = {};
  }

  // Fix for "navigator is not defined" error in server environment
  if (typeof globalThis.navigator === 'undefined') {
    globalThis.navigator = {
      userAgent: 'Node.js Server',
    };
  }
}

// Also define on global for older Node.js compatibility
if (typeof global !== 'undefined') {
  if (typeof global.self === 'undefined') {
    global.self = global;
  }

  if (typeof global.window === 'undefined') {
    global.window = global;
  }
}
