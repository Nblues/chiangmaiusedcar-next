import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import SEO from '../../components/SEO';

// Add displayName for admin layout detection
function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // เรียก API login
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      // ป้องกัน JSON parse error เมื่อเซิร์ฟเวอร์ตอบกลับว่างเปล่าหรือไม่ใช่ JSON
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && data?.success) {
        // Login สำเร็จ - redirect ไป dashboard
        router.push('/admin/dashboard');
      } else {
        // แสดงข้อความตามสถานะที่เจอ เพื่อบอกสาเหตุชัดเจน
        if (response.status === 429) {
          setError('พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอประมาณ 10 นาทีแล้วลองใหม่');
        } else if (response.status === 401) {
          setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        } else if (response.status === 400) {
          setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
        } else if (response.status === 405) {
          setError('วิธีการเรียกไม่ถูกต้อง (Method Not Allowed)');
        } else if (response.status === 500) {
          const stage = data?.stage ? ` (stage: ${data.stage})` : '';
          setError(`เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์${stage}`);
        } else {
          setError(data?.error || 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่');
        }
      }
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : '';

      // Most common case in dev: server not reachable / dev server stopped
      const origin =
        typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
      const hint = origin
        ? `ตรวจสอบว่าเปิดเว็บจาก ${origin} และรัน pnpm dev อยู่`
        : 'ตรวจสอบว่าเซิร์ฟเวอร์กำลังรัน (pnpm dev)';

      setError(`ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (${hint})${message ? `: ${message}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent/10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO
        title="เข้าสู่ระบบผู้ดูแลระบบ"
        description="เข้าสู่ระบบผู้ดูแลระบบหลังบ้าน ครูหนึ่งรถสวย"
        url="/admin/login"
        pageType="default"
        noindex={true}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative h-12 w-12">
            <Image src="/favicon.png" alt="ครูหนึ่งรถสวย" fill className="object-contain" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900 font-prompt">
          เข้าสู่ระบบผู้ดูแล
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 font-prompt">
          ระบบจัดการหลังบ้าน ครูหนึ่งรถสวย
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-prompt">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="form-label">
                ชื่อผู้ใช้
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={e => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="form-input w-full"
                  placeholder="ชื่อผู้ใช้"
                  autoComplete="username"
                  inputMode="text"
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                รหัสผ่าน
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input w-full"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-2xl font-prompt disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary hover:text-primary/70 font-prompt">
              ← กลับไปหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Set displayName for admin layout detection
AdminLogin.displayName = 'AdminLogin';

// Use custom layout (minimal, no Navbar/Footer/PWA)
AdminLogin.getLayout = function getLayout(page) {
  return (
    <main id="main" role="main">
      {page}
    </main>
  );
};

export default AdminLogin;
