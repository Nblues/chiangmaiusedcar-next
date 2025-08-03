import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function BlogComments({ postSlug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    website: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load comments from localStorage (จริงๆ ควรใช้ database)
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${postSlug}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [postSlug]);

  // Save comments to localStorage
  const saveComments = newComments => {
    localStorage.setItem(`comments_${postSlug}`, JSON.stringify(newComments));
    setComments(newComments);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!newComment.name.trim() || !newComment.message.trim()) {
      alert('กรุณากรอกชื่อและข้อความ');
      setIsSubmitting(false);
      return;
    }

    // Create new comment
    const comment = {
      id: Date.now(),
      ...newComment,
      date: new Date().toISOString(),
      approved: true, // ในระบบจริงควรมีการอนุมัติ
    };

    // Add to comments list
    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);

    // Reset form
    setNewComment({
      name: '',
      email: '',
      website: '',
      message: '',
    });
    setShowForm(false);
    setIsSubmitting(false);

    // Show success message
    alert('ขอบคุณสำหรับความคิดเห็น!');
  };

  const handleInputChange = (field, value) => {
    setNewComment(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteComment = commentId => {
    if (confirm('คุณต้องการลบความคิดเห็นนี้หรือไม่?')) {
      const updatedComments = comments.filter(c => c.id !== commentId);
      saveComments(updatedComments);
    }
  };

  return (
    <div className="mt-12 bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary font-prompt">
          💬 ความคิดเห็น ({comments.length})
        </h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 px-4">
          {showForm ? 'ซ่อนฟอร์ม' : 'แสดงความคิดเห็น'}
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 font-prompt">เขียนความคิดเห็น</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">ชื่อ *</label>
              <input
                type="text"
                value={newComment.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className="form-input"
                placeholder="ชื่อของคุณ"
                required
              />
            </div>
            <div>
              <label className="form-label">อีเมล</label>
              <input
                type="email"
                value={newComment.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="form-input"
                placeholder="email@example.com (ไม่จำเป็น)"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">เว็บไซต์</label>
            <input
              type="url"
              value={newComment.website}
              onChange={e => handleInputChange('website', e.target.value)}
              className="form-input"
              placeholder="https://yourwebsite.com (ไม่จำเป็น)"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">ความคิดเห็น *</label>
            <textarea
              value={newComment.message}
              onChange={e => handleInputChange('message', e.target.value)}
              className="form-textarea h-32"
              placeholder="แสดงความคิดเห็นของคุณ..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="font-prompt">ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็นสิ!</p>
          </div>
        ) : (
          comments.map(comment => (
            <article key={comment.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 font-prompt">
                      {comment.website ? (
                        <a
                          href={comment.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-700"
                        >
                          {comment.name}
                        </a>
                      ) : (
                        comment.name
                      )}
                    </h5>
                    <time className="text-sm text-gray-500">
                      {format(new Date(comment.date), 'd MMMM yyyy เวลา HH:mm น.', { locale: th })}
                    </time>
                  </div>
                </div>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="ลบความคิดเห็น"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-gray-700 font-prompt leading-relaxed whitespace-pre-wrap">
                {comment.message}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 font-prompt">
          <strong>หมายเหตุ:</strong> ระบบความคิดเห็นนี้เป็นเพียงตัวอย่าง ข้อมูลจะถูกเก็บใน Local
          Storage ของเบราว์เซอร์ ในการใช้งานจริงควรใช้ระบบฐานข้อมูลและการอนุมัติความคิดเห็น
        </p>
      </div>
    </div>
  );
}
