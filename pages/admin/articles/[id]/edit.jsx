import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getArticleById, saveArticle } from '../../../../lib/articles';

// Import Modern Article Editor dynamically
const ModernArticleEditor = dynamic(() => import('../../../../components/ModernArticleEditor'), {
  ssr: false,
});
// Import Bootstrap Rich Text Editor as alternative
const BootstrapRichTextEditor = dynamic(
  () => import('../../../../components/BootstrapRichTextEditor'),
  { ssr: false }
);
// Import Image Gallery dynamically
const ImageGallery = dynamic(() => import('../../../../components/ImageGallery'), { ssr: false });

const categories = ['ข่าวรถใหม่', 'เปรียบเทียบ', 'คำแนะนำ', 'การเงิน', 'รถไฟฟ้า', 'ประกัน'];

export default function EditArticle() {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'ข่าวรถใหม่',
    status: 'draft',
    featured: false,
    keywords: '',
    author: 'ครูหนึ่งรถสวย',
    image: '/herobanner/promotioncar.webp',
  });

  const [originalArticle, setOriginalArticle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editorType, setEditorType] = useState('modern'); // modern, bootstrap

  // ตรวจสอบการ Authentication
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  // โหลดข้อมูลบทความ
  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getArticleById(id);
      if (data) {
        setArticle(data);
        setOriginalArticle(data);
      } else {
        alert('ไม่พบบทความที่ต้องการแก้ไข');
        router.push('/admin/articles');
      }
    } catch (error) {
      // บันทึก error ไว้ในระบบ logging
      alert('ไม่สามารถโหลดข้อมูลบทความได้');
      router.push('/admin/articles');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      loadArticle();
    }
  }, [isAuthenticated, id, loadArticle]);

  // ตรวจสอบการเปลี่ยนแปลง
  useEffect(() => {
    if (originalArticle) {
      const changed = JSON.stringify(article) !== JSON.stringify(originalArticle);
      setHasChanges(changed);
    }
  }, [article, originalArticle]);

  const handleInputChange = (field, value) => {
    setArticle(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = imageUrl => {
    setArticle(prev => ({ ...prev, image: imageUrl }));
    setShowImageGallery(false);
  };

  const handleSave = async (status = article.status) => {
    if (!article.title.trim()) {
      alert('กรุณาใส่หัวข้อบทความ');
      return;
    }

    if (!article.excerpt.trim()) {
      alert('กรุณาใส่คำอธิบายสั้น');
      return;
    }

    if (!article.content.trim()) {
      alert('กรุณาใส่เนื้อหาบทความ');
      return;
    }

    try {
      setSaving(true);

      const articleData = {
        ...article,
        status,
        readTime: calculateReadTime(article.content),
      };

      const result = await saveArticle(articleData);

      if (result) {
        setOriginalArticle(result);
        setArticle(result);
        alert(`${status === 'published' ? 'เผยแพร่' : 'บันทึก'}บทความเรียบร้อยแล้ว`);

        if (status === 'published') {
          router.push('/admin/articles');
        }
      } else {
        alert('ไม่สามารถบันทึกบทความได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกบทความ: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const calculateReadTime = content => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // 200 words per minute
    return `${minutes} นาที`;
  };

  const getArticleStats = () => {
    const text = article.content.replace(/<[^>]*>/g, '');
    return {
      chars: text.length,
      words: text.split(/\s+/).filter(word => word.length > 0).length,
      readTime: calculateReadTime(article.content),
    };
  };

  // ป้องกันการออกจากหน้าโดยไม่บันทึก
  useEffect(() => {
    const handleBeforeUnload = e => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isAuthenticated ? 'กำลังตรวจสอบสิทธิ์...' : 'กำลังโหลดข้อมูลบทความ...'}
          </p>
        </div>
      </div>
    );
  }

  const stats = getArticleStats();

  return (
    <>
      <Head>
        <title>แก้ไขบทความ: {article.title} | ครูหนึ่งรถสวย Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Bootstrap CSS - Force Reload */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        key="bootstrap-css"
      />

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2">
            <div className="list-group">
              <Link href="/admin" className="list-group-item list-group-item-action">
                🏠 หน้าหลัก Admin
              </Link>
              <Link href="/admin/articles" className="list-group-item list-group-item-action">
                📝 จัดการบทความ
              </Link>
              <Link href="/admin/articles/new" className="list-group-item list-group-item-action">
                ➕ เขียนบทความใหม่
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3">✏️ แก้ไขบทความ</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/admin/articles">จัดการบทความ</Link>
                    </li>
                    <li className="breadcrumb-item active">แก้ไข: {article.title}</li>
                  </ol>
                </nav>
              </div>

              <div className="d-flex gap-2">
                {hasChanges && <span className="badge bg-warning text-dark">มีการเปลี่ยนแปลง</span>}
                <Link href="/admin/articles" className="btn btn-outline-secondary">
                  ← กลับ
                </Link>
              </div>
            </div>

            {/* Article Form */}
            <div className="row">
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">ข้อมูลพื้นฐาน</h5>
                  </div>
                  <div className="card-body">
                    {/* Title */}
                    <div className="mb-3">
                      <label htmlFor="article-title" className="form-label">
                        หัวข้อบทความ *
                      </label>
                      <input
                        id="article-title"
                        type="text"
                        value={article.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        placeholder="หัวข้อบทความที่น่าสนใจ..."
                        className="form-control"
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="mb-3">
                      <label htmlFor="article-excerpt" className="form-label">
                        คำอธิบายสั้น *
                      </label>
                      <textarea
                        id="article-excerpt"
                        value={article.excerpt}
                        onChange={e => handleInputChange('excerpt', e.target.value)}
                        placeholder="คำอธิบายสั้นๆ เพื่อดึงดูดผู้อ่าน..."
                        rows={3}
                        className="form-control"
                      />
                    </div>

                    {/* Keywords */}
                    <div className="mb-3">
                      <label htmlFor="article-keywords" className="form-label">
                        คำสำคัญ SEO
                      </label>
                      <input
                        id="article-keywords"
                        type="text"
                        value={article.keywords}
                        onChange={e => handleInputChange('keywords', e.target.value)}
                        placeholder="คำสำคัญสำหรับ SEO (คั่นด้วยจุลภาค)"
                        className="form-control"
                      />
                      <div className="form-text">
                        ใส่คำสำคัญที่เกี่ยวข้องกับบทความ คั่นด้วยจุลภาค
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="card mb-4">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">เนื้อหาบทความ</h5>

                      {/* Editor Type Selector */}
                      <div className="d-flex align-items-center">
                        <span className="me-2 text-sm">โหมดแก้ไข:</span>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className={`btn ${editorType === 'modern' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setEditorType('modern')}
                          >
                            🚀 Modern
                          </button>
                          <button
                            type="button"
                            className={`btn ${editorType === 'bootstrap' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setEditorType('bootstrap')}
                          >
                            📋 Classic
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    {editorType === 'modern' ? (
                      <ModernArticleEditor
                        value={article.content}
                        onChange={content => handleInputChange('content', content)}
                        placeholder="แก้ไขเนื้อหาบทความด้วย Modern Editor 2025 ที่ทันสมัย..."
                        articleId={`edit-${id}`}
                      />
                    ) : (
                      <BootstrapRichTextEditor
                        value={article.content}
                        onChange={content => handleInputChange('content', content)}
                        placeholder="เขียนเนื้อหาบทความที่มีประโยชน์ พร้อม Bootstrap Templates สำเร็จรูป..."
                        articleId={`edit-${id}`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                {/* Article Stats */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="card-title mb-0">📊 สถิติบทความ</h6>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="text-primary h5 mb-0">{stats.words}</div>
                        <small className="text-muted">คำ</small>
                      </div>
                      <div className="col-4">
                        <div className="text-success h5 mb-0">{stats.chars}</div>
                        <small className="text-muted">ตัวอักษร</small>
                      </div>
                      <div className="col-4">
                        <div className="text-info h5 mb-0">{stats.readTime}</div>
                        <small className="text-muted">อ่าน</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="card-title mb-0">⚙️ การตั้งค่า</h6>
                  </div>
                  <div className="card-body">
                    {/* Category */}
                    <div className="mb-3">
                      <label htmlFor="article-category" className="form-label">
                        หมวดหมู่
                      </label>
                      <select
                        id="article-category"
                        value={article.category}
                        onChange={e => handleInputChange('category', e.target.value)}
                        className="form-select"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <label htmlFor="article-status" className="form-label">
                        สถานะ
                      </label>
                      <select
                        id="article-status"
                        value={article.status}
                        onChange={e => handleInputChange('status', e.target.value)}
                        className="form-select"
                      >
                        <option value="draft">ร่าง</option>
                        <option value="published">เผยแพร่</option>
                      </select>
                    </div>

                    {/* Featured */}
                    <div className="form-check">
                      <input
                        type="checkbox"
                        checked={article.featured}
                        onChange={e => handleInputChange('featured', e.target.checked)}
                        className="form-check-input"
                        id="featured"
                      />
                      <label className="form-check-label" htmlFor="featured">
                        ⭐ บทความเด่น
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="card-title mb-0">🖼️ รูปปก</h6>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <Image
                        src={article.image}
                        alt="รูปปกบทความ"
                        width={200}
                        height={120}
                        className="rounded border"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      onClick={() => setShowImageGallery(!showImageGallery)}
                      className="btn btn-outline-primary w-100"
                    >
                      เลือกรูปปกใหม่
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="card">
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                        className="btn btn-outline-primary"
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            กำลังบันทึก...
                          </>
                        ) : (
                          '💾 บันทึกร่าง'
                        )}
                      </button>

                      <button
                        onClick={() => handleSave('published')}
                        disabled={saving}
                        className="btn btn-success"
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            กำลังเผยแพร่...
                          </>
                        ) : (
                          '🚀 อัปเดตและเผยแพร่'
                        )}
                      </button>

                      <Link
                        href={`/features/${id}`}
                        className="btn btn-outline-info"
                        target="_blank"
                      >
                        👁️ ดูบทความ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery Modal */}
            {showImageGallery && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">เลือกรูปปก</h5>
                      <button
                        onClick={() => setShowImageGallery(false)}
                        className="btn-close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <ImageGallery
                        articleId={`edit-${id}`}
                        onImageSelect={handleImageSelect}
                        selectMode={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bootstrap JS */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        defer
      />
    </>
  );
}
