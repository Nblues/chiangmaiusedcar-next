import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-chromium';
import type { Browser, Page } from 'playwright-chromium';

interface CompetitorData {
  name: string;
  url: string;
  title?: string;
  description?: string;
  h1?: string;
  keywords?: string[];
  metaRobots?: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaMarkup?: any[];
  loadTime?: number;
  mobileScore?: number;
  desktopScore?: number;
  timestamp?: string;
}

interface Config {
  competitors: {
    name: string;
    url: string;
    priority: number;
  }[];
  settings: {
    lighthouse_timeout: number;
    scrape_timeout: number;
    user_agent: string;
  };
}

class CompetitorScraper {
  private browser: Browser | null = null;
  private config: Config;

  constructor() {
    const configPath = path.join(process.cwd(), 'config', 'competitors.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  }

  async scrapeSite(url: string): Promise<CompetitorData> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage({
      userAgent: this.config.settings.user_agent,
    });

    try {
      // Set timeout and navigate
      page.setDefaultTimeout(this.config.settings.scrape_timeout);
      const startTime = Date.now();

      await page.goto(url, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Extract basic SEO data
      const data: CompetitorData = {
        name: this.getCompetitorName(url),
        url,
        timestamp: new Date().toISOString(),
        loadTime,
      };

      // Title
      data.title = (await page.title()) || '';

      // Meta description
      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
      data.description = metaDesc || '';

      // H1
      const h1Element = await page.locator('h1').first();
      data.h1 = (await h1Element.textContent()) || '';

      // Meta robots
      const metaRobots = await page.locator('meta[name="robots"]').getAttribute('content');
      data.metaRobots = metaRobots || '';

      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      data.canonicalUrl = canonical || '';

      // OG Image
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      data.ogImage = ogImage || '';

      // Keywords from meta tags
      const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
      data.keywords = metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : [];

      // Extract Schema.org JSON-LD
      const schemaScripts = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      data.schemaMarkup = schemaScripts
        .map(script => {
          try {
            return JSON.parse(script);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      // Extract Thai keywords from content
      const contentKeywords = await this.extractThaiKeywords(page);
      data.keywords = [...(data.keywords || []), ...contentKeywords];

      return data;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return {
        name: this.getCompetitorName(url),
        url,
        timestamp: new Date().toISOString(),
        title: 'Error: Could not scrape',
        description: `Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    } finally {
      await page.close();
    }
  }

  private async extractThaiKeywords(page: Page): Promise<string[]> {
    const thaiKeywords: string[] = [];

    try {
      // Get text from key elements
      const titleText = (await page.title()) || '';
      const h1Text = (await page.locator('h1').first().textContent()) || '';
      const metaDesc =
        (await page.locator('meta[name="description"]').getAttribute('content')) || '';

      // Combine all text
      const allText = `${titleText} ${h1Text} ${metaDesc}`.toLowerCase();

      // Common Thai car-related keywords to look for
      const carKeywords = [
        'รถมือสอง',
        'รถยนต์',
        'รถบ้าน',
        'มือสอง',
        'เชียงใหม่',
        'toyota',
        'honda',
        'nissan',
        'mazda',
        'mitsubishi',
        'ฟรีดาวน์',
        'ดอกเบี้ย',
        'รับประกัน',
        'ประกัน',
        'eco car',
        'ประหยัด',
        'น้ำมัน',
        'ไฮบริด',
        'วิ่งน้อย',
        'ปี',
        'รุ่น',
        'สี',
        'ราคา',
      ];

      carKeywords.forEach(keyword => {
        if (allText.includes(keyword)) {
          thaiKeywords.push(keyword);
        }
      });
    } catch (error) {
      console.warn('Error extracting Thai keywords:', error);
    }

    return [...new Set(thaiKeywords)]; // Remove duplicates
  }

  private getCompetitorName(url: string): string {
    const competitor = this.config.competitors.find(c => c.url === url);
    return competitor?.name || new URL(url).hostname;
  }

  async scrapeAllCompetitors(): Promise<CompetitorData[]> {
    const results: CompetitorData[] = [];

    for (const competitor of this.config.competitors) {
      console.log(`Scraping ${competitor.name}...`);

      try {
        const data = await this.scrapeSite(competitor.url);
        results.push(data);

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to scrape ${competitor.name}:`, error);
        results.push({
          name: competitor.name,
          url: competitor.url,
          timestamp: new Date().toISOString(),
          title: 'Error: Scraping failed',
        });
      }
    }

    return results;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Save results to JSON file
  static saveResults(data: CompetitorData[], filename: string = 'competitor-data.json'): void {
    const outputPath = path.join(process.cwd(), 'seo', 'audit', filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Results saved to ${outputPath}`);
  }
}

// Export for use in other scripts
export { CompetitorScraper, type CompetitorData };

// CLI usage
if (require.main === module) {
  async function main() {
    const scraper = new CompetitorScraper();

    try {
      await scraper.initialize();
      console.log('Starting competitor scraping...');

      const results = await scraper.scrapeAllCompetitors();

      // Save results
      const timestamp = new Date().toISOString().split('T')[0];
      CompetitorScraper.saveResults(results, `competitor-data-${timestamp}.json`);

      // Print summary
      console.log('\n=== SCRAPING SUMMARY ===');
      results.forEach(result => {
        console.log(`${result.name}:`);
        console.log(`  Title: ${result.title?.substring(0, 60)}...`);
        console.log(`  H1: ${result.h1?.substring(0, 60)}...`);
        console.log(`  Keywords: ${result.keywords?.length || 0} found`);
        console.log(`  Load Time: ${result.loadTime}ms`);
        console.log('');
      });
    } catch (error) {
      console.error('Scraping failed:', error);
      process.exit(1);
    } finally {
      await scraper.close();
    }
  }

  main();
}
