import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// เช็คว่าทำงานใน server environment หรือไม่
const isServer = typeof window === 'undefined';

const blogDirectory = isServer ? path.join(process.cwd(), 'content/blog') : '';
const publicDir = isServer ? path.join(process.cwd(), 'public') : '';

// ฟังก์ชันสำหรับจัดการรูปภาพข่าวสาร
export function getBlogImagePath(slug, imageName) {
  return `/images/blog/${slug}/${imageName}`;
}

export function getAllBlogImages(slug) {
  try {
    const imageDir = path.join(publicDir, 'images', 'blog', slug);
    if (!fs.existsSync(imageDir)) {
      return [];
    }

    const files = fs.readdirSync(imageDir);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
      .map(file => ({
        name: file,
        path: getBlogImagePath(slug, file),
        size: fs.statSync(path.join(imageDir, file)).size,
      }));
  } catch (error) {
    console.error('Error reading blog images:', error);
    return [];
  }
}

export function getOptimizedImageSizes() {
  return {
    thumbnail: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 },
    hero: { width: 1920, height: 1080 },
  };
}

// ฟังก์ชันดึงรายการไฟล์พร้อม slug mapping
export function getAllSlugs() {
  if (!isServer) return [];

  try {
    const fileNames = fs.readdirSync(blogDirectory);
    const slugs = [];

    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .forEach(fileName => {
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        slugs.push({
          slug: data.slug || fileName.replace(/\.md$/, ''),
          filename: fileName.replace(/\.md$/, ''),
        });
      });

    return slugs;
  } catch (error) {
    console.error('Error reading blog slugs:', error);
    return [];
  }
}

export function getAllPosts() {
  if (!isServer) return [];

  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter(name => name.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...data,
        // Ensure date is a Date object for sorting
        date: data.date ? new Date(data.date) : null,
      };
    });

  return allPostsData.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date - a.date; // newest first
  });
}
export function getPostBySlug(slug) {
  if (!isServer) return null;

  try {
    // ลองค้นหาจาก frontmatter slug ก่อน
    const fileNames = fs.readdirSync(blogDirectory);
    let targetFile = null;

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md')) continue;

      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      // ตรวจสอบ slug จาก frontmatter หรือ filename
      if (data.slug === slug || fileName.replace(/\.md$/, '') === slug) {
        targetFile = fileName;
        break;
      }
    }

    if (!targetFile) {
      return null;
    }

    const fullPath = path.join(blogDirectory, targetFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || targetFile.replace(/\.md$/, ''),
      filename: targetFile.replace(/\.md$/, ''),
      content,
      title: data.title || '',
      excerpt: data.excerpt || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      coverImage:
        data.coverImage ||
        getBlogImagePath(data.slug || targetFile.replace(/\.md$/, ''), 'banner.png'),
      images: getAllBlogImages(data.slug || targetFile.replace(/\.md$/, '')),
      tags: data.tags || [],
      category: data.category || 'ทั่วไป',
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

// Helper function สำหรับคำนวณเวลาอ่าน
function calculateReadingTime(content) {
  const wordsPerMinute = 200; // คำต่อนาที (ภาษาไทย)
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} นาที`;
}

// 2. Search Functionality
export function searchPosts(query, posts = null) {
  if (!isServer) return [];

  try {
    const allPosts = posts || getAllPosts();
    if (!query || query.trim() === '') return allPosts;

    const searchTerm = query.toLowerCase().trim();

    return allPosts.filter(post => {
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.category.toLowerCase().includes(searchTerm)
      );
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

export function getPostsByCategory(category) {
  if (!isServer) return [];

  try {
    const allPosts = getAllPosts();
    return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error filtering posts by category:', error);
    return [];
  }
}

export function getPostsByTag(tag) {
  if (!isServer) return [];

  try {
    const allPosts = getAllPosts();
    return allPosts.filter(post =>
      post.tags?.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    console.error('Error filtering posts by tag:', error);
    return [];
  }
}

export function getAllCategories() {
  if (!isServer) return [];

  try {
    const allPosts = getAllPosts();
    const categories = [...new Set(allPosts.map(post => post.category))];
    return categories.map(category => ({
      name: category,
      count: allPosts.filter(post => post.category === category).length,
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export function getAllTags() {
  if (!isServer) return [];

  try {
    const allPosts = getAllPosts();
    const allTags = allPosts.flatMap(post => post.tags || []);
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags.map(tag => ({
      name: tag,
      count: allPosts.filter(post => post.tags?.includes(tag)).length,
    }));
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
}
