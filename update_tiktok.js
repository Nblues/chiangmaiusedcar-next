const fs = require('fs');
let code = fs.readFileSync('components/TikTokFeed.jsx', 'utf-8');
code = code.replace(/<iframe\s*src=\{\https:\/\/www.tiktok.com\/embed\/v2\/\$\{videoId\}\?lang=th-TH\\}\s*className="w-full h-full border-none"\s*allowFullScreen\s*title="TikTok Video Player"\s*allow="encrypted-media;"\s*><\/iframe>/g, 
'<iframe src={\https://www.tiktok.com/embed/v2/\?lang=th-TH\} className="w-full h-full border-none" allowFullScreen title="TikTok Video Player" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"></iframe>');
fs.writeFileSync('components/TikTokFeed.jsx', code);
