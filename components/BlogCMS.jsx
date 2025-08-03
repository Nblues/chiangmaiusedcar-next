import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function BlogCMS() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    category: 'ทั่วไป',
    coverImage: '',
    published: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // โหลดโพสต์จาก localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('blog_cms_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // บันทึกโพสต์ลง localStorage
  const savePosts = newPosts => {
    localStorage.setItem('blog_cms_posts', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const generateSlugFromTitle = title => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // ลบอักขระพิเศษ
      .replace(/\s+/g, '-') // แทนที่ space ด้วย -
      .trim();
  };

  const handleInputChange = (field, value) => {
    setCurrentPost(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from title
      if (field === 'title' && !isEditing) {
        updated.slug = generateSlugFromTitle(value);
      }

      return updated;
    });
  };

  const handleSave = () => {
    if (!currentPost.title.trim() || !currentPost.content.trim()) {
      alert('กรุณากรอกหัวข้อและเนื้อหา');
      return;
    }

    const post = {
      ...currentPost,
      id: editingId || Date.now(),
      date: editingId ? currentPost.date : new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: currentPost.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag),
    };

    let updatedPosts;
    if (editingId) {
      updatedPosts = posts.map(p => (p.id === editingId ? post : p));
    } else {
      updatedPosts = [post, ...posts];
    }

    savePosts(updatedPosts);
    resetForm();
    alert('บันทึกเรียบร้อย!');
  };

  const handleEdit = post => {
    setCurrentPost({
      ...post,
      tags: post.tags?.join(', ') || '',
    });
    setIsEditing(true);
    setEditingId(post.id);
  };

  const handleDelete = id => {
    if (confirm('คุณต้องการลบโพสต์นี้หรือไม่?')) {
      const updatedPosts = posts.filter(p => p.id !== id);
      savePosts(updatedPosts);
    }
  };

  const resetForm = () => {
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: '',
      category: 'ทั่วไป',
      coverImage: '',
      published: false,
    });
    setIsEditing(false);
    setEditingId(null);
    setShowPreview(false);
  };

  const exportToMarkdown = post => {
    const frontmatter = `---
title: ${post.title}
excerpt: ${post.excerpt}
date: ${post.date}
slug: ${post.slug}
tags: [${post.tags?.map(tag => `"${tag}"`).join(', ') || ''}]
category: ${post.category}
coverImage: ${post.coverImage || ''}
published: ${post.published}
---

${post.content}`;

    const blob = new Blob([frontmatter], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug || 'post'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-700 text-white p-6">
          <h1 className="text-3xl font-bold font-prompt">📝 Blog CMS - ระบบจัดการบทความ</h1>
          <p className="text-primary-100 mt-2">
            เขียนและจัดการบทความได้ง่ายๆ พร้อม Rich Text Editor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Editor Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 font-prompt">
                {isEditing ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  {showPreview ? 'แก้ไข' : 'ดูตัวอย่าง'}
                </button>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  ล้างฟอร์ม
                </button>
              </div>
            </div>

            {!showPreview ? (
              <form className="space-y-6">
                {/* Title */}
                <div>
                  <label className="form-label">หัวข้อบทความ *</label>
                  <input
                    type="text"
                    value={currentPost.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    className="form-input text-lg font-semibold"
                    placeholder="หัวข้อบทความ..."
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="form-label">Slug (URL)</label>
                  <input
                    type="text"
                    value={currentPost.slug}
                    onChange={e => handleInputChange('slug', e.target.value)}
                    className="form-input font-mono text-sm"
                    placeholder="url-slug-for-post"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /blog/{currentPost.slug || 'your-post-slug'}
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="form-label">คำอธิบายสั้น</label>
                  <textarea
                    value={currentPost.excerpt}
                    onChange={e => handleInputChange('excerpt', e.target.value)}
                    className="form-textarea h-20"
                    placeholder="คำอธิบายสั้นๆ เกี่ยวกับบทความ..."
                  />
                </div>

                {/* Meta Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">หมวดหมู่</label>
                    <select
                      value={currentPost.category}
                      onChange={e => handleInputChange('category', e.target.value)}
                      className="form-select"
                    >
                      <option value="ทั่วไป">ทั่วไป</option>
                      <option value="เทคนิค">เทคนิค</option>
                      <option value="โปรโมชัน">โปรโมชัน</option>
                      <option value="รีวิว">รีวิว</option>
                      <option value="ข่าวสาร">ข่าวสาร</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">แท็ก (คั่นด้วยจุลภาค)</label>
                    <input
                      type="text"
                      value={currentPost.tags}
                      onChange={e => handleInputChange('tags', e.target.value)}
                      className="form-input"
                      placeholder="แท็ก1, แท็ก2, แท็ก3"
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="form-label">รูปปก (URL)</label>
                  <input
                    type="url"
                    value={currentPost.coverImage}
                    onChange={e => handleInputChange('coverImage', e.target.value)}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="form-label">เนื้อหาบทความ *</label>
                  <div className="border border-gray-300 rounded-lg">
                    {/* Toolbar */}
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 rounded-t-lg">
                      <div className="flex flex-wrap gap-2 text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor');
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const selectedText = textarea.value.substring(start, end);
                            const newText = `**${selectedText}**`;
                            handleInputChange(
                              'content',
                              textarea.value.substring(0, start) +
                                newText +
                                textarea.value.substring(end)
                            );
                          }}
                          className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                        >
                          <strong>B</strong>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor');
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const selectedText = textarea.value.substring(start, end);
                            const newText = `*${selectedText}*`;
                            handleInputChange(
                              'content',
                              textarea.value.substring(0, start) +
                                newText +
                                textarea.value.substring(end)
                            );
                          }}
                          className="px-2 py-1 bg-white border rounded hover:bg-gray-100 italic"
                        >
                          I
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              'content',
                              currentPost.content + '\n\n## หัวข้อย่อย\n\n'
                            )
                          }
                          className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              'content',
                              currentPost.content + '\n\n### หัวข้อย่อยย่อย\n\n'
                            )
                          }
                          className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                        >
                          H3
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              'content',
                              currentPost.content +
                                '\n\n- รายการที่ 1\n- รายการที่ 2\n- รายการที่ 3\n\n'
                            )
                          }
                          className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                        >
                          List
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              'content',
                              currentPost.content + '\n\n[ข้อความลิงก์](https://example.com)\n\n'
                            )
                          }
                          className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                        >
                          Link
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="content-editor"
                      value={currentPost.content}
                      onChange={e => handleInputChange('content', e.target.value)}
                      className="w-full p-4 min-h-96 border-0 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed"
                      placeholder="เริ่มเขียนบทความ... (รองรับ Markdown)"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 รองรับ Markdown: **ตัวหนา** *ตัวเอียง* [ลิงก์](url) ## หัวข้อ
                  </p>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={currentPost.published}
                    onChange={e => handleInputChange('published', e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="published" className="form-label mb-0">
                    เผยแพร่บทความ
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button type="button" onClick={handleSave} className="btn-primary">
                    {isEditing ? 'บันทึกการแก้ไข' : 'บันทึกบทความ'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="btn-secondary">
                      ยกเลิก
                    </button>
                  )}
                </div>
              </form>
            ) : (
              /* Preview */
              <div className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 font-prompt">
                  {currentPost.title || 'หัวข้อบทความ'}
                </h1>
                <p className="text-gray-600 italic">{currentPost.excerpt || 'คำอธิบายสั้น'}</p>
                <div className="flex flex-wrap gap-2 my-4">
                  {currentPost.tags.split(',').map((tag, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="whitespace-pre-wrap font-prompt leading-relaxed">
                  {currentPost.content || 'เนื้อหาบทความ...'}
                </div>
              </div>
            )}
          </div>

          {/* Posts List Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 font-prompt">
              บทความที่บันทึกไว้ ({posts.length})
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {posts.map(post => (
                <div key={post.id} className="bg-gray-50 rounded-lg p-3 border">
                  <h4 className="font-semibold text-sm text-gray-800 font-prompt line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(post.date), 'd MMM yyyy', { locale: th })}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.published ? 'เผยแพร่' : 'ฉบับร่าง'}
                    </span>
                    <span className="text-xs text-gray-500">{post.category}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => exportToMarkdown(post)}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="font-prompt">ยังไม่มีบทความ</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border-t border-blue-200 p-6">
          <h4 className="font-semibold text-blue-800 mb-2 font-prompt">💡 วิธีใช้งาน</h4>
          <ul className="text-sm text-blue-700 space-y-1 font-prompt">
            <li>• เขียนบทความด้วย Markdown เพื่อความสวยงาม</li>
            <li>• ใช้ปุ่ม Export เพื่อดาวน์โหลดไฟล์ .md สำหรับนำไปใส่ใน /content/blog/</li>
            <li>• ระบบนี้เป็นเพียงตัวอย่าง ข้อมูลจะถูกเก็บใน Local Storage</li>
            <li>• ในการใช้งานจริงควรเชื่อมต่อกับฐานข้อมูลและ API</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
