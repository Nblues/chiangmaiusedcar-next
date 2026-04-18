const fs = require('fs');

// 1. Read HomeWhyChooseSection.jsx
let whyChoosePath = 'components/HomeWhyChooseSection.jsx';
let whyChooseContent = fs.readFileSync(whyChoosePath, 'utf8');

const startIdx = whyChooseContent.indexOf('{/* Features Grid */}');
const endIdx = whyChooseContent.indexOf('{/* Car Brands Section - Modern Compact 2026 Design */}');

if (startIdx === -1 || Math.abs(endIdx) < 100) {
    console.error('Could not find the grid boundaries!');
    process.exit(1);
}

// Extract the grid code
let featuresGridCode = whyChooseContent.substring(startIdx, endIdx);

// Remove from HomeWhyChooseSection.jsx
let newWhyChooseContent = whyChooseContent.slice(0, startIdx) + whyChooseContent.slice(endIdx);
fs.writeFileSync(whyChoosePath, newWhyChooseContent, 'utf8');

// 2. Read HomeFaqSection.jsx
let faqPath = 'components/HomeFaqSection.jsx';
let faqContent = fs.readFileSync(faqPath, 'utf8');

// Fix: Add necessary imports if missing
if (!faqContent.includes('A11yImage')) {
    faqContent = "import A11yImage from './A11yImage';\n" + faqContent;
}

// Ensure proper SEO semantics by adding a section wrapper and title
const seoOptimizedGrid = `
    {/* SEO Optimized Trust Features Section */}
    <section className="mb-12" aria-labelledby="trust-features-heading">
      <h2 id="trust-features-heading" className="sr-only">จุดเด่นบริการและมาตรฐานรถยนต์มือสองครูหนึ่งรถสวย</h2>
      ${featuresGridCode}
    </section>
`;

// Wrap HomeFaqSection in a Fragment if we are putting a section before it.
if (!faqContent.includes('Fragment')) {
    faqContent = "import { Fragment } from 'react';\n" + faqContent;
}

let returnStatement = 'return (\n    <section';
const sectionIdx = faqContent.indexOf('return (\n    <section');

if (sectionIdx !== -1) {
    // Break the file at `<section`
    const insertPoint = faqContent.indexOf('<section', sectionIdx);
    
    // Add Fragment wrapping
    const prefix = faqContent.substring(0, insertPoint);
    const body = faqContent.substring(insertPoint);
    
    // Replace the final `);` with `</Fragment>);`
    // We can do this cleanly by replacing the end wrapper of HomeFaqSection.
    // Replace `  );\n}` with `    </Fragment>\n  );\n}`
    
    let editedBody = body.replace(/  \);\n}$/, '    </Fragment>\n  );\n}');
    
    faqContent = prefix + '<Fragment>\n' + seoOptimizedGrid + editedBody;
} else {
    // Fallback if formatting differs
    let fallbackIdx = faqContent.indexOf('return (');
    let fallbackInsert = faqContent.indexOf('<section', fallbackIdx);
    const prefix = faqContent.substring(0, fallbackInsert);
    const body = faqContent.substring(fallbackInsert);
    
    let editedBody = body.replace(/  \);\n}$/, '    </Fragment>\n  );\n}');
    faqContent = prefix + '<Fragment>\n' + seoOptimizedGrid + editedBody;
}

fs.writeFileSync(faqPath, faqContent, 'utf8');
console.log('Successfully moved and optimized Features Grid to HomeFaqSection.jsx');
