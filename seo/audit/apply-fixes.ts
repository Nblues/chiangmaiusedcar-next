import fs from 'fs';
import path from 'path';
import type { SEOComparison } from './compare';

interface OptimizationResult {
  type: 'title' | 'description' | 'h1' | 'keyword' | 'technical';
  action: string;
  oldValue?: string;
  newValue?: string;
  file: string;
  success: boolean;
  error?: string;
}

interface AppliedFixes {
  timestamp: string;
  totalFixes: number;
  successful: number;
  failed: number;
  results: OptimizationResult[];
  rollbackData: {
    [filePath: string]: string; // Original file content for rollback
  };
}

class SEOOptimizer {
  private dryRun: boolean;
  private backupData: { [filePath: string]: string } = {};

  constructor(dryRun: boolean = true) {
    this.dryRun = dryRun;
  }

  // Apply SEO fixes based on comparison analysis
  async applyFixes(comparisonFile: string): Promise<AppliedFixes> {
    const comparisonPath = path.join(process.cwd(), 'seo', 'audit', comparisonFile);

    if (!fs.existsSync(comparisonPath)) {
      throw new Error(`Comparison file not found: ${comparisonPath}`);
    }

    const comparison: SEOComparison = JSON.parse(fs.readFileSync(comparisonPath, 'utf-8'));
    const results: OptimizationResult[] = [];

    // eslint-disable-next-line no-console
    console.log(`Starting SEO optimization (${this.dryRun ? 'DRY RUN' : 'LIVE'})...`);

    // 1. Fix homepage title and description
    const homepageResults = await this.optimizeHomepage(comparison);
    results.push(...homepageResults);

    // 2. Update SEO component with better templates
    const seoComponentResults = await this.optimizeSEOComponent(comparison);
    results.push(...seoComponentResults);

    // 3. Add missing structured data
    const structuredDataResults = await this.addStructuredData(comparison);
    results.push(...structuredDataResults);

    // 4. Fix technical SEO issues
    const technicalResults = await this.fixTechnicalIssues(comparison);
    results.push(...technicalResults);

    // Compile final results
    const appliedFixes: AppliedFixes = {
      timestamp: new Date().toISOString(),
      totalFixes: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
      rollbackData: this.backupData,
    };

    // Save results
    this.saveOptimizationResults(appliedFixes);

    return appliedFixes;
  }

  private async optimizeHomepage(comparison: SEOComparison): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];
    const homePagePath = path.join(process.cwd(), 'pages', 'index.js');

    if (!fs.existsSync(homePagePath)) {
      results.push({
        type: 'technical',
        action: 'Find homepage file',
        file: homePagePath,
        success: false,
        error: 'Homepage file not found',
      });
      return results;
    }

    try {
      // Read current homepage
      const originalContent = fs.readFileSync(homePagePath, 'utf-8');
      this.backupData[homePagePath] = originalContent;
      let content = originalContent;

      // Check for title improvements
      const titleImprovements = comparison.recommendations.titleImprovements;
      if (titleImprovements.length > 0) {
        // Look for SEO component or title setting
        const seoMatch = content.match(/<SEO\s+title={?"([^"]+)"/);
        if (seoMatch && seoMatch[1]) {
          const currentTitle = seoMatch[1];
          let newTitle = this.generateOptimizedTitle(currentTitle, comparison);

          // Apply title length fixes
          if (titleImprovements.some(imp => imp.includes('Shorten'))) {
            newTitle = this.shortenTitle(newTitle);
          } else if (titleImprovements.some(imp => imp.includes('Expand'))) {
            newTitle = this.expandTitle(newTitle, comparison);
          }

          content = content.replace(new RegExp(`(<SEO\\s+title={?")([^"]+)(")`), `$1${newTitle}$3`);

          results.push({
            type: 'title',
            action: 'Optimize homepage title',
            oldValue: currentTitle,
            newValue: newTitle,
            file: homePagePath,
            success: true,
          });
        }
      }

      // Check for description improvements
      const descImprovements = comparison.recommendations.descriptionImprovements;
      if (descImprovements.length > 0) {
        const descMatch = content.match(/description={?"([^"]+)"/);
        if (descMatch && descMatch[1]) {
          const currentDesc = descMatch[1];
          let newDesc = this.generateOptimizedDescription(currentDesc, comparison);

          // Apply description length fixes
          if (descImprovements.some(imp => imp.includes('Shorten'))) {
            newDesc = this.shortenDescription(newDesc);
          } else if (descImprovements.some(imp => imp.includes('Expand'))) {
            newDesc = this.expandDescription(newDesc, comparison);
          }

          content = content.replace(new RegExp(`(description={?")([^"]+)(")`), `$1${newDesc}$3`);

          results.push({
            type: 'description',
            action: 'Optimize homepage description',
            oldValue: currentDesc,
            newValue: newDesc,
            file: homePagePath,
            success: true,
          });
        }
      }

      // Write changes if not dry run
      if (!this.dryRun && content !== originalContent) {
        fs.writeFileSync(homePagePath, content, 'utf-8');
      }
    } catch (error) {
      results.push({
        type: 'technical',
        action: 'Optimize homepage',
        file: homePagePath,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return results;
  }

  private async optimizeSEOComponent(comparison: SEOComparison): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];
    const seoComponentPath = path.join(process.cwd(), 'components', 'SEO.jsx');

    if (!fs.existsSync(seoComponentPath)) {
      results.push({
        type: 'technical',
        action: 'Find SEO component',
        file: seoComponentPath,
        success: false,
        error: 'SEO component not found',
      });
      return results;
    }

    try {
      const originalContent = fs.readFileSync(seoComponentPath, 'utf-8');
      this.backupData[seoComponentPath] = originalContent;
      let content = originalContent;

      // Add keyword optimization logic
      const keywordOpportunities = comparison.recommendations.keywordOpportunities;
      if (keywordOpportunities.length > 0) {
        // Look for title generation logic and enhance it
        const titleDefaultMatch = content.match(/(const finalTitle = title \|\| )([^;]+);/);
        if (titleDefaultMatch) {
          const enhancedDefault = `"ครูหนึ่งรถสวย - รถมือสองเชียงใหม่ คุณภาพดี ราคาดี | ${keywordOpportunities[0]}"`;
          content = content.replace(
            titleDefaultMatch[0],
            `${titleDefaultMatch[1]}${enhancedDefault};`
          );

          results.push({
            type: 'keyword',
            action: 'Add keyword opportunities to default title',
            oldValue: titleDefaultMatch[2] || '',
            newValue: enhancedDefault,
            file: seoComponentPath,
            success: true,
          });
        }
      }

      // Enhance meta description with competitor insights
      const descMatch = content.match(/(const finalDescription = description \|\| )([^;]+);/);
      if (descMatch && comparison.recommendations.keywordOpportunities.length > 0) {
        const topKeywords = comparison.recommendations.keywordOpportunities.slice(0, 2).join(' ');
        const enhancedDesc = `"รถมือสองเชียงใหม่คุณภาพดี ${topKeywords} ฟรีดาวน์ ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย โทร 094-455-5955"`;

        content = content.replace(descMatch[0], `${descMatch[1]}${enhancedDesc};`);

        results.push({
          type: 'description',
          action: 'Enhance default description with keywords',
          oldValue: descMatch[2] || '',
          newValue: enhancedDesc,
          file: seoComponentPath,
          success: true,
        });
      }

      // Write changes if not dry run
      if (!this.dryRun && content !== originalContent) {
        fs.writeFileSync(seoComponentPath, content, 'utf-8');
      }
    } catch (error) {
      results.push({
        type: 'technical',
        action: 'Optimize SEO component',
        file: seoComponentPath,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return results;
  }

  private async addStructuredData(comparison: SEOComparison): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];

    // Check if competitors have structured data that we're missing
    const needsStructuredData = comparison.recommendations.technicalFixes.includes(
      'Add structured data markup'
    );

    if (!needsStructuredData) {
      return results;
    }

    const structuredDataPath = path.join(process.cwd(), 'components', 'StructuredData.jsx');

    try {
      let content: string;

      if (fs.existsSync(structuredDataPath)) {
        content = fs.readFileSync(structuredDataPath, 'utf-8');
        this.backupData[structuredDataPath] = content;
      } else {
        // Create new structured data component
        content = this.generateStructuredDataComponent();
      }

      // Enhance with automotive business schema
      const enhancedContent = this.addAutomotiveSchema(content);

      if (!this.dryRun) {
        fs.writeFileSync(structuredDataPath, enhancedContent, 'utf-8');
      }

      results.push({
        type: 'technical',
        action: fs.existsSync(structuredDataPath)
          ? 'Enhance structured data'
          : 'Create structured data component',
        file: structuredDataPath,
        success: true,
        newValue: 'Added automotive business schema',
      });
    } catch (error) {
      results.push({
        type: 'technical',
        action: 'Add structured data',
        file: structuredDataPath,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return results;
  }

  private async fixTechnicalIssues(comparison: SEOComparison): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];
    const technicalFixes = comparison.recommendations.technicalFixes;

    // Fix canonical URL issues
    if (technicalFixes.includes('Ensure all pages have canonical URLs')) {
      const seoResult = await this.fixCanonicalUrls();
      results.push(...seoResult);
    }

    // Fix Open Graph images
    if (technicalFixes.includes('Add Open Graph images to all pages')) {
      const ogResult = await this.fixOpenGraphImages();
      results.push(...ogResult);
    }

    return results;
  }

  private async fixCanonicalUrls(): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];
    const seoComponentPath = path.join(process.cwd(), 'components', 'SEO.jsx');

    try {
      const content = fs.readFileSync(seoComponentPath, 'utf-8');

      // Check if canonical URL logic exists
      if (!content.includes('canonical')) {
        const headSection = content.match(/(<Head>[\s\S]*?)(<\/Head>)/);
        if (headSection) {
          const canonicalLink =
            '\n        <link rel="canonical" href={`https://www.chiangmaiusedcar.com${router.asPath}`} />';
          const newHeadSection = headSection[1] + canonicalLink + '\n      ' + headSection[2];
          const newContent = content.replace(headSection[0], newHeadSection);

          if (!this.dryRun) {
            fs.writeFileSync(seoComponentPath, newContent, 'utf-8');
          }

          results.push({
            type: 'technical',
            action: 'Add canonical URL logic',
            file: seoComponentPath,
            success: true,
            newValue: 'Added dynamic canonical URLs',
          });
        }
      }
    } catch (error) {
      results.push({
        type: 'technical',
        action: 'Fix canonical URLs',
        file: seoComponentPath,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return results;
  }

  private async fixOpenGraphImages(): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];
    const seoComponentPath = path.join(process.cwd(), 'components', 'SEO.jsx');

    try {
      const content = fs.readFileSync(seoComponentPath, 'utf-8');

      // Check if default OG image exists
      if (!content.includes('og:image') || !content.includes('default-og-image')) {
        const ogImageLine =
          '\n        <meta property="og:image" content={image || "https://www.chiangmaiusedcar.com/images/og-default.jpg"} />';

        // Add after other OG tags
        const ogTitleMatch = content.match(/(<meta property="og:title"[^>]*>)/);
        if (ogTitleMatch) {
          const newContent = content.replace(ogTitleMatch[0], ogTitleMatch[0] + ogImageLine);

          if (!this.dryRun) {
            fs.writeFileSync(seoComponentPath, newContent, 'utf-8');
          }

          results.push({
            type: 'technical',
            action: 'Add default OG image',
            file: seoComponentPath,
            success: true,
            newValue: 'Added fallback Open Graph image',
          });
        }
      }
    } catch (error) {
      results.push({
        type: 'technical',
        action: 'Fix Open Graph images',
        file: seoComponentPath,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return results;
  }

  // Helper methods for title/description optimization
  private generateOptimizedTitle(currentTitle: string, comparison: SEOComparison): string {
    const opportunities = comparison.recommendations.keywordOpportunities;

    if (opportunities.length === 0) return currentTitle;

    // Add high-value keywords to title
    const topKeyword = opportunities[0];
    if (topKeyword && !currentTitle.toLowerCase().includes(topKeyword.toLowerCase())) {
      return `${currentTitle} | ${topKeyword}`;
    }

    return currentTitle;
  }

  private shortenTitle(title: string): string {
    if (title.length <= 60) return title;

    // Remove redundant words, keep core message
    return (
      title
        .replace(/\s*\|\s*[^|]*$/, '') // Remove last part after |
        .substring(0, 57) + '...'
    );
  }

  private expandTitle(title: string, comparison: SEOComparison): string {
    const opportunities = comparison.recommendations.keywordOpportunities;

    if (title.length >= 30 || opportunities.length === 0) return title;

    return `${title} ${opportunities[0]}`;
  }

  private generateOptimizedDescription(currentDesc: string, comparison: SEOComparison): string {
    const opportunities = comparison.recommendations.keywordOpportunities.slice(0, 2);

    if (opportunities.length === 0) return currentDesc;

    // Inject keywords naturally
    const keywordPhrase = opportunities.join(' ');
    if (!currentDesc.toLowerCase().includes(keywordPhrase.toLowerCase())) {
      return `${keywordPhrase} ${currentDesc}`;
    }

    return currentDesc;
  }

  private shortenDescription(desc: string): string {
    if (desc.length <= 160) return desc;

    return desc.substring(0, 157) + '...';
  }

  private expandDescription(desc: string, comparison: SEOComparison): string {
    if (desc.length >= 120) return desc;

    const opportunities = comparison.recommendations.keywordOpportunities.slice(0, 1);
    if (opportunities.length > 0) {
      return `${desc} ${opportunities[0]}`;
    }

    return desc;
  }

  private generateStructuredDataComponent(): string {
    return `import Head from 'next/head';

export default function StructuredData({ type = 'homepage', data = {} }) {
  const getSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "AutoDealer",
      "name": "ครูหนึ่งรถสวย",
      "description": "รถมือสองเชียงใหม่ คุณภาพดี ราคาดี",
      "url": "https://www.chiangmaiusedcar.com",
      "telephone": "094-455-5955",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "สันพระเนตร",
        "addressLocality": "เชียงใหม่",
        "addressRegion": "เชียงใหม่",
        "postalCode": "50000",
        "addressCountry": "TH"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "18.7883",
        "longitude": "98.9853"
      },
      "openingHours": "Mo-Su 08:00-18:00",
      "priceRange": "฿฿"
    };

    if (type === 'car' && data.car) {
      return {
        "@context": "https://schema.org",
        "@type": "Car",
        "name": \`\${data.car.brand} \${data.car.model}\`,
        "brand": data.car.brand,
        "model": data.car.model,
        "vehicleYear": data.car.year,
        "mileageFromOdometer": data.car.mileage,
        "offers": {
          "@type": "Offer",
          "price": data.car.price,
          "priceCurrency": "THB",
          "seller": baseSchema
        }
      };
    }

    return baseSchema;
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSchema())
        }}
      />
    </Head>
  );
}`;
  }

  private addAutomotiveSchema(content: string): string {
    // If content already has automotive schema, enhance it
    if (content.includes('AutoDealer')) {
      return content;
    }

    // Otherwise add automotive business schema
    return this.generateStructuredDataComponent();
  }

  private saveOptimizationResults(results: AppliedFixes): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const resultsPath = path.join(
      process.cwd(),
      'seo',
      'audit',
      `optimization-results-${timestamp}.json`
    );

    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf-8');

    // Also save a readable summary
    const summaryPath = path.join(
      process.cwd(),
      'seo',
      'audit',
      `optimization-summary-${timestamp}.txt`
    );
    const summary = this.generateOptimizationSummary(results);
    fs.writeFileSync(summaryPath, summary, 'utf-8');

    // eslint-disable-next-line no-console
    console.log(`Optimization results saved to ${resultsPath}`);
    // eslint-disable-next-line no-console
    console.log(`Summary saved to ${summaryPath}`);
  }

  private generateOptimizationSummary(results: AppliedFixes): string {
    let summary = `=== SEO OPTIMIZATION RESULTS ===\n`;
    summary += `Mode: ${this.dryRun ? 'DRY RUN' : 'LIVE CHANGES'}\n`;
    summary += `Timestamp: ${results.timestamp}\n\n`;

    summary += `📊 SUMMARY:\n`;
    summary += `- Total Fixes Attempted: ${results.totalFixes}\n`;
    summary += `- Successful: ${results.successful}\n`;
    summary += `- Failed: ${results.failed}\n\n`;

    summary += `✅ SUCCESSFUL OPTIMIZATIONS:\n`;
    results.results
      .filter(r => r.success)
      .forEach((result, index) => {
        summary += `${index + 1}. ${result.action} (${result.type})\n`;
        summary += `   File: ${result.file}\n`;
        if (result.oldValue && result.newValue) {
          summary += `   Changed: "${result.oldValue}" → "${result.newValue}"\n`;
        } else if (result.newValue) {
          summary += `   Added: ${result.newValue}\n`;
        }
        summary += '\n';
      });

    if (results.failed > 0) {
      summary += `❌ FAILED OPTIMIZATIONS:\n`;
      results.results
        .filter(r => !r.success)
        .forEach((result, index) => {
          summary += `${index + 1}. ${result.action} (${result.type})\n`;
          summary += `   File: ${result.file}\n`;
          summary += `   Error: ${result.error}\n\n`;
        });
    }

    if (this.dryRun) {
      summary += `⚠️  DRY RUN MODE: No files were actually modified.\n`;
      summary += `To apply these changes, run with --live flag.\n`;
    } else {
      summary += `📝 ROLLBACK DATA: Saved to rollbackData section of JSON file.\n`;
      summary += `To rollback changes, restore files from backup data.\n`;
    }

    return summary;
  }
}

// Export for use in other scripts
export { SEOOptimizer, type OptimizationResult, type AppliedFixes };

// CLI usage
if (require.main === module) {
  async function main() {
    const args = process.argv.slice(2);
    const isLive = args.includes('--live');
    const comparisonFile =
      args.find(arg => arg.endsWith('.json')) || 'seo-comparison-2025-01-11.json';

    const optimizer = new SEOOptimizer(!isLive); // Dry run by default

    try {
      // eslint-disable-next-line no-console
      console.log(`Starting SEO optimization (${isLive ? 'LIVE' : 'DRY RUN'})...`);

      const results = await optimizer.applyFixes(comparisonFile);

      // Print summary
      // eslint-disable-next-line no-console
      console.log('\n=== OPTIMIZATION COMPLETE ===');
      // eslint-disable-next-line no-console
      console.log(`Total fixes: ${results.totalFixes}`);
      // eslint-disable-next-line no-console
      console.log(`Successful: ${results.successful}`);
      // eslint-disable-next-line no-console
      console.log(`Failed: ${results.failed}`);

      if (!isLive) {
        // eslint-disable-next-line no-console
        console.log('\n⚠️  DRY RUN: No files were modified.');
        // eslint-disable-next-line no-console
        console.log('To apply changes, run: ts-node seo/audit/apply-fixes.ts --live');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SEO optimization failed:', error);
      process.exit(1);
    }
  }

  main();
}
