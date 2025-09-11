const { SimpleSEOComparer } = require('./simple-compare');

// Main orchestrator script for complete SEO audit (simplified version)
async function runSimpleAudit(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🚀 Starting SEO competitive audit (simplified version)...\n');

  try {
    // Step 1: Run comparison analysis
    // eslint-disable-next-line no-console
    console.log('1️⃣ Analyzing competitors with mock data...');

    const comparer = new SimpleSEOComparer();
    const comparison = await comparer.compareWithCompetitors();

    // eslint-disable-next-line no-console
    console.log(`   ✅ Analyzed ${comparison.summary.totalCompetitors} competitors`);
    // eslint-disable-next-line no-console
    console.log(
      `   📊 ${comparison.summary.strongerCompetitors} stronger, ${comparison.summary.weakerCompetitors} weaker`
    );

    // Step 2: Generate comprehensive report
    // eslint-disable-next-line no-console
    console.log('\n2️⃣ Generating comprehensive report...');

    // Save results
    const timestamp = new Date().toISOString().split('T')[0];
    SimpleSEOComparer.saveComparison(comparison, `seo-comparison-${timestamp}.json`);

    // Step 3: Print executive summary
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
      comparison.summary.quickWins.forEach((win: string, index: number) => {
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
      comparison.summary.keyIssues.forEach((issue: string, index: number) => {
        // eslint-disable-next-line no-console
        console.log(`   ${index + 1}. ${issue}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('   • No critical issues found');
    }

    // eslint-disable-next-line no-console
    console.log(`\n🔧 TOP RECOMMENDATIONS:`);
    const allRecommendations = [
      ...comparison.recommendations.titleImprovements.map((r: string) => `Title: ${r}`),
      ...comparison.recommendations.keywordOpportunities
        .slice(0, 2)
        .map((r: string) => `Keyword: ${r}`),
      ...comparison.recommendations.technicalFixes
        .slice(0, 2)
        .map((r: string) => `Technical: ${r}`),
    ];

    allRecommendations.slice(0, 5).forEach((rec, index) => {
      // eslint-disable-next-line no-console
      console.log(`   ${index + 1}. ${rec}`);
    });

    // eslint-disable-next-line no-console
    console.log(`\n📊 COMPETITOR ANALYSIS:`);
    comparison.competitors
      .sort((a: any, b: any) => b.overallScore - a.overallScore)
      .forEach((comp: any, index: number) => {
        // eslint-disable-next-line no-console
        console.log(`   ${index + 1}. ${comp.competitor}: ${comp.overallScore}/100 points`);
        if (comp.strengths.length > 0) {
          // eslint-disable-next-line no-console
          console.log(`      💪 Strengths: ${comp.strengths.slice(0, 2).join(', ')}`);
        }
        if (comp.weaknesses.length > 0) {
          // eslint-disable-next-line no-console
          console.log(`      ⚠️  Weaknesses: ${comp.technicalIssues.slice(0, 2).join(', ')}`);
        }
      });

    // eslint-disable-next-line no-console
    console.log(`\n💡 NEXT STEPS:`);
    // eslint-disable-next-line no-console
    console.log(`   1. Review detailed reports in seo/audit/`);
    // eslint-disable-next-line no-console
    console.log(`   2. Implement top recommendations manually`);
    // eslint-disable-next-line no-console
    console.log(`   3. Monitor changes with: npm run seo:verify`);
    // eslint-disable-next-line no-console
    console.log(`   4. Re-run audit monthly to track improvements`);

    // eslint-disable-next-line no-console
    console.log('\n✅ SEO Audit complete! Check seo/audit/ for detailed reports.');

    // eslint-disable-next-line no-console
    console.log('\n🎯 KEY FINDINGS SUMMARY:');
    // eslint-disable-next-line no-console
    console.log(`   • Our site title: "${comparison.ourSite.currentTitle}"`);
    // eslint-disable-next-line no-console
    console.log(
      `   • Title length: ${comparison.ourSite.currentTitle.length} chars (optimal: 30-60)`
    );
    // eslint-disable-next-line no-console
    console.log(
      `   • Description length: ${comparison.ourSite.currentDescription.length} chars (optimal: 120-160)`
    );
    // eslint-disable-next-line no-console
    console.log(`   • Keywords we're targeting: ${comparison.ourSite.currentKeywords.join(', ')}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Export for use in other scripts
export { runSimpleAudit };

// CLI usage
if (require.main === module) {
  runSimpleAudit();
}
