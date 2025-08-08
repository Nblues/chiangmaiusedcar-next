import { adminRoute } from '../../../lib/adminAuth';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function handler(req, res) {
  const contentDir = path.join(process.cwd(), 'content', 'blog');

  // Ensure content directory exists
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  switch (req.method) {
    case 'GET':
      try {
        const files = fs.readdirSync(contentDir);
        const articles = files
          .filter(filename => filename.endsWith('.md'))
          .map(filename => {
            const filepath = path.join(contentDir, filename);
            const fileContent = fs.readFileSync(filepath, 'utf8');
            const { data, content } = matter(fileContent);

            return {
              id: filename.replace('.md', ''),
              title: data.title || 'ไม่มีชื่อ',
              slug: data.slug || filename.replace('.md', ''),
              excerpt: data.excerpt || '',
              published: data.published || false,
              createdAt: data.date || fs.statSync(filepath).mtime,
              tags: data.tags || [],
              coverImage: data.coverImage || '',
              content: content,
            };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ articles });
      } catch (error) {
        console.error('Error loading articles:', error);
        res.status(500).json({ error: 'Failed to load articles' });
      }
      break;

    case 'POST':
      try {
        const { title, slug, excerpt, content, coverImage, tags, published } = req.body;

        if (!title || !slug || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate filename
        const filename = `${slug}.md`;
        const filepath = path.join(contentDir, filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
          return res.status(400).json({ error: 'Article with this slug already exists' });
        }

        // Create frontmatter
        const frontmatter = {
          title,
          slug,
          excerpt: excerpt || '',
          date: new Date().toISOString(),
          published: published || false,
          tags: tags || [],
          coverImage: coverImage || '',
        };

        // Create markdown content
        const markdownContent = matter.stringify(content, frontmatter);

        // Write file
        fs.writeFileSync(filepath, markdownContent, 'utf8');

        // Log activity
        console.log(`[ADMIN] Article created: ${title} (${slug})`);

        res.status(201).json({
          success: true,
          message: 'Article created successfully',
          id: slug,
        });
      } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Failed to create article' });
      }
      break;

    case 'PUT':
      try {
        const { id, title, slug, excerpt, content, coverImage, tags, published } = req.body;

        if (!id || !title || !slug || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const oldFilepath = path.join(contentDir, `${id}.md`);
        const newFilepath = path.join(contentDir, `${slug}.md`);

        // Check if original file exists
        if (!fs.existsSync(oldFilepath)) {
          return res.status(404).json({ error: 'Article not found' });
        }

        // Read existing file to preserve original date
        const existingContent = fs.readFileSync(oldFilepath, 'utf8');
        const existingData = matter(existingContent);

        // Update frontmatter
        const frontmatter = {
          ...existingData.data,
          title,
          slug,
          excerpt: excerpt || '',
          published: published || false,
          tags: tags || [],
          coverImage: coverImage || '',
          lastModified: new Date().toISOString(),
        };

        // Create updated markdown content
        const markdownContent = matter.stringify(content, frontmatter);

        // Write to new location (in case slug changed)
        fs.writeFileSync(newFilepath, markdownContent, 'utf8');

        // Remove old file if slug changed
        if (id !== slug && fs.existsSync(oldFilepath)) {
          fs.unlinkSync(oldFilepath);
        }

        // Log activity
        console.log(`[ADMIN] Article updated: ${title} (${slug})`);

        res.status(200).json({
          success: true,
          message: 'Article updated successfully',
          id: slug,
        });
      } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Failed to update article' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Article ID required' });
        }

        const filepath = path.join(contentDir, `${id}.md`);

        if (!fs.existsSync(filepath)) {
          return res.status(404).json({ error: 'Article not found' });
        }

        fs.unlinkSync(filepath);

        // Log activity
        console.log(`[ADMIN] Article deleted: ${id}`);

        res.status(200).json({
          success: true,
          message: 'Article deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

export default adminRoute(handler);
