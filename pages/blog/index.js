import SEO from "../../components/SEO";
import { getAllPosts } from "../../lib/blog";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function Blog({ posts }) {
  return (
    <>
      <SEO title="บทความ - ครูหนึ่งรถสวย" />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">บทความ</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ขณะนี้ยังไม่มีบทความในระบบ</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="border-b pb-6">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold mb-2 text-brand-600 hover:text-brand-800 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm mb-2">
                  {post.date
                    ? format(new Date(post.date), "d MMMM yyyy", { locale: th })
                    : ""}
                </p>
                <p className="text-gray-700 mb-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-accent-500 hover:text-accent-700 font-medium transition-colors"
                >
                  อ่านต่อ →
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return {
    props: { posts },
    revalidate: 3600, // revalidate every hour
  };
}
