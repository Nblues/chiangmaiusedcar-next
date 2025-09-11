const fs = require('fs');
const path = require('path');

// Mock competitor data
const mockCompetitorData = [
  {
    name: 'AK Car Center',
    url: 'https://www.akcarscenter.com',
    title: 'AK Car Center - รถมือสองเชียงใหม่ ราคาดี คุณภาพดี',
    description:
      'รถมือสองเชียงใหม่ AK Car Center ราคาดี คุณภาพดี มีรับประกัน ส่งฟรีทั่วไทย โทร 053-123456',
    h1: 'AK Car Center - รถมือสองเชียงใหม่',
    keywords: ['รถมือสองเชียงใหม่', 'AK Car Center', 'รถบ้าน', 'รับประกัน'],
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
    loadTime: 2400,
    timestamp: new Date().toISOString(),
  },
  {
    name: 'Ennxo Chiang Mai',
    url: 'https://www.ennxo.com/chiangmai',
    title: 'Ennxo เชียงใหม่ - แพลตฟอร์มรถยนต์ออนไลน์ ซื้อขายง่าย',
    description: 'รถมือสองเชียงใหม่ Ennxo แพลตฟอร์มออนไลน์ ซื้อขายรถง่าย ราคาโปร่งใส เช็คประวัติรถ',
    h1: 'Ennxo เชียงใหม่ - แพลตฟอร์มรถยนต์ออนไลน์',
    keywords: ['รถมือสองเชียงใหม่', 'Ennxo', 'แพลตฟอร์มออนไลน์', 'เช็คประวัติรถ'],
    loadTime: 2600,
    timestamp: new Date().toISOString(),
  },
];

// Our site data
const ourSiteData = {
  name: 'ครูหนึ่งรถสวย',
  url: 'https://www.chiangmaiusedcar.com',
  title: 'รถมือสองเชียงใหม่ คุณภาพดี ตรวจสภาพครบถ้วน | ครูหนึ่งรถสวย',
  description:
    'รถมือสองเชียงใหม่คุณภาพดี ครูหนึ่งรถสวย ตรวจสภาพครบถ้วน ฟรีดาวน์ ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย เช็คประวัติรถ โทร 094-064-9018',
  h1: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
  keywords: [
    'รถมือสองเชียงใหม่',
    'ครูหนึ่งรถสวย',
    'ตรวจสภาพครบถ้วน',
    'เช็คประวัติรถ',
    'ฟรีดาวน์',
    'ดอกเบี้ยต่ำ',
  ],
  loadTime: 1800,
  timestamp: new Date().toISOString(),
};

// Primary keywords for analysis
const primaryKeywords = ['รถมือสองเชียงใหม่', 'ครูหนึ่งรถสวย', 'รถบ้านเชียงใหม่', 'รถมือสองคุณภาพ'];

function analyzeCompetitor(competitor, ourSite) {
  const analysis = {
    competitor: competitor.name,
    url: competitor.url,
    strengths: [],
    weaknesses: [],
    keywordGaps: [],
    technicalIssues: [],
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
    const hasMainKeyword = primaryKeywords.some(keyword =>
      competitor.title.toLowerCase().includes(keyword.toLowerCase())
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

  // Calculate overall score
  let score = 50; // Base score

  // Add points for strengths
  score += analysis.strengths.length * 10;

  // Subtract points for issues
  score -= analysis.technicalIssues.length * 15;
  score -= analysis.keywordGaps.length * 10;

  // Bonus for load time
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

async function runSEOAudit() {
  console.log('🚀 Starting SEO competitive audit...\n');

  try {
    // Step 1: Analyze competitors
    console.log('1️⃣ Analyzing competitors...');

    const competitorAnalyses = mockCompetitorData.map(comp => analyzeCompetitor(comp, ourSiteData));

    console.log(`   ✅ Analyzed ${competitorAnalyses.length} competitors`);

    // Step 2: Calculate summary
    const strongerCompetitors = competitorAnalyses.filter(comp => comp.overallScore > 70).length;
    const weakerCompetitors = competitorAnalyses.filter(comp => comp.overallScore < 50).length;

    console.log(`   📊 ${strongerCompetitors} stronger, ${weakerCompetitors} weaker`);

    // Step 3: Generate quick wins
    const quickWins = [];

    // Check our title length
    const titleLength = ourSiteData.title.length;
    if (titleLength < 30 || titleLength > 60) {
      quickWins.push('Optimize title length (30-60 chars)');
    }

    // Check our description length
    const descLength = ourSiteData.description.length;
    if (descLength < 120 || descLength > 160) {
      quickWins.push('Optimize meta description length (120-160 chars)');
    }

    // Check for keyword opportunities
    const allKeywordGaps = competitorAnalyses.flatMap(a => a.keywordGaps);
    if (allKeywordGaps.length > 0) {
      quickWins.push('Add competitor keywords to our content');
    }

    // Step 4: Save results
    console.log('\n2️⃣ Generating comprehensive report...');

    const auditPath = path.join(process.cwd(), 'seo', 'audit');
    if (!fs.existsSync(auditPath)) {
      fs.mkdirSync(auditPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const results = {
      timestamp: new Date().toISOString(),
      ourSite: ourSiteData,
      competitors: competitorAnalyses,
      summary: {
        totalCompetitors: competitorAnalyses.length,
        strongerCompetitors,
        weakerCompetitors,
        quickWins,
      },
    };

    fs.writeFileSync(
      path.join(auditPath, `seo-audit-${timestamp}.json`),
      JSON.stringify(results, null, 2),
      'utf-8'
    );

    // Step 5: Print executive summary
    console.log('\n📋 EXECUTIVE SUMMARY');
    console.log('='.repeat(50));

    console.log(`🎯 COMPETITIVE POSITION:`);
    console.log(`   • Total competitors analyzed: ${competitorAnalyses.length}`);
    console.log(`   • Competitors outperforming us: ${strongerCompetitors}`);
    console.log(`   • Competitors we outperform: ${weakerCompetitors}`);

    console.log(`\n⚡ QUICK WINS IDENTIFIED:`);
    if (quickWins.length > 0) {
      quickWins.forEach((win, index) => {
        console.log(`   ${index + 1}. ${win}`);
      });
    } else {
      console.log('   • No quick wins identified - strong current position');
    }

    console.log(`\n📊 COMPETITOR ANALYSIS:`);
    competitorAnalyses
      .sort((a, b) => b.overallScore - a.overallScore)
      .forEach((comp, index) => {
        console.log(`   ${index + 1}. ${comp.competitor}: ${comp.overallScore}/100 points`);
        if (comp.strengths.length > 0) {
          console.log(`      💪 Strengths: ${comp.strengths.slice(0, 2).join(', ')}`);
        }
        if (comp.technicalIssues.length > 0) {
          console.log(`      ⚠️  Issues: ${comp.technicalIssues.slice(0, 2).join(', ')}`);
        }
      });

    console.log(`\n🎯 OUR SITE ANALYSIS:`);
    console.log(`   • Title: "${ourSiteData.title}"`);
    console.log(`   • Title length: ${ourSiteData.title.length} chars (optimal: 30-60)`);
    console.log(
      `   • Description length: ${ourSiteData.description.length} chars (optimal: 120-160)`
    );
    console.log(`   • Keywords: ${ourSiteData.keywords.join(', ')}`);
    console.log(
      `   • Load time: ${ourSiteData.loadTime}ms (competitors avg: ${Math.round(mockCompetitorData.reduce((sum, comp) => sum + comp.loadTime, 0) / mockCompetitorData.length)}ms)`
    );

    console.log(`\n💡 NEXT STEPS:`);
    console.log(`   1. Review detailed report: seo/audit/seo-audit-${timestamp}.json`);
    console.log(`   2. Implement quick wins above`);
    console.log(`   3. Monitor with: npm run seo:verify`);
    console.log(`   4. Re-run monthly to track improvements`);

    console.log('\n✅ SEO Audit complete!');
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run the audit
if (require.main === module) {
  runSEOAudit();
}

module.exports = { runSEOAudit };
