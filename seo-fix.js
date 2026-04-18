const fs = require('fs');

let content = fs.readFileSync('pages/all-cars.jsx', 'utf8');

content = content.replace(
  'const isFiltered = useMemo(() => {',
  '// Updated: Only treat text search as filtered for SEO noindex purposes to allow indexing of price/brand combinations.\n  const isFiltered = useMemo(() => {'
);
content = content.replace(
  'return hasSearch || hasPrice || hasBrand;\n    }, [searchTerm, priceRange, brandFilter]);',
  'return hasSearch;\n    }, [searchTerm]);'
);

content = content.replace(
  'const isFiltered = hasSearch || hasPrice || hasBrand;',
  'const isFiltered = hasSearch; // Only noindex true search queries, allow price/brand to be indexed'
);

const metaLogic = \
    // --- DYNAMIC SEO META ---
    const getDynamicSEO = () => {
      let title = seoAllCars.titleBase;
      let desc = "ดูรถยนต์มือสองคุณภาพดีทั้งหมดจำนวน";
      let isSpecific = false;
      
      const priceLabels = {
        '0-100000': 'ราคาไม่เกิน 1 แสน',
        '100000-200000': 'ราคา 1-2 แสน',
        '200000-300000': 'ราคา 2-3 แสน',
        '300000-400000': 'ราคา 3-4 แสน',
        '400000-500000': 'ราคา 4-5 แสน',
        '500000-600000': 'ราคา 5-6 แสน',
        '600000-700000': 'ราคา 6-7 แสน',
        '700000': 'ราคา 7 แสนขึ้นไป'
      };
      
      const brandLabels = {
        'toyota': 'รถ Toyota',
        'honda': 'รถ Honda',
        'nissan': 'รถ Nissan',
        'mazda': 'รถ Mazda',
        'mitsubishi': 'รถ Mitsubishi',
        'isuzu': 'รถ Isuzu',
        'ford': 'รถ Ford'
      };

      let prefix = [];
      let descPrefix = [];
      if (brandFilter && brandFilter !== 'all' && brandLabels[brandFilter]) {
        prefix.push(brandLabels[brandFilter]);
        descPrefix.push(brandLabels[brandFilter]);
        isSpecific = true;
      } else {
        prefix.push("รถมือสอง");
        descPrefix.push("รถมือสอง");
      }

      if (priceRange && priceRange !== 'all' && priceLabels[priceRange]) {
        prefix.push(priceLabels[priceRange]);
        descPrefix.push(priceLabels[priceRange]);
        isSpecific = true;
      }
      
      if (isSpecific) {
        title = \\\\ เชียงใหม่ สภาพดี ฟรีดาวน์\\\;
        desc = \\\\ ศูนย์รวมรถบ้านมือเดียวในจังหวัดเชียงใหม่ สภาพดี ฟรีดาวน์ พร้อมรับประกัน 1 ปี\\\;
      }

      return { title, desc, isSpecific };
    };
    
    const dynamicSEO = getDynamicSEO();
\;

content = content.replace(
  /<SEO\\s+title={.*?}/,
  metaLogic + '\\n        <SEO\\n          title={dynamicSEO.isSpecific ? dynamicSEO.title + (safeTotalPages > 1 && safePage > 1 ? " หน้า " + safePage : "") + " | ครูหนึ่งรถสวย" : seoAllCars.titleBase + (safeTotalPages > 1 && safePage > 1 ? " หน้า " + safePage : "") + " | ครูหนึ่งรถสวย"}'
);

content = content.replace(/description={.*094-064-9018}/s, 'description={dynamicSEO.isSpecific ? (dynamicSEO.desc + " โทร 094-064-9018") : "ดูรถยนต์มือสองคุณภาพดีทั้งหมดคัดเกรดพรีเมียม สภาพดี ฟรีดาวน์ พร้อมรับประกัน 1 ปี โทร 094-064-9018"}');


fs.writeFileSync('pages/all-cars.jsx', content);
console.log("SEO optimization applied.");
