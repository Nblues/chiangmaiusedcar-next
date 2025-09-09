/**
 * Safe Fetch Utility - Robust API call wrapper
 * Provides consistent error handling, response validation, and fallback mechanisms
 */

/**
 * Configuration options for safeFetch
 * @typedef {Object} SafeFetchOptions
 * @property {number} timeout - Request timeout in milliseconds (default: 10000)
 * @property {number} retries - Number of retry attempts (default: 2)
 * @property {number} retryDelay - Delay between retries in milliseconds (default: 1000)
 * @property {boolean} validateJson - Whether to validate JSON response (default: true)
 * @property {any} fallback - Fallback value to return on error (default: null)
 * @property {boolean} logErrors - Whether to log errors to console (default: true)
 * @property {Object} headers - Additional headers to include
 * @property {string} method - HTTP method (default: 'GET')
 * @property {any} body - Request body
 */

/**
 * Enhanced fetch wrapper with comprehensive error handling
 * @param {string} url - The URL to fetch
 * @param {SafeFetchOptions} options - Configuration options
 * @returns {Promise<any>} - Returns data or fallback value
 */
export async function safeFetch(url, options = {}) {
  const {
    timeout = 10000,
    retries = 2,
    retryDelay = 1000,
    validateJson = true,
    fallback = null,
    logErrors = true,
    headers = {},
    method = 'GET',
    body = null,
    ...fetchOptions
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Prepare fetch options
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal,
        ...fetchOptions,
      };

      // Remove body for GET requests
      if (method === 'GET') {
        delete requestOptions.body;
      }

      // Make the request
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response based on content type
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // Validate JSON structure if required
        if (validateJson && (data === null || data === undefined)) {
          throw new Error('Invalid JSON response: null or undefined');
        }

        return data;
      } else if (contentType && contentType.includes('text/')) {
        return await response.text();
      } else {
        // For other content types, return the response object
        return response;
      }
    } catch (error) {
      lastError = error;

      // Log error if enabled
      if (logErrors) {
        console.error(
          `[safeFetch] Attempt ${attempt + 1}/${retries + 1} failed for ${url}:`,
          error.message
        );
      }

      // Don't retry on certain errors
      if (error.name === 'AbortError') {
        if (logErrors) {
          console.error(`[safeFetch] Request timeout after ${timeout}ms for ${url}`);
        }
        break;
      }

      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP 4')) {
        if (logErrors) {
          console.error(`[safeFetch] Client error, not retrying: ${error.message}`);
        }
        break;
      }

      // Wait before retry (except on last attempt)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  // All attempts failed, return fallback
  if (logErrors) {
    console.error(
      `[safeFetch] All attempts failed for ${url}. Last error:`,
      lastError?.message || 'Unknown error'
    );
    console.error(`[safeFetch] Returning fallback:`, fallback);
  }

  return fallback;
}

/**
 * Specialized fetch for GraphQL APIs
 * @param {string} endpoint - GraphQL endpoint URL
 * @param {string} query - GraphQL query string
 * @param {Object} variables - GraphQL variables
 * @param {SafeFetchOptions} options - Additional options
 * @returns {Promise<any>} - Returns GraphQL data or null
 */
export async function safeGraphQLFetch(endpoint, query, variables = {}, options = {}) {
  const graphqlOptions = {
    method: 'POST',
    body: { query, variables },
    fallback: null,
    ...options,
  };

  const result = await safeFetch(endpoint, graphqlOptions);

  // Handle GraphQL errors
  if (result && result.errors) {
    if (options.logErrors !== false) {
      console.error('[safeGraphQLFetch] GraphQL errors:', result.errors);
    }

    // Return data if available, otherwise fallback
    return result.data || options.fallback || null;
  }

  // Return data portion of GraphQL response
  return result ? result.data : options.fallback || null;
}

/**
 * Fetch with built-in retry for common endpoints
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - API response or fallback
 */
export async function safeAPIFetch(url, options = {}) {
  return safeFetch(url, {
    timeout: 8000,
    retries: 2,
    retryDelay: 500,
    fallback: { error: 'API temporarily unavailable' },
    ...options,
  });
}

/**
 * Fetch for external services with longer timeout
 * @param {string} url - External API URL
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - External API response or fallback
 */
export async function safeExternalFetch(url, options = {}) {
  return safeFetch(url, {
    timeout: 15000,
    retries: 1,
    retryDelay: 2000,
    fallback: null,
    logErrors: false, // Don't log external API errors by default
    ...options,
  });
}

/**
 * Safe fetch for image resources
 * @param {string} imageUrl - Image URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response|null>} - Image response or null
 */
export async function safeImageFetch(imageUrl, options = {}) {
  return safeFetch(imageUrl, {
    timeout: 5000,
    retries: 1,
    validateJson: false,
    fallback: null,
    logErrors: false,
    ...options,
  });
}

/**
 * Utility function to safely get nested object properties
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if path doesn't exist
 * @returns {any} - Value at path or default value
 */
export function safeGet(obj, path, defaultValue = null) {
  // Enhanced null/undefined checking
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return defaultValue;
  }

  // Handle array-like objects safely
  if (Array.isArray(obj) && typeof path === 'number') {
    return obj[path] !== undefined ? obj[path] : defaultValue;
  }

  try {
    // Handle both string and array paths
    const keys = typeof path === 'string' ? path.split('.') : Array.isArray(path) ? path : [path];
    let current = obj;

    for (const key of keys) {
      // More robust null checking
      if (
        current === null ||
        current === undefined ||
        !Object.prototype.hasOwnProperty.call(current, key)
      ) {
        return defaultValue;
      }
      current = current[key];
    }

    return current !== undefined && current !== null ? current : defaultValue;
  } catch (error) {
    // Suppress and return fallback for any access errors
    return defaultValue;
  }
}

/**
 * Format price safely for display
 * @param {number|string} amount - Price amount
 * @param {string} currency - Currency code (default: 'THB')
 * @param {string} fallback - Fallback text (default: 'ติดต่อสอบถาม')
 * @returns {Object} - Formatted price info
 */
export function safeFormatPrice(amount, currency = 'THB', fallback = 'ติดต่อสอบถาม') {
  try {
    const num = Number(amount);
    const isValid = Number.isFinite(num) && num >= 0;

    return {
      valid: isValid,
      numeric: isValid ? String(num) : undefined,
      display: isValid ? num.toLocaleString('th-TH') : fallback,
      currency: currency,
    };
  } catch (error) {
    return {
      valid: false,
      numeric: undefined,
      display: fallback,
      currency: currency,
    };
  }
}

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {any} fallback - Fallback value
 * @returns {any} - Parsed JSON or fallback
 */
export function safeJSONParse(jsonString, fallback = null) {
  try {
    if (typeof jsonString !== 'string') {
      return fallback;
    }

    const parsed = JSON.parse(jsonString);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Safely access localStorage with fallback
 * @param {string} key - localStorage key
 * @param {any} fallback - Fallback value
 * @returns {any} - Stored value or fallback
 */
export function safeLocalStorage(key, fallback = null) {
  try {
    if (typeof window === 'undefined') {
      return fallback; // Server-side
    }

    const item = localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }

    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    return fallback;
  }
}

/**
 * Safe Object.keys() that handles null/undefined
 * @param {Object} obj - Object to get keys from
 * @param {Array} fallback - Fallback array if object is invalid
 * @returns {Array} - Object keys or fallback array
 */
export function safeObjectKeys(obj, fallback = []) {
  try {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return fallback;
    }
    return Object.keys(obj);
  } catch (error) {
    return fallback;
  }
}

/**
 * Safe Object.values() that handles null/undefined
 * @param {Object} obj - Object to get values from
 * @param {Array} fallback - Fallback array if object is invalid
 * @returns {Array} - Object values or fallback array
 */
export function safeObjectValues(obj, fallback = []) {
  try {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return fallback;
    }
    return Object.values(obj);
  } catch (error) {
    return fallback;
  }
}

/**
 * Safe Object.entries() that handles null/undefined
 * @param {Object} obj - Object to get entries from
 * @param {Array} fallback - Fallback array if object is invalid
 * @returns {Array} - Object entries or fallback array
 */
export function safeObjectEntries(obj, fallback = []) {
  try {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return fallback;
    }
    return Object.entries(obj);
  } catch (error) {
    return fallback;
  }
}

/**
 * Create a debounced version of safeFetch for search/autocomplete
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} - Debounced safeFetch function
 */
export function createDebouncedFetch(delay = 300) {
  let timeoutId;

  return function debouncedSafeFetch(url, options) {
    return new Promise(resolve => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await safeFetch(url, options);
        resolve(result);
      }, delay);
    });
  };
}

// Export default safeFetch
export default safeFetch;
