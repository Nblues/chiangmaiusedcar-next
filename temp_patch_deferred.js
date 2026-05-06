const fs = require('fs');

const deferredPath = 'components/UsedCarsChiangMaiDeferred.jsx';
let code = fs.readFileSync(deferredPath, 'utf8');

// Change component signature to accept hideFaq
code = code.replace(
  'export default function UsedCarsChiangMaiDeferred() {',
  'export default function UsedCarsChiangMaiDeferred({ hideFaq = false }) {'
);

const faqIdIndex = code.indexOf('id="faq"');
const sectionStart = code.lastIndexOf('<section', faqIdIndex);
const sectionEnd = code.indexOf('</section>', faqIdIndex) + 10;

const beforeFaq = code.substring(0, sectionStart);
const faqPortion = code.substring(sectionStart, sectionEnd);
const afterFaq = code.substring(sectionEnd);

const newCode = beforeFaq + '{!hideFaq && (\n        ' + faqPortion.split('\n').join('\n        ') + '\n      )}\n' + afterFaq;

fs.writeFileSync(deferredPath, newCode);
console.log('Modified UsedCarsChiangMaiDeferred to support hideFaq component properly');
