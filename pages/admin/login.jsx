import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

export default function AdminLogin() {
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
      // ในการใช้งานจริงจะตรวจสอบกับ API
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // Set both authentication keys
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('adminLoggedIn', 'true');
        router.push('/admin/articles');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>เข้าสู่ระบบ Admin | ครูหนึ่งรถสวย</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative h-12 w-12">
            <Image src="/favicon.png" alt="ครูหนึ่งรถสวย" fill className="object-contain" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 font-prompt">
          เข้าสู่ระบบ Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-prompt">
          ระบบจัดการหลังบ้าน ครูหนึ่งรถสวย
        </p>

        {/* Quick Login Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setCredentials({ username: 'admin', password: 'admin123' });
              localStorage.setItem('admin_auth', 'true');
              localStorage.setItem('adminLoggedIn', 'true');
              alert('Login สำเร็จ! กำลังไปหน้าจัดการบทความ...');
              router.push('/admin/articles');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-prompt"
          >
            🚀 Quick Login (admin/admin123)
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-prompt">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 font-prompt"
              >
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-prompt"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 font-prompt"
              >
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-prompt"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed font-prompt"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-prompt">ข้อมูลทดสอบ</span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 font-prompt">
              <p className="font-semibold mb-2">สำหรับการทดสอบ:</p>
              <p>
                ชื่อผู้ใช้: <code className="bg-gray-200 px-1 rounded">admin</code>
              </p>
              <p>
                รหัสผ่าน: <code className="bg-gray-200 px-1 rounded">admin123</code>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-primary hover:text-primary/70 font-prompt">
              ← กลับไปหน้าแรก
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
