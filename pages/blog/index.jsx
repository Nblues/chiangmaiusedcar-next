import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';
import { getAllPosts } from '../../lib/blog.js';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Import BlogSearch แบบ dynamic ปิด SSR
const BlogSearch = dynamic(() => import('../../components/BlogSearch'), { ssr: false });

export default function Blog({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side search function
  const searchPostsClient = (query, postsToSearch) => {
    if (!query || query.trim() === '') return postsToSearch;

    const searchTerm = query.toLowerCase().trim();

    return postsToSearch.filter(post => {
      try {
        const title = post.title || '';
        const excerpt = post.excerpt || '';
        const content = post.content || '';
        const category = post.category || '';
        const tags = Array.isArray(post.tags) ? post.tags : [];

        return (
          title.toLowerCase().includes(searchTerm) ||
          excerpt.toLowerCase().includes(searchTerm) ||
          content.toLowerCase().includes(searchTerm) ||
          tags.some(tag => tag && tag.toLowerCase().includes(searchTerm)) ||
          category.toLowerCase().includes(searchTerm)
        );
      } catch (error) {
        console.error('Error filtering post:', post, error);
        return false;
      }
    });
  };

  // Handle search
  const handleSearch = searchParams => {
    const query = searchParams.q || '';
    setSearchQuery(query);

    // ถ้าไม่มีการค้นหา ให้แสดงทั้งหมดทันที
    if (!query || query.trim() === '') {
      setPosts(initialPosts);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // เพิ่ม debounce เพื่อลดการกระพริบ
    setTimeout(() => {
      const filteredPosts = searchPostsClient(query, initialPosts);
      setPosts(filteredPosts);
      setIsSearching(false);
    }, 150); // ลดเวลาจาก 300ms เป็น 150ms
  };
  return (
    <>
      <SEO
        title="ข่าวสารรถยนต์ - ครูหนึ่งรถสวย"
        description="ข่าวสารและความรู้เกี่ยวกับรถยนต์ คำแนะนำการเลือกซื้อรถมือสอง"
      />

      <div className="bg-gradient-to-br from-primary to-primary-600 py-8">
        <div className="max-w-7xl mx-auto p-4 text-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-white font-prompt">ข่าวสารรถยนต์</h1>
            <p className="text-white text-lg">ความรู้และคำแนะนำเกี่ยวกับรถยนต์ที่คุณควรรู้</p>
          </div>

          {/* Search Component */}
          <div className="mb-8">
            <BlogSearch onSearch={handleSearch} />
          </div>

          {/* Content Container with Fixed Height */}
          <div className="min-h-[500px] relative">
            {isSearching ? (
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="text-center bg-white/90 px-6 py-4 rounded-xl shadow-lg">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <p className="mt-2 text-primary font-medium">กำลังค้นหา...</p>
                </div>
              </div>
            ) : null}

            {posts.length === 0 && !isSearching ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  {searchQuery ? (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-2 font-prompt">
                        ไม่พบบทความ
                      </h2>
                      <p className="text-gray-300 text-lg">
                        ไม่พบบทความที่ตรงกับ &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        ลองค้นหาด้วยคำอื่น หรือดูบทความทั้งหมด
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-2 font-prompt">เร็วๆ นี้</h2>
                      <p className="text-gray-300 text-lg">เรากำลังเตรียมบทความดีๆ มาให้อ่าน</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 transition-opacity duration-200 ${isSearching ? 'opacity-50' : 'opacity-100'}`}
              >
                {posts.map(post => (
                  <article
                    key={post.slug}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative h-48 overflow-hidden bg-gray-100 group">
                        <Image
                          src={post.coverImage || `/herobanner/kn2carbanner.webp`}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            {post.category || 'ทั่วไป'}
                          </span>
                          {post.tags &&
                            Array.isArray(post.tags) &&
                            post.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-gray-800 hover:text-primary transition-colors line-clamp-2 font-prompt">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            {post.date
                              ? (() => {
                                  try {
                                    return format(new Date(post.date), 'd MMMM yyyy', {
                                      locale: th,
                                    });
                                  } catch (error) {
                                    return 'วันที่ไม่ถูกต้อง';
                                  }
                                })()
                              : ''}
                          </span>
                          <span>{post.readingTime || '5 นาที'}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();

  // Convert Date objects to strings for JSON serialization
  const serializablePosts = posts.map(post => ({
    ...post,
    date: post.date ? post.date.toISOString() : null,
  }));

  return {
    props: {
      posts: serializablePosts,
    },
    revalidate: 3600, // revalidate every hour
  };
}
