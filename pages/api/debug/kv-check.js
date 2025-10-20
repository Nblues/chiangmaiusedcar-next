// Debug endpoint to check KV configuration
export default async function handler(req, res) {
  try {
    // Check if KV env variables exist
    const hasKvUrl = !!process.env.KV_REST_API_URL;
    const hasKvToken = !!process.env.KV_REST_API_TOKEN;
    const hasKvReadToken = !!process.env.KV_REST_API_READ_ONLY_TOKEN;

    const envCheck = {
      KV_REST_API_URL: hasKvUrl ? 'Present' : 'Missing',
      KV_REST_API_TOKEN: hasKvToken ? 'Present' : 'Missing',
      KV_REST_API_READ_ONLY_TOKEN: hasKvReadToken ? 'Present' : 'Missing',
    };

    // Try to import KV
    let kvImportError = null;
    try {
      const { kv } = await import('@vercel/kv');
      // Try a simple operation
      await kv.set('test:connection', Date.now(), { ex: 10 });
      const testValue = await kv.get('test:connection');
      await kv.del('test:connection');

      return res.status(200).json({
        status: 'success',
        message: 'KV is working correctly',
        envCheck,
        kvTest: {
          writeTest: 'OK',
          readTest: 'OK',
          deleteTest: 'OK',
          testValue,
        },
      });
    } catch (error) {
      kvImportError = error.message;
    }

    return res.status(200).json({
      status: 'partial',
      message: 'KV env variables exist but KV operations failed',
      envCheck,
      kvError: kvImportError,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
