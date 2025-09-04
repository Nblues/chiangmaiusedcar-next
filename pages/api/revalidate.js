// API route for on-demand revalidation (Pages Router version)
// Usage: POST /api/revalidate?secret=YOUR_SECRET&tag=home&path=/

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { secret, tag, path } = req.query;

    // Verify secret to prevent abuse
    if (secret !== process.env.REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Invalid secret' });
    }

    // For Pages Router, we use revalidatePath instead of revalidateTag
    if (path) {
      // Revalidate specific path
      await res.revalidate(path);
      return res.json({ 
        revalidated: true, 
        path,
        timestamp: new Date().toISOString()
      });
    }

    // Default paths to revalidate
    const defaultPaths = ['/', '/cars', '/about', '/contact'];
    
    if (tag === 'home') {
      await res.revalidate('/');
    } else if (tag === 'cars') {
      await res.revalidate('/cars');
      await res.revalidate('/all-cars');
    } else if (tag === 'all') {
      // Revalidate multiple paths
      for (const defaultPath of defaultPaths) {
        await res.revalidate(defaultPath);
      }
    } else {
      return res.status(400).json({ 
        message: 'Missing valid tag or path parameter',
        supportedTags: ['home', 'cars', 'all'],
        usage: 'POST /api/revalidate?secret=YOUR_SECRET&tag=home'
      });
    }

    return res.json({ 
      revalidated: true, 
      tag,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return res.status(500).json({ 
      message: 'Error revalidating cache',
      error: error.message 
    });
  }
}
