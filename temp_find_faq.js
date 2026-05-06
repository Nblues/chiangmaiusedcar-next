const fs = require('fs');
const code = fs.readFileSync('components/UsedCarsChiangMaiDeferred.jsx', 'utf8');
const idIndex = code.indexOf('id="faq"');
console.log("faq index", idIndex);
if (idIndex > -1) {
  const sectionStart = code.lastIndexOf('<section', idIndex);
  const nextSectionEnd = code.indexOf('</section>', idIndex) + 10;
  console.log(code.substring(sectionStart, sectionStart + 200));
}
