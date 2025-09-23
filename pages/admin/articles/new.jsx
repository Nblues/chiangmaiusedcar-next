import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import Modern Article Editor dynamically
const ModernArticleEditor = dynamic(() => import('../../../components/ModernArticleEditor'), {
  ssr: false,
});
// Import Bootstrap Rich Text Editor as alternative
const BootstrapRichTextEditor = dynamic(
  () => import('../../../components/BootstrapRichTextEditor'),
  { ssr: false }
);
// Import Image Gallery dynamically
const ImageGallery = dynamic(() => import('../../../components/ImageGallery'), { ssr: false });

const categories = ['ข่าวรถใหม่', 'เปรียบเทียบ', 'คำแนะนำ', 'การเงิน', 'รถไฟฟ้า', 'ประกัน'];

export default function NewArticle() {
  const router = useRouter();

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

  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [editorType, setEditorType] = useState('modern'); // modern, bootstrap

  // Authentication check
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      setIsAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const handleInputChange = (field, value) => {
    setArticle(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (status = 'draft') => {
    setSaving(true);
    try {
      // ในการใช้งานจริงจะส่งไป API
      // const articleData = {
      //   ...article,
      //   status,
      //   modifiedAt: new Date().toISOString().split('T')[0]
      // };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(status === 'published' ? 'เผยแพร่บทความสำเร็จ!' : 'บันทึกร่างสำเร็จ!');
      router.push('/admin/articles');
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle image selection from gallery
  const handleImageSelect = imageData => {
    handleInputChange('image', imageData);
    setShowImageGallery(false);
  };

  // ฟังก์ชันคำนวณสถิติบทความ
  const getArticleStats = () => {
    const title = article.title || '';
    const excerpt = article.excerpt || '';
    const content = article.content || '';

    // นับคำ (แยกด้วยช่องว่าง)
    const titleWords = title.trim() ? title.trim().split(/\s+/).length : 0;
    const excerptWords = excerpt.trim() ? excerpt.trim().split(/\s+/).length : 0;
    const contentWords = content.trim() ? content.trim().split(/\s+/).length : 0;

    // นับตัวอักษร
    const titleChars = title.length;
    const excerptChars = excerpt.length;
    const contentChars = content.length;

    // คำนวณเวลาอ่าน (250 คำต่อนาที)
    const totalWords = titleWords + excerptWords + contentWords;
    const readingTime = Math.ceil(totalWords / 250);

    return {
      title: { words: titleWords, chars: titleChars },
      excerpt: { words: excerptWords, chars: excerptChars },
      content: { words: contentWords, chars: contentChars },
      total: { words: totalWords, readingTime },
    };
  };

  // ฟังก์ชันตรวจสอบคุณภาพบทความ
  const getQualityChecks = () => {
    const stats = getArticleStats();
    const checks = [];

    // ตรวจสอบหัวข้อ
    if (stats.title.chars < 30) {
      checks.push({
        type: 'warning',
        field: 'title',
        message: 'หัวข้อสั้นเกินไป (ควร 30-60 ตัวอักษร)',
      });
    } else if (stats.title.chars > 60) {
      checks.push({
        type: 'warning',
        field: 'title',
        message: 'หัวข้อยาวเกินไป (ควร 30-60 ตัวอักษร)',
      });
    } else {
      checks.push({ type: 'success', field: 'title', message: 'ความยาวหัวข้อเหมาะสม' });
    }

    // ตรวจสอบคำอธิบาย
    if (stats.excerpt.chars > 0 && stats.excerpt.chars < 120) {
      checks.push({
        type: 'warning',
        field: 'excerpt',
        message: 'คำอธิบายสั้นเกินไป (ควร 120-160 ตัวอักษร)',
      });
    } else if (stats.excerpt.chars > 160) {
      checks.push({
        type: 'warning',
        field: 'excerpt',
        message: 'คำอธิบายยาวเกินไป (ควร 120-160 ตัวอักษร)',
      });
    } else if (stats.excerpt.chars >= 120) {
      checks.push({ type: 'success', field: 'excerpt', message: 'ความยาวคำอธิบายเหมาะสม' });
    }

    // ตรวจสอบเนื้อหา
    if (stats.content.words < 300) {
      checks.push({
        type: 'error',
        field: 'content',
        message: 'เนื้อหาสั้นเกินไป (ควรอย่างน้อย 300 คำ)',
      });
    } else if (stats.content.words < 600) {
      checks.push({
        type: 'warning',
        field: 'content',
        message: 'เนื้อหาค่อนข้างสั้น (แนะนำ 600-1500 คำ)',
      });
    } else if (stats.content.words > 2000) {
      checks.push({
        type: 'warning',
        field: 'content',
        message: 'เนื้อหายาวมาก (อาจควรแบ่งเป็นหลายบทความ)',
      });
    } else {
      checks.push({ type: 'success', field: 'content', message: 'ความยาวเนื้อหาเหมาะสม' });
    }

    return checks;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>เขียนบทความใหม่ | ครูหนึ่งรถสวย Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/articles" className="text-gray-600 hover:text-gray-900 mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 font-prompt">เขียนบทความใหม่</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreview(!preview)}
                className="text-gray-600 hover:text-gray-900 font-prompt"
              >
                {preview ? 'แก้ไข' : 'ดูตัวอย่าง'}
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold font-prompt transition-colors disabled:opacity-50"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึกร่าง'}
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving || !article.title || !article.content}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold font-prompt transition-colors disabled:opacity-50"
              >
                {saving ? 'กำลังเผยแพร่...' : 'เผยแพร่'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!preview ? (
          /* Editor Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 font-prompt">
                    หัวข้อบทความ *
                  </label>
                  <span
                    className={`text-xs font-prompt ${
                      article.title.length >= 30 && article.title.length <= 60
                        ? 'text-green-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {article.title.length}/60 ตัวอักษร
                  </span>
                </div>
                <input
                  type="text"
                  value={article.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="พิมพ์หัวข้อบทความที่น่าสนใจ..."
                  maxLength={100}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt"
                />
                <div className="mt-1 text-xs text-gray-500 font-prompt">
                  💡 แนะนำ 30-60 ตัวอักษร เพื่อ SEO ที่ดี
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 font-prompt">
                    คำอธิบายสั้น (Excerpt)
                  </label>
                  <span
                    className={`text-xs font-prompt ${
                      article.excerpt.length >= 120 && article.excerpt.length <= 160
                        ? 'text-green-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {article.excerpt.length}/160 ตัวอักษร
                  </span>
                </div>
                <textarea
                  value={article.excerpt}
                  onChange={e => handleInputChange('excerpt', e.target.value)}
                  placeholder="เขียนคำอธิบายสั้น ๆ เพื่อดึงดูดผู้อ่าน..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt"
                />
                <div className="mt-1 text-xs text-gray-500 font-prompt">
                  💡 แนะนำ 120-160 ตัวอักษร เพื่อการแสดงผลที่ดีใน Google
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  เนื้อหาบทความ *
                </label>
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-2 text-xs text-gray-500 font-prompt">
                      <span>
                        รองรับ HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;,
                        &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;table&gt;
                      </span>
                    </div>
                    {/* สถิติความยาว */}
                    <div className="text-xs text-gray-500 font-prompt">
                      {(() => {
                        const stats = getArticleStats();
                        return (
                          <div className="text-right space-y-1">
                            <div>
                              📝 {stats.content.words} คำ | {stats.content.chars} ตัวอักษร
                            </div>
                            <div>⏰ เวลาอ่าน: {stats.total.readingTime} นาที</div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Editor Type Selector */}
                <div className="mb-4">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-700 mr-3">
                        ✨ เลือกโหมดแก้ไข:
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          editorType === 'modern'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                        }`}
                        onClick={() => setEditorType('modern')}
                      >
                        🚀 Modern 2025
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          editorType === 'bootstrap'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                        }`}
                        onClick={() => setEditorType('bootstrap')}
                      >
                        📋 Bootstrap Classic
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Component */}
                {editorType === 'modern' ? (
                  <ModernArticleEditor
                    value={article.content}
                    onChange={content => handleInputChange('content', content)}
                    placeholder="เขียนเนื้อหาบทความด้วย Modern Editor 2025 ที่ทันสมัย..."
                    articleId="new-article"
                  />
                ) : (
                  <BootstrapRichTextEditor
                    value={article.content}
                    onChange={content => handleInputChange('content', content)}
                    placeholder="เขียนเนื้อหาบทความที่มีประโยชน์ พร้อม Bootstrap Templates สำเร็จรูป..."
                    articleId="new-article"
                  />
                )}

                {/* แสดงคำแนะนำความยาว */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800 font-prompt">
                    <div className="flex items-start space-x-2">
                      <span>💡</span>
                      <div>
                        <div className="font-semibold mb-1">คำแนะนำความยาวบทความ:</div>
                        <ul className="text-xs space-y-1 ml-4">
                          <li>
                            • <strong>บทความสั้น:</strong> 300-600 คำ (เหมาะสำหรับข่าวสั้น)
                          </li>
                          <li>
                            • <strong>บทความปกติ:</strong> 600-1,200 คำ (เหมาะสำหรับบทความทั่วไป)
                          </li>
                          <li>
                            • <strong>บทความยาว:</strong> 1,200-2,000 คำ (เหมาะสำหรับคำแนะนำละเอียด)
                          </li>
                          <li>
                            • <strong>คู่มือ:</strong> 2,000+ คำ (ควรแบ่งเป็นหลายส่วน)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Article Quality Check */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">
                  📊 ตรวจสอบคุณภาพ
                </h3>

                {(() => {
                  const stats = getArticleStats();
                  const checks = getQualityChecks();

                  return (
                    <div className="space-y-4">
                      {/* สถิติรวม */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">รวมทั้งหมด:</span>
                            <div className="font-semibold text-primary">{stats.total.words} คำ</div>
                          </div>
                          <div>
                            <span className="text-gray-600">เวลาอ่าน:</span>
                            <div className="font-semibold text-accent">
                              {stats.total.readingTime} นาที
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* รายละเอียดแต่ละส่วน */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">หัวข้อ:</span>
                          <span
                            className={
                              stats.title.chars >= 30 && stats.title.chars <= 60
                                ? 'text-green-600'
                                : 'text-amber-600'
                            }
                          >
                            {stats.title.chars} ตัวอักษร
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">คำอธิบาย:</span>
                          <span
                            className={
                              stats.excerpt.chars >= 120 && stats.excerpt.chars <= 160
                                ? 'text-green-600'
                                : 'text-amber-600'
                            }
                          >
                            {stats.excerpt.chars} ตัวอักษร
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">เนื้อหา:</span>
                          <span
                            className={
                              stats.content.words >= 600 && stats.content.words <= 2000
                                ? 'text-green-600'
                                : stats.content.words < 300
                                  ? 'text-red-600'
                                  : 'text-amber-600'
                            }
                          >
                            {stats.content.words} คำ
                          </span>
                        </div>
                      </div>

                      {/* คำแนะนำ */}
                      <div className="space-y-2">
                        {checks.map((check, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-xs ${
                              check.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : check.type === 'warning'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <div className="flex items-start space-x-1">
                              <span>
                                {check.type === 'success'
                                  ? '✅'
                                  : check.type === 'warning'
                                    ? '⚠️'
                                    : '❌'}
                              </span>
                              <span>{check.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Publish Settings */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">การตั้งค่า</h3>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    หมวดหมู่
                  </label>
                  <select
                    value={article.category}
                    onChange={e => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={article.featured}
                      onChange={e => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:border-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 font-prompt">
                      บทความเด่น
                    </span>
                  </label>
                </div>

                {/* Author */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    ผู้เขียน
                  </label>
                  <input
                    type="text"
                    value={article.author}
                    onChange={e => handleInputChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt"
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">SEO</h3>

                {/* Keywords */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    คำค้นหา (คั่นด้วยจุลภาค)
                  </label>
                  <input
                    type="text"
                    value={article.keywords}
                    onChange={e => handleInputChange('keywords', e.target.value)}
                    placeholder="รถมือสอง, Honda City, ประกันรถ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    รูปปก
                  </label>
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden border border-gray-300">
                    <Image src={article.image} alt="รูปปกบทความ" fill className="object-cover" />
                  </div>

                  {/* Image Gallery Toggle */}
                  <div className="flex space-x-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setShowImageGallery(!showImageGallery)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-prompt font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        showImageGallery
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <span>{showImageGallery ? '❌' : '🖼️'}</span>
                      <span>{showImageGallery ? 'ปิดแกลเลอรี่' : 'เลือกจากแกลเลอรี่'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('image', '/herobanner/promotioncar.webp')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-prompt hover:bg-gray-50 transition-colors flex items-center space-x-1"
                      title="กลับไปใช้รูปปกเริ่มต้น"
                    >
                      <span>🔄</span>
                      <span>รีเซ็ต</span>
                    </button>
                  </div>

                  {/* Image Gallery */}
                  {showImageGallery && (
                    <div className="mb-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <ImageGallery
                        onSelectImage={handleImageSelect}
                        selectMode={true}
                        articleId="cover"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    value={article.image}
                    onChange={e => handleInputChange('image', e.target.value)}
                    placeholder="/herobanner/promotioncar.webp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 font-prompt text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt leading-tight">
                {article.title || 'หัวข้อบทความ'}
              </h1>

              <p className="text-xl text-gray-600 mb-6 font-prompt">
                {article.excerpt || 'คำอธิบายสั้น'}
              </p>

              <div className="flex items-center text-gray-500 text-sm space-x-4 font-prompt mb-8">
                <span>โดย {article.author}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('th-TH')}</span>
              </div>

              <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>

              <div
                className="prose prose-lg max-w-none font-prompt"
                style={{
                  lineHeight: '1.7',
                }}
                dangerouslySetInnerHTML={{
                  __html: article.content || '<p>เนื้อหาบทความจะแสดงที่นี่...</p>',
                }}
              />

              {/* เพิ่ม CSS สำหรับรูปภาพไม่ให้เบียดข้อความ */}
              <style jsx>{`
                .prose img {
                  margin: 30px 0 !important;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .prose figure {
                  margin: 30px 0 !important;
                }
                .prose figcaption {
                  font-size: 14px;
                  color: #666;
                  margin-top: 8px;
                  font-style: italic;
                  text-align: center;
                  line-height: 1.4;
                }
                .prose img[style*='float: left'] {
                  margin: 0 30px 20px 0 !important;
                  clear: left;
                }
                .prose img[style*='float: right'] {
                  margin: 0 0 20px 30px !important;
                  clear: right;
                }
                .prose figure[style*='float: left'] {
                  margin: 0 30px 20px 0 !important;
                  clear: left;
                }
                .prose figure[style*='float: right'] {
                  margin: 0 0 20px 30px !important;
                  clear: right;
                }
                .prose p:after {
                  content: '';
                  display: table;
                  clear: both;
                }
              `}</style>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
