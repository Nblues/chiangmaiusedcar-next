const fs = require('fs');
let file = 'pages/index.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/decoding="sync"/g, 'decoding="async"');
fs.writeFileSync(file, content);