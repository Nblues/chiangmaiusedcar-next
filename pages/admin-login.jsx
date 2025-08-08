import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

// ตรวจสอบการเข้าถึงที่ถูกต้อง
function useAccessCheck() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // วิธีที่ 1: ตรวจสอบ referer header (มาจากเว็บไซต์เดียวกัน)
    const referer = document.referrer;
    const currentDomain = window.location.hostname;

    // วิธีที่ 2: ตรวจสอบ localStorage สำหรับผู้ที่เคยเข้าแล้ว
    const savedAccess = localStorage.getItem('admin_access_granted');

    // วิธีที่ 3: ตรวจสอบ query parameters (สำหรับการเข้าครั้งแรก)
    const { secret, admin_access, key } = router.query;
    const validSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'secure2024';

    // วิธีที่ 4: ตรวจสอบ user agent pattern (ไม่ใช่ bot)
    const userAgent = navigator.userAgent;
    const isBot = /bot|crawl|spider|slurp/i.test(userAgent);

    // วิธีที่ 5: ตรวจสอบการมี JavaScript (bots มักไม่มี)
    const hasJS = typeof window !== 'undefined';

    // เงื่อนไขการเข้าถึง
    const conditions = [
      // มาจากเว็บไซต์เดียวกัน
      referer.includes(currentDomain) || referer.includes('chiangmaiusedcar.com'),

      // เคยได้รับสิทธิ์แล้ว
      savedAccess === 'true',

      // มี secret parameter
      secret === validSecret || admin_access === 'true' || key === 'admin',

      // ไม่ใช่ bot และมี JavaScript
      !isBot && hasJS,

      // เข้าผ่าน HTTPS (ใน production)
      window.location.protocol === 'https:' || window.location.hostname === 'localhost',
    ];

    // ถ้าผ่านเงื่อนไขใดเงื่อนไขหนึ่ง
    if (conditions.some(condition => condition)) {
      setHasAccess(true);
      localStorage.setItem('admin_access_granted', 'true');
      localStorage.setItem('admin_last_access', new Date().toISOString());
    } else {
      // ถ้าไม่ผ่านเงื่อนไข ให้แสดง 404
      router.push('/404');
    }

    setIsLoading(false);
  }, [router]);

  return { hasAccess, isLoading };
}

export default function AdminLogin() {
  const { hasAccess, isLoading: accessLoading } = useAccessCheck();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    twoFactorCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const router = useRouter();

  // ตรวจสอบ lockout - ต้องอยู่ก่อน conditional rendering
  useEffect(() => {
    if (!hasAccess) return; // หยุดการทำงานถ้าไม่มีสิทธิ์

    const lockout = localStorage.getItem('admin_lockout');
    if (lockout) {
      const lockoutEnd = new Date(lockout);
      if (new Date() < lockoutEnd) {
        setLockoutTime(lockoutEnd);
      } else {
        localStorage.removeItem('admin_lockout');
        localStorage.removeItem('login_attempts');
      }
    }

    const savedAttempts = localStorage.getItem('login_attempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, [hasAccess]);

  // ตรวจสอบการเข้าสู่ระบบแล้ว
  useEffect(() => {
    if (!hasAccess) return; // หยุดการทำงานถ้าไม่มีสิทธิ์

    const token = localStorage.getItem('admin_token');
    const tokenExpiry = localStorage.getItem('admin_token_expiry');

    if (token && tokenExpiry && new Date() < new Date(tokenExpiry)) {
      router.push('/admin');
    }
  }, [router, hasAccess]);

  // Loading หรือไม่มีสิทธิ์เข้าถึง
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // หรือ redirect ไปหน้าแรก
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (lockoutTime && new Date() < lockoutTime) {
      setError(`บัญชีถูกล็อก กรุณารอ ${Math.ceil((lockoutTime - new Date()) / 60000)} นาที`);
      return;
    }

    if (attempts >= 5) {
      const lockout = new Date(Date.now() + 30 * 60 * 1000); // ล็อก 30 นาที
      localStorage.setItem('admin_lockout', lockout.toISOString());
      setLockoutTime(lockout);
      setError('บัญชีถูกล็อกเนื่องจากลองเข้าผิด 5 ครั้ง');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': await getClientIP(),
          'User-Agent': navigator.userAgent,
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          twoFactorCode: credentials.twoFactorCode,
          fingerprint: await generateFingerprint(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.requireTwoFactor && !showTwoFactor) {
          setShowTwoFactor(true);
          setError('');
        } else {
          // บันทึก token และข้อมูลเซสชัน
          localStorage.setItem('admin_token', result.token);
          localStorage.setItem('admin_token_expiry', result.expiry);
          localStorage.setItem('admin_user', JSON.stringify(result.user));
          localStorage.removeItem('login_attempts');
          localStorage.removeItem('admin_lockout');

          // บันทึก log การเข้าสู่ระบบ
          await logAdminActivity('LOGIN_SUCCESS');

          router.push('/admin');
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('login_attempts', newAttempts.toString());

        await logAdminActivity('LOGIN_FAILED', {
          username: credentials.username,
          attempts: newAttempts,
        });

        setError(result.message || 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');

        if (newAttempts >= 3) {
          setError(`เข้าสู่ระบบผิด ${newAttempts} ครั้ง เหลืออีก ${5 - newAttempts} ครั้ง`);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  // สร้าง fingerprint สำหรับความปลอดภัย
  const generateFingerprint = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Security fingerprint', 2, 2);

    return btoa(
      JSON.stringify({
        canvas: canvas.toDataURL(),
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        userAgent: navigator.userAgent.substring(0, 100),
      })
    );
  };

  // ดึง IP address
  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // บันทึก activity log
  const logAdminActivity = async (action, data = {}) => {
    try {
      await fetch('/api/admin/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data,
          timestamp: new Date().toISOString(),
          ip: await getClientIP(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  if (lockoutTime && new Date() < lockoutTime) {
    return (
      <>
        <SEO title="บัญชีถูกล็อก - Admin" robots="noindex,nofollow" />
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-red-200">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold text-red-800 mb-4 font-prompt">บัญชีถูกล็อก</h1>
              <p className="text-red-600 mb-4 font-prompt">
                บัญชีถูกล็อกชั่วคราวเนื่องจากลองเข้าสู่ระบบผิดหลายครั้ง
              </p>
              <p className="text-sm text-gray-600 font-prompt">
                เวลาที่เหลือ: {Math.ceil((lockoutTime - new Date()) / 60000)} นาที
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="เข้าสู่ระบบ Admin - ครูหนึ่งรถสวย" robots="noindex,nofollow" />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-prompt">ระบบจัดการ Admin</h1>
            <p className="text-blue-200 font-prompt">ครูหนึ่งรถสวย - เชียงใหม่</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!showTwoFactor ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                      ชื่อผู้ใช้
                    </label>
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={e =>
                        setCredentials(prev => ({ ...prev, username: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-prompt"
                      placeholder="กรอกชื่อผู้ใช้"
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={e =>
                        setCredentials(prev => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-prompt"
                      placeholder="กรอกรหัสผ่าน"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                    รหัส 2FA (6 หลัก)
                  </label>
                  <input
                    type="text"
                    value={credentials.twoFactorCode}
                    onChange={e =>
                      setCredentials(prev => ({ ...prev, twoFactorCode: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                  />
                  <p className="text-sm text-gray-500 mt-2 font-prompt">
                    กรอกรหัส 6 หลักจากแอป Google Authenticator
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm font-prompt">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 font-prompt"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : showTwoFactor ? (
                  'ยืนยันรหัส 2FA'
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </button>

              {showTwoFactor && (
                <button
                  type="button"
                  onClick={() => setShowTwoFactor(false)}
                  className="w-full text-blue-600 hover:text-blue-800 text-sm font-prompt"
                >
                  ← กลับไปกรอกรหัสผ่าน
                </button>
              )}
            </form>

            {/* Security Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center space-y-1 font-prompt">
                <p>🔒 การเข้าสู่ระบบนี้มีการเข้ารหัสและตรวจสอบความปลอดภัยสูง</p>
                <p>📱 รองรับการยืนยันตัวตน 2 ปัจจัย (2FA)</p>
                <p>⏰ เซสชันจะหมดอายุใน 2 ชั่วโมง</p>
                {attempts > 0 && (
                  <p className="text-red-500">⚠️ พยายามเข้าสู่ระบบผิด {attempts} ครั้ง</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
