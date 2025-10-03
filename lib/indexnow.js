/**
 * IndexNow API Integration for Bing 2025
 * Real-time URL submission for AI-powered search
 *
 * @see https://www.indexnow.org/
 * @see https://blogs.bing.com/webmaster/May-2025/IndexNow-Drives-Smarter-and-Faster-Content-Discovery
 */

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_URL = process.env.SITE_URL || 'https://www.chiangmaiusedcar.com';

// Generate a simple API key (or use existing one from env)
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '8f5e9d2c4a1b6e3f7d9c8a5b4e2f1a3d';

/**
 * Submit single URL to IndexNow
 * @param {string} url - Full URL to submit
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitUrlToIndexNow(url) {
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: [url],
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: `Successfully submitted ${url} to IndexNow`,
      };
    }

    return {
      success: false,
      message: `IndexNow responded with status ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `IndexNow error: ${error.message}`,
    };
  }
}

/**
 * Submit multiple URLs to IndexNow (batch)
 * @param {string[]} urls - Array of full URLs
 * @returns {Promise<{success: boolean, message: string, submitted: number}>}
 */
export async function submitBatchToIndexNow(urls) {
  if (!urls || urls.length === 0) {
    return {
      success: false,
      message: 'No URLs provided',
      submitted: 0,
    };
  }

  // IndexNow supports up to 10,000 URLs per request
  const MAX_BATCH_SIZE = 10000;
  const urlsToSubmit = urls.slice(0, MAX_BATCH_SIZE);

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urlsToSubmit,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: `Successfully submitted ${urlsToSubmit.length} URLs to IndexNow`,
        submitted: urlsToSubmit.length,
      };
    }

    return {
      success: false,
      message: `IndexNow responded with status ${response.status}`,
      submitted: 0,
    };
  } catch (error) {
    return {
      success: false,
      message: `IndexNow error: ${error.message}`,
      submitted: 0,
    };
  }
}

/**
 * Submit new car to IndexNow (for use in API routes)
 * @param {string} carHandle - Car handle/slug
 */
export async function submitNewCar(carHandle) {
  const carUrl = `${SITE_URL}/car/${carHandle}`;
  return await submitUrlToIndexNow(carUrl);
}

/**
 * Submit all cars to IndexNow (initial sync)
 * @param {Array} cars - Array of car objects with handle property
 */
export async function submitAllCars(cars) {
  if (!cars || cars.length === 0) {
    return {
      success: false,
      message: 'No cars provided',
      submitted: 0,
    };
  }

  const carUrls = cars.filter(car => car.handle).map(car => `${SITE_URL}/car/${car.handle}`);

  return await submitBatchToIndexNow(carUrls);
}

/**
 * Get IndexNow key for verification file
 */
export function getIndexNowKey() {
  return INDEXNOW_KEY;
}
