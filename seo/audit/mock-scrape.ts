import fs from 'fs';
import path from 'path';

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

// Mock data generator for testing
class MockCompetitorScraper {
  private config: Config;

  constructor() {
    const configPath = path.join(process.cwd(), 'config', 'competitors.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  async generateMockData(): Promise<CompetitorData[]> {
    const mockData: CompetitorData[] = [
      {
        name: 'AK Car Center',
        url: 'https://www.akcarscenter.com',
        title: 'AK Car Center - รถมือสองเชียงใหม่ ราคาดี คุณภาพดี',
        description:
          'รถมือสองเชียงใหม่ AK Car Center ราคาดี คุณภาพดี มีรับประกัน ส่งฟรีทั่วไทย โทร 053-123456',
        h1: 'AK Car Center - รถมือสองเชียงใหม่',
        keywords: ['รถมือสองเชียงใหม่', 'AK Car Center', 'รถบ้าน', 'รับประกัน'],
        metaRobots: 'index, follow',
        canonicalUrl: 'https://www.akcarscenter.com/',
        ogImage: 'https://www.akcarscenter.com/images/og-image.jpg',
        schemaMarkup: [
          {
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            name: 'AK Car Center',
          },
        ],
        loadTime: 2800,
        timestamp: new Date().toISOString(),
      },
      {
        name: 'One2Car Chiang Mai',
        url: 'https://www.one2car.com/th/chiangmai',
        title: 'รถมือสองเชียงใหม่ - One2Car ประกาศรถยนต์ใหม่และมือสอง',
        description:
          'ค้นหารถมือสองเชียงใหม่ บน One2Car เว็บไซต์ขายรถยนต์ใหม่และมือสอง ราคาดี มีรูปภาพ ข้อมูลครบถ้วน',
        h1: 'รถมือสองเชียงใหม่ - ประกาศขายรถยนต์',
        keywords: ['รถมือสองเชียงใหม่', 'One2Car', 'ประกาศรถ', 'รถยนต์มือสอง'],
        metaRobots: 'index, follow',
        canonicalUrl: 'https://www.one2car.com/th/chiangmai',
        ogImage: 'https://www.one2car.com/images/og-default.jpg',
        schemaMarkup: [],
        loadTime: 3200,
        timestamp: new Date().toISOString(),
      },
      {
        name: 'Carsome Chiang Mai',
        url: 'https://www.carsome.co.th/chiangmai',
        title: 'Carsome เชียงใหม่ - รถมือสองคุณภาพ ตรวจสภาพ 175 จุด',
        description:
          'รถมือสองเชียงใหม่จาก Carsome ตรวจสภาพ 175 จุด รับประกัน 1 ปี ฟรีดาวน์ ดอกเบี้ยต่ำ',
        h1: 'Carsome เชียงใหม่ - รถมือสองคุณภาพ',
        keywords: ['รถมือสองเชียงใหม่', 'Carsome', 'ตรวจสภาพ 175 จุด', 'รับประกัน 1 ปี'],
        metaRobots: 'index, follow',
        canonicalUrl: 'https://www.carsome.co.th/chiangmai',
        ogImage: 'https://www.carsome.co.th/images/og-carsome.jpg',
        schemaMarkup: [
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Carsome Thailand',
          },
        ],
        loadTime: 2400,
        timestamp: new Date().toISOString(),
      },
      {
        name: 'Ennxo Chiang Mai',
        url: 'https://www.ennxo.com/chiangmai',
        title: 'Ennxo เชียงใหม่ - แพลตฟอร์มรถยนต์ออนไลน์ ซื้อขายง่าย',
        description:
          'รถมือสองเชียงใหม่ Ennxo แพลตฟอร์มออนไลน์ ซื้อขายรถง่าย ราคาโปร่งใส เช็คประวัติรถ',
        h1: 'Ennxo เชียงใหม่ - แพลตฟอร์มรถยนต์ออนไลน์',
        keywords: ['รถมือสองเชียงใหม่', 'Ennxo', 'แพลตฟอร์มออนไลน์', 'เช็คประวัติรถ'],
        metaRobots: 'index, follow',
        canonicalUrl: 'https://www.ennxo.com/chiangmai',
        ogImage: 'https://www.ennxo.com/images/og-ennxo.jpg',
        schemaMarkup: [],
        loadTime: 2600,
        timestamp: new Date().toISOString(),
      },
      // Add our own site data for comparison
      {
        name: 'ครูหนึ่งรถสวย',
        url: 'https://www.chiangmaiusedcar.com',
        title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่ คุณภาพดี ราคาดี',
        description:
          'รถมือสองเชียงใหม่ คุณภาพดี ราคาดี ฟรีดาวน์ ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย โทร 094-455-5955',
        h1: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
        keywords: ['รถมือสองเชียงใหม่', 'ครูหนึ่งรถสวย', 'รถบ้าน', 'ฟรีดาวน์', 'ดอกเบี้ยต่ำ'],
        metaRobots: 'index, follow',
        canonicalUrl: 'https://www.chiangmaiusedcar.com/',
        ogImage: 'https://www.chiangmaiusedcar.com/images/og-default.jpg',
        schemaMarkup: [
          {
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            name: 'ครูหนึ่งรถสวย',
          },
        ],
        loadTime: 1800,
        timestamp: new Date().toISOString(),
      },
    ];

    return mockData;
  }

  async scrapeAllCompetitors(): Promise<CompetitorData[]> {
    // eslint-disable-next-line no-console
    console.log('🧪 Using mock data for competitor analysis (playwright not configured)...');
    return this.generateMockData();
  }

  static saveResults(data: CompetitorData[], filename: string = 'competitor-data.json'): void {
    const outputPath = path.join(process.cwd(), 'seo', 'audit', filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`Mock competitor data saved to ${outputPath}`);
  }
}

// Export types and class
export { MockCompetitorScraper, type CompetitorData };

// CLI usage
if (require.main === module) {
  async function main() {
    const scraper = new MockCompetitorScraper();

    try {
      const results = await scraper.scrapeAllCompetitors();

      // Save results
      const timestamp = new Date().toISOString().split('T')[0];
      MockCompetitorScraper.saveResults(results, `competitor-data-${timestamp}.json`);

      // Print summary
      // eslint-disable-next-line no-console
      console.log('\n=== MOCK DATA SUMMARY ===');
      results.forEach(result => {
        // eslint-disable-next-line no-console
        console.log(`${result.name}:`);
        // eslint-disable-next-line no-console
        console.log(`  Title: ${result.title?.substring(0, 60)}...`);
        // eslint-disable-next-line no-console
        console.log(`  Keywords: ${result.keywords?.length || 0} found`);
        // eslint-disable-next-line no-console
        console.log(`  Load Time: ${result.loadTime}ms`);
        // eslint-disable-next-line no-console
        console.log('');
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Mock data generation failed:', error);
      process.exit(1);
    }
  }

  main();
}
