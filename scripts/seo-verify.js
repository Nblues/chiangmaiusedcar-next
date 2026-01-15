#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * SEO Verification Script 2025
 * ตรวจสอบความถูกต้องของ SEO สำหรับการจัดทำดัชนี Google
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://www.chiangmaiusedcar.com';
const OUTPUT_DIR = path.join(process.cwd(), 'logs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'seo-verify.txt');

class SEOVerifier {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  findFiles(dir, regex) {
    let results = [];
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          results = results.concat(this.findFiles(filePath, regex));
        } else if (regex.test(file)) {
          results.push(filePath);
        }
      });
    } catch {
      // Directory doesn't exist or permission denied
    }
    return results;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;

    console.log(logEntry);
    this.results.push(logEntry);

    switch (type) {
      case 'error':
        this.errors.push(message);
        break;
      case 'warning':
        this.warnings.push(message);
        break;
      case 'success':
        this.passed.push(message);
        break;
    }
  }

  async checkRobotsTxt() {
    this.log('🤖 Checking robots.txt...', 'info');

    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');

    if (!fs.existsSync(robotsPath)) {
      this.log('robots.txt not found', 'error');
      return;
    }

    const content = fs.readFileSync(robotsPath, 'utf8');

    // Check for Allow directives (only required if robots.txt blocks those paths)
    const disallowNextLines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^Disallow:\s*\/_next/i.test(line));
    const blocksNextAssets = disallowNextLines.some(
      line => !/^Disallow:\s*\/_next\/data\b/i.test(line)
    );
    const blocksStaticAssetsByExt = /\bDisallow:\s*\*\.(js|css|webp)\b/i.test(content);

    if (blocksNextAssets || blocksStaticAssetsByExt) {
      const requiredAllows = ['/_next/static/', '/_next/image/', '*.js', '*.css', '*.webp'];
      requiredAllows.forEach(allow => {
        if (content.includes(`Allow: ${allow}`)) {
          this.log(`✅ robots.txt allows ${allow}`, 'success');
        } else {
          this.log(`❌ robots.txt missing Allow: ${allow}`, 'error');
        }
      });
    } else {
      this.log(
        '✅ robots.txt does not block static/Next.js assets (explicit Allow directives not required)',
        'success'
      );
    }

    // Check for blocking _next/data
    if (content.includes('Disallow: /_next/data/') || content.includes('Disallow: /_next/data/*')) {
      this.log('✅ robots.txt correctly blocks /_next/data/', 'success');
    } else {
      this.log('⚠️ robots.txt should block /_next/data/', 'warning');
    }

    // Check sitemap URLs consistency
    const sitemapLines = content.split('\n').filter(line => line.startsWith('Sitemap:'));
    let hasInconsistentUrls = false;

    sitemapLines.forEach(line => {
      if (line.includes('chiangmaiusedcar.com') && !line.includes('www.chiangmaiusedcar.com')) {
        this.log(`❌ Inconsistent sitemap URL: ${line}`, 'error');
        hasInconsistentUrls = true;
      }
    });

    if (!hasInconsistentUrls && sitemapLines.length > 0) {
      this.log('✅ All sitemap URLs use consistent www subdomain', 'success');
    }
  }

  async checkSitemaps() {
    this.log('🗺️ Checking sitemaps...', 'info');

    // sitemap-cars.xml was deprecated to avoid duplicate/conflicting sitemap signals.
    // Car URLs are included in next-sitemap output (e.g. sitemap-0.xml).
    const sitemapFiles = ['sitemap.xml', 'sitemap-0.xml', 'sitemap-images.xml'];

    sitemapFiles.forEach(filename => {
      const sitemapPath = path.join(process.cwd(), 'public', filename);

      if (!fs.existsSync(sitemapPath)) {
        this.log(`❌ ${filename} not found`, 'error');
        return;
      }

      const content = fs.readFileSync(sitemapPath, 'utf8');

      const locUrls = Array.from(content.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);

      // Check for consistent URLs
      let inconsistentUrls = 0;

      locUrls.forEach(url => {
        if (url.includes('chiangmaiusedcar.com') && !url.includes('www.chiangmaiusedcar.com')) {
          inconsistentUrls++;
        }
      });

      if (inconsistentUrls > 0) {
        this.log(`❌ ${filename} has ${inconsistentUrls} URLs without www subdomain`, 'error');
      } else {
        this.log(`✅ ${filename} URLs are consistent`, 'success');
      }

      // Check for 404 URLs (basic check for known bad URLs) based on parsed pathname,
      // to avoid false positives from substring matches (e.g. /test-social-images).
      const badPaths = new Set([
        '/payment-calculator-new',
        '/payment-calculator-old',
        '/test',
        '/draft',
      ]);

      locUrls.forEach(loc => {
        try {
          const u = new URL(loc);
          if (badPaths.has(u.pathname)) {
            this.log(`❌ ${filename} contains potential 404 URL: ${u.pathname}`, 'error');
          }
        } catch {
          // Ignore invalid/relative <loc> values
        }
      });
    });
  }

  async checkCanonicalUrls() {
    this.log('🔗 Checking canonical URLs in pages...', 'info');

    const pageFiles = this.findFiles(path.join(process.cwd(), 'pages'), /\.jsx?$/);
    const filteredFiles = pageFiles.filter(
      file => !file.includes('_app') && !file.includes('_document') && !file.includes('api/')
    );

    for (const file of filteredFiles) {
      const content = fs.readFileSync(file, 'utf8');

      // Check for canonical link
      if (content.includes('rel="canonical"') || content.includes("rel='canonical'")) {
        // Check if using consistent domain
        if (
          content.includes('chiangmaiusedcar.com') &&
          !content.includes('www.chiangmaiusedcar.com')
        ) {
          this.log(`⚠️ ${file} may have inconsistent canonical URL`, 'warning');
        } else {
          this.log(`✅ ${file} has canonical URL`, 'success');
        }
      } else {
        // Check if page uses SEO component
        if (content.includes('<SEO ') || content.includes('SEO')) {
          this.log(`✅ ${file} uses SEO component (canonical handled)`, 'success');
        } else {
          this.log(`⚠️ ${file} may be missing canonical URL`, 'warning');
        }
      }
    }
  }

  async checkImageAltTags() {
    this.log('🖼️ Checking image alt tags...', 'info');

    const pagesFiles = this.findFiles(path.join(process.cwd(), 'pages'), /\.jsx?$/);
    const componentFiles = this.findFiles(path.join(process.cwd(), 'components'), /\.jsx?$/);
    const allFiles = [...pagesFiles, ...componentFiles];

    let totalImages = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;

    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf8');

      // Find actual <img or <Image tags (not <ImageGallery, <ImageOptions, etc.)
      // Match: <img or <Image followed by space/newline/tab
      const imgRegex = /<(img|Image)[\s\n\t]/g;
      let match;

      while ((match = imgRegex.exec(content)) !== null) {
        const startIndex = match.index;
        const tagName = match[1];
        let depth = 1;
        let i = startIndex + match[0].length;
        let tagContent = match[0];

        // Scan forward to find the closing of this tag
        while (i < content.length && depth > 0) {
          if (content[i] === '<' && content.substring(i, i + 2) === '</') {
            const closeTag = content.substring(i, i + tagName.length + 3);
            if (closeTag === `</${tagName}>`) {
              tagContent += content.substring(match.index + tagContent.length, i + closeTag.length);
              depth = 0;
            }
          } else if (content[i] === '/' && content[i + 1] === '>') {
            tagContent += content.substring(match.index + tagContent.length, i + 2);
            depth = 0;
          }
          i++;
        }

        totalImages++;

        if (tagContent.includes('alt=')) {
          imagesWithAlt++;
        } else {
          imagesWithoutAlt++;
          this.log(
            `⚠️ ${file} has ${tagName} without alt: ${tagContent.substring(0, 100).replace(/\n/g, ' ')}...`,
            'warning'
          );
        }
      }
    }

    this.log(
      `📊 Image Analysis: ${totalImages} total, ${imagesWithAlt} with alt, ${imagesWithoutAlt} without alt`,
      'info'
    );

    if (imagesWithoutAlt === 0) {
      this.log('✅ All images have alt attributes', 'success');
    } else {
      this.log(`❌ ${imagesWithoutAlt} images missing alt attributes`, 'error');
    }
  }

  async checkMetaTags() {
    this.log('📝 Checking meta tags...', 'info');

    const pageFiles = this.findFiles(path.join(process.cwd(), 'pages'), /\.jsx?$/);
    const filteredFiles = pageFiles.filter(
      file => !file.includes('_app') && !file.includes('_document') && !file.includes('api/')
    );

    const intentionallyNoindexPatterns = [
      `${path.sep}pages${path.sep}admin${path.sep}`,
      `${path.sep}pages${path.sep}api-dashboard.jsx`,
      `${path.sep}pages${path.sep}keyword-audit.jsx`,
      `${path.sep}pages${path.sep}license.jsx`,
      `${path.sep}pages${path.sep}test-social-images.jsx`,
      `${path.sep}pages${path.sep}_error.jsx`,
    ];

    for (const file of filteredFiles) {
      const content = fs.readFileSync(file, 'utf8');

      // Check for noindex/nofollow in production
      if (content.includes('noindex') || content.includes('nofollow')) {
        const isIntentional = intentionallyNoindexPatterns.some(p => file.includes(p));
        if (isIntentional) {
          this.log(`✅ ${file} is intentionally noindex/nofollow`, 'success');
        } else if (!content.includes('development') && !content.includes('NODE_ENV')) {
          this.log(`❌ ${file} may have noindex/nofollow in production`, 'error');
        }
      }

      // Check for SEO component usage
      if (content.includes('<SEO ') || content.includes('import SEO')) {
        this.log(`✅ ${file} uses SEO component`, 'success');
      } else if (!file.includes('_app') && !file.includes('_document')) {
        this.log(`⚠️ ${file} may be missing SEO component`, 'warning');
      }
    }
  }

  async checkNextConfig() {
    this.log('⚙️ Checking next.config.js...', 'info');

    const configPath = path.join(process.cwd(), 'next.config.js');

    if (!fs.existsSync(configPath)) {
      this.log('next.config.js not found', 'error');
      return;
    }

    const content = fs.readFileSync(configPath, 'utf8');

    // Check for redirects
    if (content.includes('redirects()')) {
      this.log('✅ next.config.js has redirects configuration', 'success');
    } else {
      this.log('⚠️ next.config.js missing redirects for www enforcement', 'warning');
    }

    // Check for headers
    if (content.includes('headers()')) {
      this.log('✅ next.config.js has headers configuration', 'success');
    } else {
      this.log('⚠️ next.config.js missing headers configuration', 'warning');
    }
  }

  async generateReport() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const report = [
      '# SEO Verification Report',
      `Generated: ${new Date().toISOString()}`,
      `Site: ${SITE_URL}`,
      '',
      '## Summary',
      `✅ Passed: ${this.passed.length}`,
      `⚠️ Warnings: ${this.warnings.length}`,
      `❌ Errors: ${this.errors.length}`,
      '',
      '## Detailed Results',
      ...this.results,
      '',
      '## Recommendations',
      '',
    ];

    if (this.errors.length > 0) {
      report.push('### Critical Issues (Fix Required):');
      this.errors.forEach(error => {
        report.push(`- ${error}`);
      });
      report.push('');
    }

    if (this.warnings.length > 0) {
      report.push('### Warnings (Recommended Fixes):');
      this.warnings.forEach(warning => {
        report.push(`- ${warning}`);
      });
      report.push('');
    }

    report.push('### SEO Best Practices:');
    report.push('- Ensure all URLs use https://www.chiangmaiusedcar.com');
    report.push('- All images should have descriptive alt attributes');
    report.push('- Remove any noindex/nofollow from production pages');
    report.push('- Keep meta titles under 60 characters');
    report.push('- Keep meta descriptions under 160 characters');
    report.push('- Use structured data for better search results');

    fs.writeFileSync(OUTPUT_FILE, report.join('\n'), 'utf8');

    this.log(`📄 Report saved to: ${OUTPUT_FILE}`, 'info');

    // Console summary
    console.log('\n' + '='.repeat(50));
    console.log('SEO VERIFICATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.passed.length}`);
    console.log(`⚠️ Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`📄 Full report: ${OUTPUT_FILE}`);
    console.log('='.repeat(50));

    return this.errors.length === 0;
  }

  async run() {
    this.log('🚀 Starting SEO verification...', 'info');

    await this.checkRobotsTxt();
    await this.checkSitemaps();
    await this.checkCanonicalUrls();
    await this.checkImageAltTags();
    await this.checkMetaTags();
    await this.checkNextConfig();

    const success = await this.generateReport();

    if (success) {
      this.log('🎉 SEO verification completed successfully!', 'success');
      process.exit(0);
    } else {
      this.log('💥 SEO verification found critical issues', 'error');
      process.exit(1);
    }
  }
}

// Run verification
if (require.main === module) {
  const verifier = new SEOVerifier();
  verifier.run().catch(error => {
    console.error('Failed to run SEO verification:', error);
    process.exit(1);
  });
}

module.exports = SEOVerifier;
