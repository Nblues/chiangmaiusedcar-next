import { SEOComparer } from './compare';
import { LighthouseAuditor } from './lighthouse-run';

// Main orchestrator script for complete SEO audit
async function runFullAudit(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🚀 Starting comprehensive SEO competitive audit...\n');

  try {
    // Step 1: Run comparison analysis
    // eslint-disable-next-line no-console
    console.log('1️⃣ Analyzing competitors...');

    const comparer = new SEOComparer();
    const comparison = await comparer.compareWithCompetitors();

    // eslint-disable-next-line no-console
    console.log(`   ✅ Analyzed ${comparison.summary.totalCompetitors} competitors`);
    // eslint-disable-next-line no-console
    console.log(
      `   📊 ${comparison.summary.strongerCompetitors} stronger, ${comparison.summary.weakerCompetitors} weaker`
    );

    // Step 2: Run Lighthouse performance audit
    // eslint-disable-next-line no-console
    console.log('\n2️⃣ Running Lighthouse performance audit...');

    const auditor = new LighthouseAuditor();
    const lighthouseComparison = await auditor.compareWithOurSite();

    // eslint-disable-next-line no-console
    console.log(`   📈 Our Performance: ${lighthouseComparison.ourSite.scores.performance}/100`);
    // eslint-disable-next-line no-console
    console.log(`   🔍 Our SEO Score: ${lighthouseComparison.ourSite.scores.seo}/100`);

    // Step 3: Generate comprehensive report
    // eslint-disable-next-line no-console
    console.log('\n3️⃣ Generating comprehensive report...');

    // Save results
    const timestamp = new Date().toISOString().split('T')[0];
    SEOComparer.saveComparison(comparison, `seo-comparison-${timestamp}.json`);
    LighthouseAuditor.saveResults(lighthouseComparison, `lighthouse-comparison-${timestamp}.json`);

    // Step 4: Print executive summary
    // eslint-disable-next-line no-console
    console.log('\n📋 EXECUTIVE SUMMARY');
    // eslint-disable-next-line no-console
    console.log('='.repeat(50));

    // eslint-disable-next-line no-console
    console.log(`🎯 COMPETITIVE POSITION:`);
    // eslint-disable-next-line no-console
    console.log(`   • Total competitors analyzed: ${comparison.summary.totalCompetitors}`);
    // eslint-disable-next-line no-console
    console.log(`   • Competitors outperforming us: ${comparison.summary.strongerCompetitors}`);
    // eslint-disable-next-line no-console
    console.log(`   • Competitors we outperform: ${comparison.summary.weakerCompetitors}`);

    // eslint-disable-next-line no-console
    console.log(`\n⚡ QUICK WINS IDENTIFIED:`);
    if (comparison.summary.quickWins.length > 0) {
      comparison.summary.quickWins.forEach((win, index) => {
        // eslint-disable-next-line no-console
        console.log(`   ${index + 1}. ${win}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('   • No quick wins identified - strong current position');
    }

    // eslint-disable-next-line no-console
    console.log(`\n🚨 KEY ISSUES TO ADDRESS:`);
    if (comparison.summary.keyIssues.length > 0) {
      comparison.summary.keyIssues.forEach((issue, index) => {
        // eslint-disable-next-line no-console
        console.log(`   ${index + 1}. ${issue}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('   • No critical issues found');
    }

    // eslint-disable-next-line no-console
    console.log(`\n🎲 PERFORMANCE BENCHMARKS:`);
    // eslint-disable-next-line no-console
    console.log(
      `   • Our Performance Score: ${lighthouseComparison.ourSite.scores.performance}/100`
    );
    // eslint-disable-next-line no-console
    console.log(`   • Our SEO Score: ${lighthouseComparison.ourSite.scores.seo}/100`);
    // eslint-disable-next-line no-console
    console.log(`   • Our Accessibility: ${lighthouseComparison.ourSite.scores.accessibility}/100`);

    // eslint-disable-next-line no-console
    console.log(`\n🔧 TOP RECOMMENDATIONS:`);
    const allRecommendations = [
      ...comparison.recommendations.titleImprovements.map(r => `Title: ${r}`),
      ...comparison.recommendations.keywordOpportunities.slice(0, 2).map(r => `Keyword: ${r}`),
      ...comparison.recommendations.technicalFixes.slice(0, 2).map(r => `Technical: ${r}`),
    ];

    allRecommendations.slice(0, 5).forEach((rec, index) => {
      // eslint-disable-next-line no-console
      console.log(`   ${index + 1}. ${rec}`);
    });

    // eslint-disable-next-line no-console
    console.log(`\n💡 NEXT STEPS:`);
    // eslint-disable-next-line no-console
    console.log(`   1. Review detailed reports in seo/audit/`);
    // eslint-disable-next-line no-console
    console.log(`   2. Run DRY optimization: npm run seo:optimize-dry`);
    // eslint-disable-next-line no-console
    console.log(`   3. Apply fixes: npm run seo:optimize-live`);
    // eslint-disable-next-line no-console
    console.log(`   4. Monitor changes with verification script`);

    // eslint-disable-next-line no-console
    console.log('\n✅ Audit complete! Check seo/audit/ for detailed reports.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Export for use in other scripts
export { runFullAudit };

// CLI usage
if (require.main === module) {
  runFullAudit();
}
