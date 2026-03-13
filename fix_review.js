const fs = require('fs');
let code = fs.readFileSync('pages/review.jsx', 'utf8');

// Replace all combinations of bad insertions with just the static literal
code = code.replace(/content=\{\$\{SITE_URL\}(.*?)\}/g, 'content={$}');
code = code.replace(/content=\{\"\\\(.*?)\"\}/g, 'content={$}');

fs.writeFileSync('pages/review.jsx', code);
