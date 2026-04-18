const fs = require('fs');

let whyChoosePath = 'components/HomeWhyChooseSection.jsx';
let faqPath = 'components/HomeFaqSection.jsx';

let whyChooseContent = fs.readFileSync(whyChoosePath, 'utf8');
let faqContent = fs.readFileSync(faqPath, 'utf8');

// 1. Extract Service Links
const serviceLinksMarker = '{/* Service Links - Ultra Modern 2025 Neomorphic Glass Design */}';
const startIdx = whyChooseContent.indexOf(serviceLinksMarker);

if (startIdx === -1) {
    console.error('Could not find Service Links in HomeWhyChooseSection');
    process.exit(1);
}

// Find where it ends. It's the last child of `div.px-6.md:px-10` before `</section>`.
// Looking at the end of HomeWhyChooseSection:
/*
          </div>
        </div>
    </section>
*/
const lastDivIdx = whyChooseContent.lastIndexOf('</div>\n    </section>');
// No, the end is: 
//         </div>
//       </div>
//   </section>
// Let's just find the `    </section>` at the very end
const endIdx = whyChooseContent.lastIndexOf('</div>\n    </section>');
let actualEndIdx = whyChooseContent.lastIndexOf('    </section>');

if (actualEndIdx === -1) {
    console.error("Could not find </section> end mark.");
    process.exit(1);
}

// The outer wrapper is `<div className="px-6 md:px-10">`, and its closing `</div>` is right before `</section>`.
// Let's extract the block.
let serviceLinksCode = whyChooseContent.substring(startIdx, actualEndIdx);
// serviceLinksCode includes the closing `</div>` of the `.px-6` wrapper. We just need to take the Service Links part.
let justServiceLinks = whyChooseContent.substring(startIdx, whyChooseContent.lastIndexOf('</div>', actualEndIdx - 1));

// Replace the extracted code with just `</div>\n` which closes `.px-6`
let newWhyChooseContent = whyChooseContent.substring(0, startIdx) + '      </div>\n' + whyChooseContent.substring(actualEndIdx);
fs.writeFileSync(whyChoosePath, newWhyChooseContent, 'utf8');

// 2. Add to HomeFaqSection.jsx
// Need to add Link import if it doesn't exist
if (!faqContent.includes("import Link from 'next/link';")) {
    faqContent = "import Link from 'next/link';\n" + faqContent;
}

// Ensure SEO structure for Service links.
// Let's wrap Service Links in a section:
const seoOptimizedServiceLinks = `
    {/* Quick Service Links Section */}
    <section className="my-8 md:my-12 px-4 sm:px-6" aria-label="ช่องทางลัดบริการ">
      <h2 className="sr-only">ช่องทางลัดตรวจสอบเครดิตและออกรถ</h2>
      ${justServiceLinks}
    </section>
`;

// Inject into HomeFaqSection.jsx. We should put it at the very bottom, just before `</Fragment>`.
const fragmentCloseIdx = faqContent.lastIndexOf('</Fragment>');
if (fragmentCloseIdx !== -1) {
    faqContent = faqContent.substring(0, fragmentCloseIdx) + seoOptimizedServiceLinks + faqContent.substring(fragmentCloseIdx);
}

fs.writeFileSync(faqPath, faqContent, 'utf8');
console.log('Successfully moved Service Links to HomeFaqSection.jsx');
