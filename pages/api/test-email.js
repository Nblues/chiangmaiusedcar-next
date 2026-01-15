// Test EmailJS configuration
export default async function handler(req, res) {
  // Never expose diagnostic endpoints in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  // Allow both GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check EmailJS environment variables
    const emailConfig = {
      'Service ID': process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        ? '✅ Configured'
        : '❌ Missing NEXT_PUBLIC_EMAILJS_SERVICE_ID',
      'Template ID': process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        ? '✅ Configured'
        : '❌ Missing NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
      'Public Key': process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        ? '✅ Configured'
        : '❌ Missing NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
    };

    const hasAllConfig = Object.values(emailConfig).every(status => status.includes('✅'));

    if (!hasAllConfig) {
      return res.status(400).json({
        success: false,
        error: 'EmailJS configuration incomplete',
        config: emailConfig,
      });
    }

    // If configuration is complete
    return res.status(200).json({
      success: true,
      message: 'EmailJS configuration is complete',
      config: emailConfig,
      note: 'Actual email sending test requires client-side implementation',
    });
  } catch (error) {
    console.error('EmailJS test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
