const fs = require('fs');
let code = fs.readFileSync('lib/seo/jsonld.js', 'utf8');

code = code.replace(/รถ\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBDอง\xEF\xBF\xBD\xEF\xBF\xBDยง\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBD/g, 'รถมือสองเชียงใหม่');
code = code.replace(/รถ\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBD\xEF\xBF\xBDาพ\xEF\xBF\xBD\xEF\xBF\xBD/g, 'รถสวยคัดสภาพ');
code = code.replace(/description: description \|\| [\s\S]*?,/g, "description: description || 'รถมือสองคัดเกรด',");

fs.writeFileSync('lib/seo/jsonld.js', code, 'utf8');
console.log('Fixed gibberish');
