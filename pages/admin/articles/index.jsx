import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles, deleteArticle } from '../../../lib/articles';

const categories = ['ข่าวรถใหม่', 'เปรียบเทียบ', 'คำแนะนำ', 'การเงิน', 'รถไฟฟ้า', 'ประกัน'];

export default function ArticlesList() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [categoryFilter, setCategoryFilter] = useState('all');

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

  // โหลดรายการบทความ
  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('ไม่สามารถโหลดรายการบทความได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบบทความ "${title}"?`)) {
      return;
    }

    try {
      setDeleting(id);
      const success = await deleteArticle(id);
      if (success) {
        setArticles(articles.filter(article => article.id !== id));
        alert('ลบบทความเรียบร้อยแล้ว');
      } else {
        alert('ไม่สามารถลบบทความได้');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('เกิดข้อผิดพลาดในการลบบทความ');
    } finally {
      setDeleting(null);
    }
  };

  // กรองบทความตามสถานะและหมวดหมู่
  const filteredArticles = articles.filter(article => {
    const statusMatch = filter === 'all' || article.status === filter;
    const categoryMatch = categoryFilter === 'all' || article.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const getStatusBadge = status => {
    if (status === 'published') {
      return <span className="badge bg-success">เผยแพร่แล้ว</span>;
    } else if (status === 'draft') {
      return <span className="badge bg-warning">ร่าง</span>;
    }
    return <span className="badge bg-secondary">ไม่ทราบสถานะ</span>;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>จัดการบทความ | ครูหนึ่งรถสวย Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2">
            <div className="list-group">
              <Link href="/admin" className="list-group-item list-group-item-action">
                🏠 หน้าหลัก Admin
              </Link>
              <Link
                href="/admin/articles"
                className="list-group-item list-group-item-action active"
              >
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
              <h1 className="h3">📝 จัดการบทความ</h1>
              <Link href="/admin/articles/new" className="btn btn-primary">
                ➕ เขียนบทความใหม่
              </Link>
            </div>

            {/* Filters */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">กรองตามสถานะ:</label>
                    <select
                      className="form-select"
                      value={filter}
                      onChange={e => setFilter(e.target.value)}
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="published">เผยแพร่แล้ว</option>
                      <option value="draft">ร่าง</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">กรองตามหมวดหมู่:</label>
                    <select
                      className="form-select"
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">ทั้งหมด</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      onClick={loadArticles}
                      className="btn btn-outline-secondary"
                      disabled={loading}
                    >
                      🔄 รีเฟรช
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles Table */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">กำลังโหลด...</span>
                </div>
                <p className="mt-3">กำลังโหลดรายการบทความ...</p>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    รายการบทความ ({filteredArticles.length} บทความ)
                  </h5>
                </div>
                <div className="card-body p-0">
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">ไม่พบบทความที่ตรงกับเงื่อนไขการค้นหา</p>
                      <Link href="/admin/articles/new" className="btn btn-primary">
                        เขียนบทความแรก
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>รูปภาพ</th>
                            <th>หัวข้อ</th>
                            <th>หมวดหมู่</th>
                            <th>สถานะ</th>
                            <th>วันที่</th>
                            <th>การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredArticles.map(article => (
                            <tr key={article.id}>
                              <td>
                                <Image
                                  src={article.image}
                                  alt={article.title}
                                  width={60}
                                  height={40}
                                  className="rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                              </td>
                              <td>
                                <div>
                                  <h6 className="mb-1">{article.title}</h6>
                                  <small className="text-muted">
                                    {article.excerpt.substring(0, 80)}...
                                  </small>
                                  {article.featured && (
                                    <span className="badge bg-warning ms-2">⭐ เด่น</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-primary">{article.category}</span>
                              </td>
                              <td>{getStatusBadge(article.status)}</td>
                              <td>
                                <small>
                                  {new Date(article.date).toLocaleDateString('th-TH')}
                                  <br />
                                  <span className="text-muted">{article.readTime}</span>
                                </small>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <Link
                                    href={`/features/${article.id}`}
                                    className="btn btn-sm btn-outline-info"
                                    target="_blank"
                                    title="ดูบทความ"
                                  >
                                    👁️
                                  </Link>
                                  <Link
                                    href={`/admin/articles/${article.id}/edit`}
                                    className="btn btn-sm btn-outline-warning"
                                    title="แก้ไข"
                                  >
                                    ✏️
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(article.id, article.title)}
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={deleting === article.id}
                                    title="ลบ"
                                  >
                                    {deleting === article.id ? (
                                      <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                      '🗑️'
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
