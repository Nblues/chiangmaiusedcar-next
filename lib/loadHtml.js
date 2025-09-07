import fs from 'fs';
import path from 'path';

/**
 * Load HTML content from the content directory
 * @param {string} filename - The HTML filename to load
 * @returns {string} - The HTML content with scripts stripped for safety
 */
export function loadHtmlFromContent(filename) {
  const filePath = path.join(process.cwd(), 'content', filename);

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    // Strip all <script>…</script> for safety
    return html.replace(/<script[\s\S]*?<\/script>/gi, '');
  } catch (error) {
    console.error(`Failed to load HTML file: ${filename}`, error);
    return '';
  }
}

/**
 * Load HTML content asynchronously (for App Router)
 * @param {string} filename - The HTML filename to load
 * @returns {Promise<string>} - The HTML content with scripts stripped for safety
 */
export async function loadHtmlFromContentAsync(filename) {
  const filePath = path.join(process.cwd(), 'content', filename);

  try {
    const { readFile } = await import('fs/promises');
    const html = await readFile(filePath, 'utf8');
    // Strip all <script>…</script> for safety
    return html.replace(/<script[\s\S]*?<\/script>/gi, '');
  } catch (error) {
    console.error(`Failed to load HTML file: ${filename}`, error);
    return '';
  }
}
