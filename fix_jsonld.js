const fs = require('fs');
let code = fs.readFileSync('lib/seo/jsonld.js', 'utf8');

// Fix buildEnhancedCarJsonLd
code = code.replace(/name,\s*\n\s*image: images,\s*\n\s*description,/g, 
  "name,\n      image: images,\n      description: description || \รถสวยสภาพดี \ เชียงใหม่\,\n");
code = code.replace(/name: brand,\s*\n\s*\},/g, 
  "name: brand || 'รถมือสองเชียงใหม่',\n      },");

// Fix buildCarJsonLd
code = code.replace(/description: offerData\.description,/g, 
  "description: offerData.description || \รถมือสองคัดเกรด \\,\n");
code = code.replace(/brand: offerData\.brand \? \{ '@type': 'Brand', name: offerData\.brand \} : undefined,/g, 
  "brand: { '@type': 'Brand', name: offerData.brand || 'รถมือสองเชียงใหม่' },");

fs.writeFileSync('lib/seo/jsonld.js', code, 'utf8');
console.log('Fixed jsonld.js');
