import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';

// Dynamic imports เพื่อป้องกัน SSR issues
const AdminImageManager = dynamic(() => Promise.resolve(AdminImageManagerComponent), {
  ssr: false,
});
const AdminBlogManager = dynamic(() => Promise.resolve(AdminBlogManagerComponent), { ssr: false });

// Hook สำหรับตรวจสอบสิทธิ์ Admin พร้อม access control
function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // ขั้นตอนที่ 1: ตรวจสอบการเข้าถึงพื้นฐาน
    const checkBasicAccess = () => {
      const { secret, admin_access } = router.query;
      const validSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'secure2024';
      const savedAccess = localStorage.getItem('admin_access_granted');

      if (admin_access === 'true' || secret === validSecret || savedAccess === 'true') {
        setHasAccess(true);
        localStorage.setItem('admin_access_granted', 'true');
        return true;
      }

      // ถ้าไม่มีสิทธิ์พื้นฐาน redirect ไปหน้าแรก
      router.push('/');
      return false;
    };

    // ขั้นตอนที่ 2: ตรวจสอบการยืนยันตัวตน
    const checkAuth = () => {
      if (!checkBasicAccess()) return;

      const token = localStorage.getItem('admin_token');
      const expiry = localStorage.getItem('admin_token_expiry');

      if (!token || !expiry || new Date() >= new Date(expiry)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_expiry');
        localStorage.removeItem('admin_user');
        router.push('/admin-login?admin_access=true');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    // ตรวจสอบทุก 30 วินาที
    const interval = setInterval(checkAuth, 30000);

    return () => clearInterval(interval);
  }, [router]);

  return { isAuthenticated, isLoading, hasAccess };
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, hasAccess } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('images');
  const router = useRouter();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ไม่มีสิทธิ์เข้าถึง
  if (!hasAccess || !isAuthenticated) {
    return null;
  }

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_access_granted');
    router.push('/');
  };

  // Component สำหรับจัดการรูปภาพ
  function AdminImageManagerComponent() {
    const [uploadStatus, setUploadStatus] = useState('');
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [uploadType, setUploadType] = useState('article'); // article, cover, content

    // อัปโหลดรูปภาพ
    const handleImageUpload = async event => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      setProcessing(true);
      setUploadStatus('กำลังอัปโหลดและประมวลผลรูป...');

      const results = [];

      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('context', uploadType);

          // กำหนดขนาดตามประเภท
          if (uploadType === 'cover') {
            formData.append('quality', '90');
            formData.append('width', '1200');
            formData.append('height', '630');
          } else if (uploadType === 'content') {
            formData.append('quality', '85');
            formData.append('width', '800');
          } else {
            formData.append('quality', '80');
            formData.append('width', '600');
          }

          const response = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
            },
            body: formData,
          });

          const result = await response.json();

          if (response.ok) {
            results.push({
              original: file.name,
              ...result,
            });
            setUploadStatus(`ประมวลผลสำเร็จ: ${file.name}`);
          } else {
            results.push({
              original: file.name,
              error: result.error || 'อัปโหลดไม่สำเร็จ',
            });
          }
        } catch (error) {
          results.push({
            original: file.name,
            error: error.message,
          });
        }
      }

      setResults(results);
      setProcessing(false);
      setUploadStatus('ประมวลผลเสร็จสิ้น');
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">อัปโหลดและจัดการรูปภาพ</h2>

          {/* เลือกประเภทรูป */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทรูปภาพ</label>
            <select
              value={uploadType}
              onChange={e => setUploadType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="article">รูปบทความ (600px, คุณภาพ 80%)</option>
              <option value="cover">รูปปก (1200x630px, คุณภาพ 90%)</option>
              <option value="content">รูปเนื้อหา (800px, คุณภาพ 85%)</option>
            </select>
          </div>

          {/* อัปโหลดไฟล์ */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกรูปภาพ (JPG, PNG, WebP)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={processing}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* สถานะ */}
          {uploadStatus && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-blue-700">{uploadStatus}</p>
              {processing && (
                <div className="mt-2">
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-r-transparent rounded-full"></div>
                  <span className="ml-2 text-sm">กำลังประมวลผล...</span>
                </div>
              )}
            </div>
          )}

          {/* ผลลัพธ์ */}
          {results && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">ผลลัพธ์การอัปโหลด</h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium">{result.original}</h4>
                    {result.error ? (
                      <p className="text-red-600 text-sm mt-1">❌ {result.error}</p>
                    ) : (
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>✅ ประมวลผลสำเร็จ</p>
                        <p>
                          📁 ไฟล์ต้นฉบับ: <code>{result.original_url}</code>
                        </p>
                        <p>
                          🔄 ไฟล์ WebP: <code>{result.webp_url}</code>
                        </p>
                        <p>
                          📏 ขนาด: {result.width}x{result.height}px
                        </p>
                        <p>💾 ขนาดไฟล์: {result.file_size}</p>
                        {result.savings && (
                          <p className="text-green-600">💰 ประหยัดพื้นที่: {result.savings}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Component สำหรับจัดการบทความ
  function AdminBlogManagerComponent() {
    const [articles, setArticles] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [newArticle, setNewArticle] = useState({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: '',
      published: false,
    });

    // โหลดบทความ
    const loadArticles = async () => {
      try {
        const response = await fetch('/api/admin/articles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    };

    useEffect(() => {
      loadArticles();
    }, []);

    // บันทึกบทความ
    const saveArticle = async () => {
      try {
        const articleData = {
          ...newArticle,
          tags: newArticle.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
        };

        const response = await fetch('/api/admin/articles', {
          method: editingArticle ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: JSON.stringify(
            editingArticle ? { ...articleData, id: editingArticle.id } : articleData
          ),
        });

        if (response.ok) {
          setShowEditor(false);
          setEditingArticle(null);
          setNewArticle({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            coverImage: '',
            tags: '',
            published: false,
          });
          loadArticles();
          alert('บันทึกบทความสำเร็จ!');
        } else {
          const error = await response.json();
          alert('เกิดข้อผิดพลาด: ' + error.error);
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
      }
    };

    // แก้ไขบทความ
    const editArticle = article => {
      setEditingArticle(article);
      setNewArticle({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage || '',
        tags: article.tags?.join(', ') || '',
        published: article.published,
      });
      setShowEditor(true);
    };

    // ลบบทความ
    const deleteArticle = async articleId => {
      if (!confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) return;

      try {
        const response = await fetch('/api/admin/articles', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: JSON.stringify({ id: articleId }),
        });

        if (response.ok) {
          loadArticles();
          alert('ลบบทความสำเร็จ!');
        } else {
          const error = await response.json();
          alert('เกิดข้อผิดพลาด: ' + error.error);
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
      }
    };

    return (
      <div className="space-y-6">
        {!showEditor ? (
          <>
            {/* รายการบทความ */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">จัดการบทความ</h2>
                <button
                  onClick={() => setShowEditor(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
                >
                  + เขียนบทความใหม่
                </button>
              </div>

              <div className="space-y-4">
                {articles.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีบทความ</p>
                ) : (
                  articles.map(article => (
                    <div key={article.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{article.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{article.excerpt}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>
                              📅 {new Date(article.createdAt).toLocaleDateString('th-TH')}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                article.published
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {article.published ? 'เผยแพร่แล้ว' : 'ร่าง'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => editArticle(article)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Editor */
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingArticle ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}
              </h2>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingArticle(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ❌ ปิด
              </button>
            </div>

            <div className="space-y-4">
              {/* ชื่อบทความ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อบทความ</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={e => {
                    setNewArticle(prev => ({
                      ...prev,
                      title: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9ก-๙\s]/g, '')
                        .replace(/\s+/g, '-'),
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="ชื่อบทความ..."
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={newArticle.slug}
                  onChange={e => setNewArticle(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="url-slug"
                />
              </div>

              {/* สรุป */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สรุปบทความ</label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={e => setNewArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="สรุปบทความสั้นๆ..."
                />
              </div>

              {/* รูปปก */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปปก</label>
                <input
                  type="text"
                  value={newArticle.coverImage}
                  onChange={e => setNewArticle(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="https://example.com/image.webp"
                />
              </div>

              {/* แท็ก */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  แท็ก (คั่นด้วยเครื่องหมายจุลภาค)
                </label>
                <input
                  type="text"
                  value={newArticle.tags}
                  onChange={e => setNewArticle(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="รถยนต์, เชียงใหม่, รถมือสอง"
                />
              </div>

              {/* เนื้อหา */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เนื้อหาบทความ (Markdown)
                </label>
                <textarea
                  value={newArticle.content}
                  onChange={e => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md font-mono"
                  rows={15}
                  placeholder="# หัวข้อ

เนื้อหาบทความ...

## หัวข้อย่อย

- รายการ 1
- รายการ 2

![รูปภาพ](url)"
                />
              </div>

              {/* สถานะการเผยแพร่ */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={newArticle.published}
                  onChange={e => setNewArticle(prev => ({ ...prev, published: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  เผยแพร่บทความ
                </label>
              </div>

              {/* ปุ่มบันทึก */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={saveArticle}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  {editingArticle ? 'อัปเดต' : 'บันทึก'}บทความ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <SEO title="ระบบจัดการ - ครูหนึ่งรถสวย" description="ระบบจัดการเว็บไซต์ รถมือสองเชียงใหม่" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-prompt font-semibold text-gray-900">
                ระบบจัดการเว็บไซต์
              </h1>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('images')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'images'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📸 จัดการรูปภาพ
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ✍️ จัดการบทความ
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'images' && <AdminImageManager />}
          {activeTab === 'articles' && <AdminBlogManager />}
        </div>
      </div>
    </>
  );
}
