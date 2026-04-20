const fs = require('fs');
const files = fs.readdirSync(__dirname);
const reportFile = files.find(f => f.endsWith('report.html') && f.includes('chiangmaiusedcar.com'));

if (reportFile) {
    const html = fs.readFileSync(reportFile, 'utf8');
    const lcpMatch = html.match(/"id":"largest-contentful-paint"[\s\S]*?"displayValue":"([^"\\]+)"/);
    const siMatch = html.match(/"id":"speed-index"[\s\S]*?"displayValue":"([^"]+)"/);
    
    console.log(`LCP (Mobile): ${lcpMatch ? lcpMatch[1] : 'N/A'}`);
    console.log(`Speed Index (Mobile): ${siMatch ? siMatch[1] : 'N/A'}`);
} else {
    console.log("No report file found");
}