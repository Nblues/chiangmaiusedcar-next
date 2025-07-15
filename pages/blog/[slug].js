import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from 'react-markdown';
import SEO from '../../components/SEO';

export default function BlogPost({ frontmatter, content }) {
  return (
    <>
      <SEO title={frontmatter.title} description={frontmatter.excerpt} url={`/blog/${frontmatter.slug}`} />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>
        <Markdown className="prose">{content}</Markdown>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const posts = fs.readdirSync(path.join(process.cwd(), 'content/blog'));
  return {
    paths: posts.map(fn => ({ params: { slug: fn.replace('.md', '') } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const markdown = fs.readFileSync(path.join(process.cwd(), 'content/blog', params.slug+'.md'), 'utf-8');
  const { data:frontmatter, content } = matter(markdown);
  return { props: { frontmatter: { ...frontmatter, slug: params.slug }, content } };
}
