import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dynamic from 'next/dynamic';
import Markdown from 'react-markdown';
import SEO from '../../components/SEO';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// Import BlogComments แบบ dynamic ปิด SSR
const BlogComments = dynamic(() => import('../../components/BlogComments'), { ssr: false });

export default function BlogPost({ frontmatter, content }) {
  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!frontmatter || !content) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบบทความ</h1>
          <Link href="/blog" className="text-primary hover:text-accent">
            ← กลับไปหน้าบทความ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.excerpt}
        url={`/blog/${frontmatter.slug}`}
      />
      <main className="max-w-3xl mx-auto p-4">
        <nav className="mb-4">
          <Link href="/blog" className="text-primary hover:text-accent transition-colors">
            ← กลับไปหน้าบทความ
          </Link>
        </nav>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-accent">{frontmatter.title}</h1>
            <p className="text-gray-600">
              {format(new Date(frontmatter.date), 'd MMMM yyyy', { locale: th })}
            </p>
          </header>

          <div className="prose prose-lg max-w-none prose-headings:text-accent">
            <Markdown>{content}</Markdown>
          </div>
        </article>

        <div className="mt-12 p-6 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-accent">สนใจรถมือสองเชียงใหม่?</h3>
          <p className="mb-4 text-gray-900">
            ครูหนึ่งรถสวยมีรถมือสองคุณภาพดี ราคาโดน รับประกัน 1 ปี
          </p>
          <div className="space-x-4">
            <Link
              href="/all-cars"
              className="bg-primary text-white px-4 py-2 rounded inline-block hover:bg-primary-600 transition-colors"
            >
              ดูรถทั้งหมด
            </Link>
            <div className="flex items-center gap-4 text-center">
              <Link
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                className="bg-primary text-white px-4 py-2 rounded inline-block hover:bg-primary-600 transition-colors"
              >
                สอบถาม LINE
              </Link>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <BlogComments postSlug={frontmatter.slug} />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const posts = fs.readdirSync(path.join(process.cwd(), 'content/blog'));
  const paths = [];

  posts.forEach(fileName => {
    if (!fileName.endsWith('.md')) return;

    const fullPath = path.join(process.cwd(), 'content/blog', fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // ใช้ slug จาก frontmatter ถ้ามี, ไม่งั้นใช้ filename
    const slug = data.slug || fileName.replace('.md', '');
    paths.push({ params: { slug } });
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // ค้นหาไฟล์ที่ตรงกับ slug
  const posts = fs.readdirSync(path.join(process.cwd(), 'content/blog'));
  let targetFile = null;

  for (const fileName of posts) {
    if (!fileName.endsWith('.md')) continue;

    const fullPath = path.join(process.cwd(), 'content/blog', fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // ตรวจสอบ slug จาก frontmatter หรือ filename
    if (data.slug === params.slug || fileName.replace('.md', '') === params.slug) {
      targetFile = fileName;
      break;
    }
  }

  if (!targetFile) {
    return { notFound: true };
  }

  const markdown = fs.readFileSync(path.join(process.cwd(), 'content/blog', targetFile), 'utf-8');
  const { data: frontmatter, content } = matter(markdown);

  // Ensure date is a string for Next.js serialization
  let safeFrontmatter = { ...frontmatter, slug: frontmatter.slug || params.slug };
  if (safeFrontmatter.date instanceof Date) {
    safeFrontmatter.date = safeFrontmatter.date.toISOString();
  } else if (
    typeof safeFrontmatter.date === 'object' &&
    safeFrontmatter.date &&
    safeFrontmatter.date.toString
  ) {
    safeFrontmatter.date = safeFrontmatter.date.toString();
  }
  return { props: { frontmatter: safeFrontmatter, content } };
}
