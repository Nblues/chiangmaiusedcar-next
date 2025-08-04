export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  try {
    const secretKey =
      process.env.RECAPTCHA_SECRET_KEY || '6LevqZkrAAAAAKl6fMzyeYyHFOEMLATFnilQCj_U';

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true, score: data.score });
    } else {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
        errors: data['error-codes'],
      });
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
