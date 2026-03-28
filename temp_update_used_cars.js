const fs = require('fs');

const path = 'C:/project davelopper/chiangmaiusedcar-setup/pages/used-cars-chiang-mai.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Move sections
// Let's grab the sections.
const extractSection = (content, idStr) => {
    const startIdx = content.indexOf(`<section id="${idStr}"`);
    if(startIdx === -1) return null;
    
    // find next section start or </main>
    const nextSectionIdx = content.indexOf(`<section`, startIdx + 10);
    const mainEndIdx = content.indexOf(`</main>`, startIdx);
    
    let endIdx;
    if(nextSectionIdx !== -1 && nextSectionIdx < mainEndIdx) {
        endIdx = nextSectionIdx;
    } else {
        endIdx = mainEndIdx;
    }
    return {
        text: content.substring(startIdx, endIdx),
        start: startIdx,
        end: endIdx
    };
};

const navStart = content.indexOf('<nav aria-label="Quick links"');
const navEnd = content.indexOf('</nav>', navStart) + 6;
let navText = content.substring(navStart, navEnd);

// Fix nav: make it scrollable instead of flex-wrap
navText = navText.replace('flex flex-wrap justify-center gap-2', 'flex overflow-x-auto whitespace-nowrap gap-2 pb-2 px-4 scrollbar-hide snap-x');
navText = navText.replace(/className="inline-block px-4 py-2/g, 'className="inline-block px-4 py-2 snap-center shrink-0');

content = content.substring(0, navStart) + navText + content.substring(navEnd);


const aboutSrc = extractSection(content, 'about');
const brandsSrc = extractSection(content, 'brands');
const featuredSrc = extractSection(content, 'featured-cars');
const consignSrc = extractSection(content, 'consign-conditions');
const faqSrc = extractSection(content, 'faq'); // if exists

// remove all extracted sections
let newContent = content;
if(aboutSrc) newContent = newContent.replace(aboutSrc.text, '');
if(brandsSrc) newContent = newContent.replace(brandsSrc.text, '');
if(featuredSrc) newContent = newContent.replace(featuredSrc.text, '');
if(consignSrc) newContent = newContent.replace(consignSrc.text, '');
if(faqSrc) newContent = newContent.replace(faqSrc.text, '');

// Order we want:
// 1. Featured Cars
// 2. Brands
// 3. Consign Conditions
// 4. About (SEO text, down at bottom)
// 5. FAQ (if it was there)

const mainEndIdx = newContent.indexOf('</main>');
const insertStr = 
  (featuredSrc ? featuredSrc.text : '') +
  (brandsSrc ? brandsSrc.text : '') +
  (consignSrc ? consignSrc.text : '') +
  (aboutSrc ? aboutSrc.text : '') +
  (faqSrc ? faqSrc.text : '');

newContent = newContent.substring(0, mainEndIdx) + insertStr + newContent.substring(mainEndIdx);

fs.writeFileSync(path, newContent);
console.log('Update complete');
