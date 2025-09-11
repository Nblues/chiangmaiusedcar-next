import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface LighthouseResult {
  url: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    speedIndex: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    savings?: number;
  }>;
  timestamp: string;
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

class LighthouseAuditor {
  private config: Config;

  constructor() {
    const configPath = path.join(process.cwd(), 'config', 'competitors.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  async runLighthouse(
    url: string,
    device: 'mobile' | 'desktop' = 'mobile'
  ): Promise<LighthouseResult> {
    const outputPath = path.join(process.cwd(), 'seo', 'audit', 'temp-lighthouse.json');

    try {
      // Lighthouse CLI command
      const formFactor = device === 'mobile' ? 'mobile' : 'desktop';
      const screenEmulation =
        device === 'mobile'
          ? '--screenEmulation.mobile=true --screenEmulation.width=375 --screenEmulation.height=667'
          : '--screenEmulation.mobile=false --screenEmulation.width=1920 --screenEmulation.height=1080';

      const command = [
        'npx lighthouse',
        `"${url}"`,
        '--output=json',
        `--output-path="${outputPath}"`,
        '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"',
        `--form-factor=${formFactor}`,
        screenEmulation,
        '--only-categories=performance,accessibility,best-practices,seo',
        '--disable-storage-reset',
        `--max-wait-for-load=${this.config.settings.lighthouse_timeout}`,
        '--quiet',
      ].join(' ');

      // Run Lighthouse
      execSync(command, {
        timeout: this.config.settings.lighthouse_timeout + 10000,
        stdio: 'pipe',
      });

      // Read results
      const rawResults = fs.readFileSync(outputPath, 'utf-8');
      const lighthouseData = JSON.parse(rawResults);

      // Extract key metrics
      const result: LighthouseResult = {
        url,
        scores: {
          performance: Math.round((lighthouseData.categories.performance?.score || 0) * 100),
          accessibility: Math.round((lighthouseData.categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round(
            (lighthouseData.categories['best-practices']?.score || 0) * 100
          ),
          seo: Math.round((lighthouseData.categories.seo?.score || 0) * 100),
        },
        metrics: {
          firstContentfulPaint: lighthouseData.audits['first-contentful-paint']?.numericValue || 0,
          largestContentfulPaint:
            lighthouseData.audits['largest-contentful-paint']?.numericValue || 0,
          speedIndex: lighthouseData.audits['speed-index']?.numericValue || 0,
          totalBlockingTime: lighthouseData.audits['total-blocking-time']?.numericValue || 0,
          cumulativeLayoutShift:
            lighthouseData.audits['cumulative-layout-shift']?.numericValue || 0,
        },
        opportunities: this.extractOpportunities(lighthouseData),
        timestamp: new Date().toISOString(),
      };

      // Clean up temp file
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      return result;
    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      throw new Error(
        `Lighthouse audit failed for ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private extractOpportunities(lighthouseData: any): LighthouseResult['opportunities'] {
    const opportunities: LighthouseResult['opportunities'] = [];

    // Key performance opportunities
    const performanceAudits = [
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'duplicate-id-used',
    ];

    performanceAudits.forEach((auditId: string) => {
      const audit = lighthouseData.audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: Math.round(audit.score * 100),
          savings: audit.details?.overallSavingsMs || audit.details?.overallSavingsBytes,
        });
      }
    });

    // SEO opportunities
    const seoAudits = [
      'meta-description',
      'document-title',
      'crawlable-anchors',
      'is-crawlable',
      'robots-txt',
      'image-alt',
      'link-text',
      'structured-data',
    ];

    seoAudits.forEach((auditId: string) => {
      const audit = lighthouseData.audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: Math.round(audit.score * 100),
        });
      }
    });

    return opportunities.sort((a, b) => a.score - b.score); // Sort by lowest score first
  }

  async auditAllCompetitors(device: 'mobile' | 'desktop' = 'mobile'): Promise<LighthouseResult[]> {
    const results: LighthouseResult[] = [];

    for (const competitor of this.config.competitors) {
      try {
        // eslint-disable-next-line no-console
        console.log(`Running Lighthouse audit for ${competitor.name} (${device})...`);

        const result = await this.runLighthouse(competitor.url, device);
        results.push(result);

        // Small delay between audits
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Lighthouse audit failed for ${competitor.name}:`, error);

        // Add error result
        results.push({
          url: competitor.url,
          scores: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
          metrics: {
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            speedIndex: 0,
            totalBlockingTime: 0,
            cumulativeLayoutShift: 0,
          },
          opportunities: [],
          timestamp: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  // Compare scores with our site
  async compareWithOurSite(ourSiteUrl: string = 'https://www.chiangmaiusedcar.com'): Promise<{
    ourSite: LighthouseResult;
    competitors: LighthouseResult[];
    analysis: {
      weakerThan: string[];
      strongerThan: string[];
      improvements: string[];
    };
  }> {
    // eslint-disable-next-line no-console
    console.log('Auditing our site...');
    const ourSite = await this.runLighthouse(ourSiteUrl);

    // eslint-disable-next-line no-console
    console.log('Auditing competitors...');
    const competitors = await this.auditAllCompetitors();

    // Analysis
    const analysis = {
      weakerThan: [] as string[],
      strongerThan: [] as string[],
      improvements: [] as string[],
    };

    competitors.forEach(competitor => {
      const competitorName = this.getCompetitorName(competitor.url);
      const ourOverallScore = (ourSite.scores.performance + ourSite.scores.seo) / 2;
      const theirOverallScore = (competitor.scores.performance + competitor.scores.seo) / 2;

      if (ourOverallScore < theirOverallScore) {
        analysis.weakerThan.push(
          `${competitorName} (${theirOverallScore.toFixed(1)} vs ${ourOverallScore.toFixed(1)})`
        );
      } else {
        analysis.strongerThan.push(
          `${competitorName} (${ourOverallScore.toFixed(1)} vs ${theirOverallScore.toFixed(1)})`
        );
      }
    });

    // Extract improvement opportunities from our site
    analysis.improvements = ourSite.opportunities
      .filter(opp => opp.score < 80)
      .map(opp => `${opp.title}: ${opp.description}`)
      .slice(0, 5); // Top 5 improvements

    return { ourSite, competitors, analysis };
  }

  private getCompetitorName(url: string): string {
    const competitor = this.config.competitors.find(c => c.url === url);
    return competitor?.name || new URL(url).hostname;
  }

  // Save results to JSON file
  static saveResults(data: any, filename: string = 'lighthouse-results.json'): void {
    const outputPath = path.join(process.cwd(), 'seo', 'audit', filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`Lighthouse results saved to ${outputPath}`);
  }
}

// Export for use in other scripts
export { LighthouseAuditor, type LighthouseResult };

// CLI usage
if (require.main === module) {
  async function main() {
    const auditor = new LighthouseAuditor();

    try {
      const comparison = await auditor.compareWithOurSite();

      // Save results
      const timestamp = new Date().toISOString().split('T')[0];
      LighthouseAuditor.saveResults(comparison, `lighthouse-comparison-${timestamp}.json`);

      // Print summary
      // eslint-disable-next-line no-console
      console.log('\n=== LIGHTHOUSE COMPARISON SUMMARY ===');
      // eslint-disable-next-line no-console
      console.log(`Our Site Performance: ${comparison.ourSite.scores.performance}/100`);
      // eslint-disable-next-line no-console
      console.log(`Our Site SEO: ${comparison.ourSite.scores.seo}/100`);
      // eslint-disable-next-line no-console
      console.log(
        '\nWeaker than:',
        comparison.analysis.weakerThan.length ? comparison.analysis.weakerThan.join(', ') : 'None'
      );
      // eslint-disable-next-line no-console
      console.log(
        'Stronger than:',
        comparison.analysis.strongerThan.length
          ? comparison.analysis.strongerThan.join(', ')
          : 'None'
      );
      // eslint-disable-next-line no-console
      console.log('\nTop improvements needed:');
      comparison.analysis.improvements.forEach((improvement, index) => {
        // eslint-disable-next-line no-console
        console.log(`${index + 1}. ${improvement}`);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Lighthouse comparison failed:', error);
      process.exit(1);
    }
  }

  main();
}
