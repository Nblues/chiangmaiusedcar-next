import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
  loading: () => <div>Loading reCAPTCHA...</div>,
});

export default function TestRecaptcha() {
  const [mounted, setMounted] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const recaptchaRef = useRef();

  // Test keys - these always work for testing
  const SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTest = async () => {
    if (!captcha) {
      alert('Please complete reCAPTCHA first');
      return;
    }

    try {
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captcha }),
      });

      const data = await response.json();
      console.log('Verification result:', data);

      if (data.success) {
        alert('✅ reCAPTCHA verification successful!');
      } else {
        alert('❌ reCAPTCHA verification failed: ' + JSON.stringify(data.errors));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleReset = () => {
    setCaptcha(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">reCAPTCHA Test Page</h1>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-800 mb-2">Environment Variables</h2>
            <div className="text-sm space-y-1">
              <p>
                <strong>Site Key:</strong> {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'Not set'}
              </p>
              <p>
                <strong>Test Site Key:</strong> {SITE_KEY}
              </p>
              <p>
                <strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Captcha Token:</strong> {captcha ? 'Set' : 'Not set'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">reCAPTCHA Widget</h3>
            {mounted && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={SITE_KEY}
                  onChange={setCaptcha}
                  onErrored={error => {
                    console.error('reCAPTCHA error:', error);
                    alert('reCAPTCHA Error occurred! Check console for details.');
                  }}
                  onExpired={() => {
                    console.log('reCAPTCHA expired');
                    setCaptcha(null);
                    alert('reCAPTCHA expired, please try again');
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleTest}
              disabled={!captcha}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Verification
            </button>
            <button onClick={handleReset} className="px-6 py-2 bg-gray-600 text-white rounded-lg">
              Reset
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Complete the reCAPTCHA checkbox above</li>
              <li>Click &quot;Test Verification&quot; to verify with server</li>
              <li>Check browser console for detailed logs</li>
              <li>
                If you see &quot;Invalid key type&quot; error, the reCAPTCHA key configuration is
                wrong
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Common Issues</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>
                <strong>Invalid key type:</strong> Site key doesn&apos;t match the reCAPTCHA version
              </li>
              <li>
                <strong>Domain mismatch:</strong> Site key is registered for different domain
              </li>
              <li>
                <strong>Secret key mismatch:</strong> Server secret key doesn&apos;t match site key
              </li>
              <li>
                <strong>Network error:</strong> Cannot reach Google&apos;s reCAPTCHA servers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
