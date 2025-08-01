import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "content/blog");

export function getAllPosts() {
  try {
    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          content,
          title: data.title || "",
          excerpt: data.excerpt || "",
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return allPostsData;
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

export function getPostBySlug(slug) {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      title: data.title || "",
      excerpt: data.excerpt || "",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error reading blog post:", error);
    return null;
  }
}
