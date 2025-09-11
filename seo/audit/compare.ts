import fs from 'fs';
import path from 'path';
import type { CompetitorData } from './scrape-site';
import type { LighthouseResult } from './lighthouse-run';

interface KeywordMap {
  primary_keywords: string[];
  secondary_keywords: string[];
  location_keywords: string[];
  brand_keywords: string[];
  forbidden_keywords: string[];
  page_templates: {
    [key: string]: {
      title_template: string;
      description_template: string;
      h1_template: string;
    };
  };
}

interface CompetitorAnalysis {
  competitor: string;
  url: string;
  strengths: string[];
  weaknesses: string[];
  keywordGaps: string[];
  technicalIssues: string[];
  opportunities: string[];
  overallScore: number;
}

interface SEOComparison {
  ourSite: {
    currentTitle?: string;
    currentDescription?: string;
    currentH1?: string;
    currentKeywords?: string[];
    lighthouseScores?: LighthouseResult['scores'];
  };
  competitors: CompetitorAnalysis[];
  recommendations: {
    titleImprovements: string[];
    descriptionImprovements: string[];
    keywordOpportunities: string[];
    technicalFixes: string[];
    contentGaps: string[];
  };
  summary: {
    totalCompetitors: number;
    strongerCompetitors: number;
    weakerCompetitors: number;
    keyIssues: string[];
    quickWins: string[];
  };
}

class SEOComparer {
  private keywordMap: KeywordMap;
  private ourSiteData: CompetitorData | null = null;

  constructor() {
    // Load keyword mapping
    const keywordMapPath = path.join(process.cwd(), 'seo', 'keyword-map-th.json');
    this.keywordMap = JSON.parse(fs.readFileSync(keywordMapPath, 'utf-8'));
  }

  // Load our site data for comparison
  async loadOurSiteData(url: string = 'https://www.chiangmaiusedcar.com'): Promise<CompetitorData> {
    if (this.ourSiteData) return this.ourSiteData;

    // Try to load from existing scrape data first
    const scrapePath = path.join(process.cwd(), 'seo', 'audit');
    const files = fs
      .readdirSync(scrapePath)
      .filter(f => f.startsWith('competitor-data-') && f.endsWith('.json'));

    if (files.length > 0) {
      const latestFile = files.sort().reverse()[0];
      if (latestFile) {
        const data: CompetitorData[] = JSON.parse(
          fs.readFileSync(path.join(scrapePath, latestFile), 'utf-8')
        );
        const ourData = data.find(d => d.url === url);
        if (ourData) {
          this.ourSiteData = ourData;
          return ourData;
        }
      }
    }

    // If not found, create basic data structure
    this.ourSiteData = {
      name: 'ครูหนึ่งรถสวย',
      url,
      title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่ คุณภาพดี ราคาดี',
      description:
        'รถมือสองเชียงใหม่ คุณภาพดี ราคาดี ฟรีดาวน์ ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย',
      h1: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
      keywords: ['รถมือสองเชียงใหม่', 'ครูหนึ่งรถสวย', 'รถบ้าน', 'ฟรีดาวน์'],
      timestamp: new Date().toISOString(),
    };

    return this.ourSiteData;
  }

  // Analyze a single competitor
  analyzeCompetitor(competitor: CompetitorData, ourSite: CompetitorData): CompetitorAnalysis {
    const analysis: CompetitorAnalysis = {
      competitor: competitor.name,
      url: competitor.url,
      strengths: [],
      weaknesses: [],
      keywordGaps: [],
      technicalIssues: [],
      opportunities: [],
      overallScore: 0,
    };

    // Analyze title
    if (competitor.title) {
      const titleLength = competitor.title.length;
      if (titleLength > 60) {
        analysis.technicalIssues.push(`Title too long (${titleLength} chars)`);
      } else if (titleLength < 30) {
        analysis.technicalIssues.push(`Title too short (${titleLength} chars)`);
      } else {
        analysis.strengths.push('Good title length');
      }

      // Check for primary keywords in title
      const hasMainKeyword = this.keywordMap.primary_keywords.some(keyword =>
        competitor.title!.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasMainKeyword) {
        analysis.strengths.push('Contains primary keywords in title');
      } else {
        analysis.keywordGaps.push('Missing primary keywords in title');
      }
    } else {
      analysis.technicalIssues.push('Missing title tag');
    }

    // Analyze meta description
    if (competitor.description) {
      const descLength = competitor.description.length;
      if (descLength > 160) {
        analysis.technicalIssues.push(`Meta description too long (${descLength} chars)`);
      } else if (descLength < 120) {
        analysis.technicalIssues.push(`Meta description too short (${descLength} chars)`);
      } else {
        analysis.strengths.push('Good meta description length');
      }
    } else {
      analysis.technicalIssues.push('Missing meta description');
    }

    // Analyze H1
    if (competitor.h1) {
      const hasKeywordInH1 = this.keywordMap.primary_keywords.some(keyword =>
        competitor.h1!.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasKeywordInH1) {
        analysis.strengths.push('H1 contains primary keywords');
      } else {
        analysis.keywordGaps.push('H1 missing primary keywords');
      }
    } else {
      analysis.technicalIssues.push('Missing H1 tag');
    }

    // Analyze keywords coverage
    const competitorKeywords = competitor.keywords || [];
    const ourKeywords = ourSite.keywords || [];

    // Find keywords they have that we don't
    const theirUniqueKeywords = competitorKeywords.filter(
      keyword =>
        !ourKeywords.some(ourKeyword => ourKeyword.toLowerCase().includes(keyword.toLowerCase()))
    );

    if (theirUniqueKeywords.length > 0) {
      analysis.keywordGaps.push(`They target: ${theirUniqueKeywords.slice(0, 3).join(', ')}`);
    }

    // Check for forbidden keywords (potential issues)
    const usesForbiddenKeywords = this.keywordMap.forbidden_keywords.some(
      forbidden =>
        competitor.title?.toLowerCase().includes(forbidden.toLowerCase()) ||
        competitor.description?.toLowerCase().includes(forbidden.toLowerCase())
    );

    if (usesForbiddenKeywords) {
      analysis.opportunities.push('They use potentially problematic keywords');
    }

    // Technical SEO checks
    if (!competitor.canonicalUrl) {
      analysis.technicalIssues.push('Missing canonical URL');
    }

    if (!competitor.ogImage) {
      analysis.technicalIssues.push('Missing Open Graph image');
    }

    if (competitor.schemaMarkup && competitor.schemaMarkup.length === 0) {
      analysis.technicalIssues.push('No structured data found');
    } else if (competitor.schemaMarkup && competitor.schemaMarkup.length > 0) {
      analysis.strengths.push(`Has ${competitor.schemaMarkup.length} structured data items`);
    }

    // Calculate overall score
    let score = 50; // Base score

    // Add points for strengths
    score += analysis.strengths.length * 10;

    // Subtract points for issues
    score -= analysis.technicalIssues.length * 15;
    score -= analysis.keywordGaps.length * 10;

    // Bonus for load time (if available)
    if (competitor.loadTime && competitor.loadTime < 3000) {
      score += 10;
      analysis.strengths.push(`Fast load time (${competitor.loadTime}ms)`);
    } else if (competitor.loadTime && competitor.loadTime > 5000) {
      score -= 10;
      analysis.technicalIssues.push(`Slow load time (${competitor.loadTime}ms)`);
    }

    analysis.overallScore = Math.max(0, Math.min(100, score));

    return analysis;
  }

  // Generate comprehensive comparison
  async compareWithCompetitors(
    competitorDataFile?: string,
    lighthouseDataFile?: string
  ): Promise<SEOComparison> {
    // Load competitor data
    const scrapePath = path.join(process.cwd(), 'seo', 'audit');
    let competitorFile = competitorDataFile;

    if (!competitorFile) {
      const files = fs
        .readdirSync(scrapePath)
        .filter(f => f.startsWith('competitor-data-') && f.endsWith('.json'));
      if (files.length === 0) {
        throw new Error('No competitor data found. Run scrape-site.ts first.');
      }
      competitorFile = files.sort().reverse()[0]; // Get latest
    }

    const competitorData: CompetitorData[] = JSON.parse(
      fs.readFileSync(path.join(scrapePath, competitorFile!), 'utf-8')
    );

    // Load lighthouse data if available
    let lighthouseData: LighthouseResult[] = [];
    if (lighthouseDataFile) {
      const lighthouseResults = JSON.parse(
        fs.readFileSync(path.join(scrapePath, lighthouseDataFile), 'utf-8')
      );
      lighthouseData = lighthouseResults.competitors || [];
    }

    // Load our site data
    const ourSiteData = await this.loadOurSiteData();

    // Analyze each competitor
    const competitorAnalyses = competitorData
      .filter(comp => comp.url !== ourSiteData.url) // Exclude our own site
      .map(comp => this.analyzeCompetitor(comp, ourSiteData));

    // Generate recommendations
    const recommendations = this.generateRecommendations(competitorAnalyses, ourSiteData);

    // Create summary
    const strongerCompetitors = competitorAnalyses.filter(comp => comp.overallScore > 70).length;
    const weakerCompetitors = competitorAnalyses.filter(comp => comp.overallScore < 50).length;

    const comparison: SEOComparison = {
      ourSite: {
        currentTitle: ourSiteData.title || '',
        currentDescription: ourSiteData.description || '',
        currentH1: ourSiteData.h1 || '',
        currentKeywords: ourSiteData.keywords || [],
      },
      competitors: competitorAnalyses,
      recommendations,
      summary: {
        totalCompetitors: competitorAnalyses.length,
        strongerCompetitors,
        weakerCompetitors,
        keyIssues: this.extractKeyIssues(competitorAnalyses),
        quickWins: this.extractQuickWins(competitorAnalyses, ourSiteData),
      },
    };

    return comparison;
  }

  private generateRecommendations(
    analyses: CompetitorAnalysis[],
    ourSite: CompetitorData
  ): SEOComparison['recommendations'] {
    const recommendations: SEOComparison['recommendations'] = {
      titleImprovements: [],
      descriptionImprovements: [],
      keywordOpportunities: [],
      technicalFixes: [],
      contentGaps: [],
    };

    // Title improvements
    const currentTitleLength = ourSite.title?.length || 0;
    if (currentTitleLength > 60) {
      recommendations.titleImprovements.push('Shorten title to under 60 characters');
    } else if (currentTitleLength < 30) {
      recommendations.titleImprovements.push('Expand title to 30-60 characters for better SEO');
    }

    // Check if we're missing keywords that competitors use
    const allCompetitorKeywords = analyses.flatMap(a => a.keywordGaps);
    const uniqueKeywordOpportunities = [...new Set(allCompetitorKeywords)];
    recommendations.keywordOpportunities = uniqueKeywordOpportunities.slice(0, 5);

    // Technical fixes based on common competitor issues
    const commonTechnicalIssues = analyses.flatMap(a => a.technicalIssues);
    const technicalPatterns = this.findCommonPatterns(commonTechnicalIssues);

    technicalPatterns.forEach(pattern => {
      if (pattern.includes('canonical')) {
        recommendations.technicalFixes.push('Ensure all pages have canonical URLs');
      }
      if (pattern.includes('schema') || pattern.includes('structured')) {
        recommendations.technicalFixes.push('Add structured data markup');
      }
      if (pattern.includes('Open Graph')) {
        recommendations.technicalFixes.push('Add Open Graph images to all pages');
      }
    });

    // Description improvements
    const currentDescLength = ourSite.description?.length || 0;
    if (currentDescLength > 160) {
      recommendations.descriptionImprovements.push(
        'Shorten meta description to 120-160 characters'
      );
    } else if (currentDescLength < 120) {
      recommendations.descriptionImprovements.push('Expand meta description to 120-160 characters');
    }

    // Content gaps - what competitors do well that we might be missing
    const strongCompetitors = analyses.filter(a => a.overallScore > 70);
    const commonStrengths = strongCompetitors.flatMap(a => a.strengths);
    const strengthPatterns = this.findCommonPatterns(commonStrengths);

    strengthPatterns.forEach(pattern => {
      if (pattern.includes('structured data')) {
        recommendations.contentGaps.push('Add more structured data types');
      }
      if (pattern.includes('keywords')) {
        recommendations.contentGaps.push('Improve keyword targeting in content');
      }
      if (pattern.includes('load time')) {
        recommendations.contentGaps.push('Optimize page load speed');
      }
    });

    return recommendations;
  }

  private findCommonPatterns(items: string[]): string[] {
    const counts: { [key: string]: number } = {};

    items.forEach(item => {
      const words = item.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3) {
          // Only count meaningful words
          counts[word] = (counts[word] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .filter(([, count]) => count >= 2) // Appear at least twice
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private extractKeyIssues(analyses: CompetitorAnalysis[]): string[] {
    const issues: string[] = [];

    const strongCompetitors = analyses.filter(a => a.overallScore > 70);
    if (strongCompetitors.length > analyses.length / 2) {
      issues.push('More than half of competitors have strong SEO');
    }

    const commonKeywordGaps = this.findCommonPatterns(analyses.flatMap(a => a.keywordGaps));
    if (commonKeywordGaps.length > 0) {
      issues.push(`Missing keywords: ${commonKeywordGaps.slice(0, 2).join(', ')}`);
    }

    const commonTechnicalIssues = this.findCommonPatterns(analyses.flatMap(a => a.technicalIssues));
    if (commonTechnicalIssues.includes('canonical')) {
      issues.push('Canonical URL issues widespread');
    }

    return issues.slice(0, 3); // Top 3 issues
  }

  private extractQuickWins(analyses: CompetitorAnalysis[], ourSite: CompetitorData): string[] {
    const quickWins: string[] = [];

    // Check title length
    const titleLength = ourSite.title?.length || 0;
    if (titleLength < 30 || titleLength > 60) {
      quickWins.push('Optimize title length (30-60 chars)');
    }

    // Check description length
    const descLength = ourSite.description?.length || 0;
    if (descLength < 120 || descLength > 160) {
      quickWins.push('Optimize meta description length (120-160 chars)');
    }

    // If many competitors are missing structured data, this is an easy win
    const missingSchema = analyses.filter(a =>
      a.technicalIssues.some(issue => issue.includes('structured data'))
    ).length;

    if (missingSchema > analyses.length / 2) {
      quickWins.push('Add structured data for competitive advantage');
    }

    // If competitors have slow load times, speed is a win
    const slowCompetitors = analyses.filter(a =>
      a.technicalIssues.some(issue => issue.includes('load time'))
    ).length;

    if (slowCompetitors > 0) {
      quickWins.push('Page speed optimization for competitive edge');
    }

    return quickWins.slice(0, 3); // Top 3 quick wins
  }

  // Save comparison results
  static saveComparison(comparison: SEOComparison, filename?: string): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const outputFile = filename || `seo-comparison-${timestamp}.json`;
    const outputPath = path.join(process.cwd(), 'seo', 'audit', outputFile);

    fs.writeFileSync(outputPath, JSON.stringify(comparison, null, 2), 'utf-8');

    // Also save a readable summary
    const summaryPath = path.join(process.cwd(), 'seo', 'audit', `seo-summary-${timestamp}.txt`);
    const summary = SEOComparer.generateTextSummary(comparison);
    fs.writeFileSync(summaryPath, summary, 'utf-8');

    // eslint-disable-next-line no-console
    console.log(`SEO comparison saved to ${outputPath}`);
    // eslint-disable-next-line no-console
    console.log(`Summary saved to ${summaryPath}`);
  }

  static generateTextSummary(comparison: SEOComparison): string {
    let summary = '=== SEO COMPETITIVE ANALYSIS SUMMARY ===\n\n';

    summary += `📊 OVERVIEW:\n`;
    summary += `- Total Competitors Analyzed: ${comparison.summary.totalCompetitors}\n`;
    summary += `- Stronger Competitors: ${comparison.summary.strongerCompetitors}\n`;
    summary += `- Weaker Competitors: ${comparison.summary.weakerCompetitors}\n\n`;

    summary += `🎯 OUR CURRENT STATUS:\n`;
    summary += `- Title: ${comparison.ourSite.currentTitle}\n`;
    summary += `- Description: ${comparison.ourSite.currentDescription}\n`;
    summary += `- H1: ${comparison.ourSite.currentH1}\n\n`;

    summary += `⚠️ KEY ISSUES:\n`;
    comparison.summary.keyIssues.forEach((issue, index) => {
      summary += `${index + 1}. ${issue}\n`;
    });
    summary += '\n';

    summary += `⚡ QUICK WINS:\n`;
    comparison.summary.quickWins.forEach((win, index) => {
      summary += `${index + 1}. ${win}\n`;
    });
    summary += '\n';

    summary += `🔧 RECOMMENDED ACTIONS:\n`;

    if (comparison.recommendations.titleImprovements.length > 0) {
      summary += `Title Improvements:\n`;
      comparison.recommendations.titleImprovements.forEach(imp => (summary += `- ${imp}\n`));
    }

    if (comparison.recommendations.keywordOpportunities.length > 0) {
      summary += `Keyword Opportunities:\n`;
      comparison.recommendations.keywordOpportunities.forEach(opp => (summary += `- ${opp}\n`));
    }

    if (comparison.recommendations.technicalFixes.length > 0) {
      summary += `Technical Fixes:\n`;
      comparison.recommendations.technicalFixes.forEach(fix => (summary += `- ${fix}\n`));
    }

    summary += '\n📈 COMPETITOR BREAKDOWN:\n';
    comparison.competitors
      .sort((a, b) => b.overallScore - a.overallScore)
      .forEach(comp => {
        summary += `\n${comp.competitor} (Score: ${comp.overallScore}/100):\n`;
        summary += `  URL: ${comp.url}\n`;
        summary += `  Strengths: ${comp.strengths.join(', ') || 'None identified'}\n`;
        summary += `  Weaknesses: ${comp.technicalIssues.slice(0, 2).join(', ') || 'None found'}\n`;
      });

    return summary;
  }
}

// Export for use in other scripts
export { SEOComparer, type SEOComparison, type CompetitorAnalysis };

// CLI usage
if (require.main === module) {
  async function main() {
    const comparer = new SEOComparer();

    try {
      // eslint-disable-next-line no-console
      console.log('Starting SEO comparison analysis...');

      const comparison = await comparer.compareWithCompetitors();

      // Save results
      SEOComparer.saveComparison(comparison);

      // Print key findings
      // eslint-disable-next-line no-console
      console.log('\n=== KEY FINDINGS ===');
      // eslint-disable-next-line no-console
      console.log(`Analyzed ${comparison.summary.totalCompetitors} competitors`);
      // eslint-disable-next-line no-console
      console.log(
        `${comparison.summary.strongerCompetitors} are stronger, ${comparison.summary.weakerCompetitors} are weaker`
      );

      if (comparison.summary.quickWins.length > 0) {
        // eslint-disable-next-line no-console
        console.log('\nQuick wins:');
        comparison.summary.quickWins.forEach((win, index) => {
          // eslint-disable-next-line no-console
          console.log(`${index + 1}. ${win}`);
        });
      }

      if (comparison.summary.keyIssues.length > 0) {
        // eslint-disable-next-line no-console
        console.log('\nKey issues to address:');
        comparison.summary.keyIssues.forEach((issue, index) => {
          // eslint-disable-next-line no-console
          console.log(`${index + 1}. ${issue}`);
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SEO comparison failed:', error);
      process.exit(1);
    }
  }

  main();
}
