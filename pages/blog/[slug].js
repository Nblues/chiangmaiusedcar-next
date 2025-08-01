import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Markdown from "react-markdown";
import SEO from "../../components/SEO";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function BlogPost({ frontmatter, content }) {
  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.excerpt}
        url={`/blog/${frontmatter.slug}`}
      />
      <main className="max-w-3xl mx-auto p-4">
        <nav className="mb-4">
          <Link href="/blog" className="text-accent-500 hover:text-accent-700 transition-colors">
            ← กลับไปหน้าบทความ
          </Link>
        </nav>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
            <p className="text-gray-600">
              {format(new Date(frontmatter.date), "d MMMM yyyy", { locale: th })}
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        </article>

        <div className="mt-12 p-6 bg-accent-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">สนใจรถมือสองเชียงใหม่?</h3>
          <p className="mb-4">ครูหนึ่งรถสวยมีรถมือสองคุณภาพดี ราคาโดน รับประกัน 1 ปี</p>
          <div className="space-x-4">
            <Link
              href="/all-cars"
              className="bg-accent-500 text-white px-4 py-2 rounded inline-block hover:bg-accent-600 transition-colors"
            >
              ดูรถทั้งหมด
            </Link>
            <a
              href="https://lin.ee/cJuakxZ"
              className="bg-success-500 text-white px-4 py-2 rounded inline-block hover:bg-success-600 transition-colors"
            >
              สอบถาม LINE
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const posts = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  return {
    paths: posts.map((fn) => ({ params: { slug: fn.replace(".md", "") } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "content/blog", params.slug + ".md"),
    "utf-8"
  );
  const { data: frontmatter, content } = matter(markdown);
  // Ensure date is a string for Next.js serialization
  let safeFrontmatter = { ...frontmatter, slug: params.slug };
  if (safeFrontmatter.date instanceof Date) {
    safeFrontmatter.date = safeFrontmatter.date.toISOString();
  } else if (
    typeof safeFrontmatter.date === "object" &&
    safeFrontmatter.date &&
    safeFrontmatter.date.toString
  ) {
    safeFrontmatter.date = safeFrontmatter.date.toString();
  }
  return { props: { frontmatter: safeFrontmatter, content } };
}
