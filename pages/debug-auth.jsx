import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DebugAuth() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState('');

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');

    setAuthStatus(`
      admin_auth: ${adminAuth}
      adminLoggedIn: ${adminLoggedIn}
    `);
  }, []);

  const doLogin = () => {
    localStorage.setItem('admin_auth', 'true');
    localStorage.setItem('adminLoggedIn', 'true');
    alert('Login set! Going to articles...');
    router.push('/admin/articles');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Debug Authentication</h1>

      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h3>Local Storage Status:</h3>
        <pre>{authStatus}</pre>
      </div>

      <button
        onClick={doLogin}
        style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        🚀 Force Login & Go to Articles
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Quick Links:</h3>
        <ul>
          <li>
            <a href="/admin/login">Login Page</a>
          </li>
          <li>
            <a href="/admin/articles">Articles Page</a>
          </li>
          <li>
            <a href="/admin/articles/new">New Article</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
