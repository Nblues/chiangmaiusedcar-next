const fs = require('fs');

let code = fs.readFileSync('components/TikTokFeed.jsx', 'utf-8');

code = code.replace(/<iframe\s+src=\{\https:\/\/www\.tiktok\.com\/embed\/v2\/\$\{videoId\}\?lang=th-TH\\}\s+className="w-full h-full border-none"\s+allowFullScreen\s+title="TikTok Video Player"\s+allow="encrypted-media;"\s*><\/iframe>/s, 
'<iframe src={\https://www.tiktok.com/embed/v2/\?lang=th-TH\} className="w-full h-full border-none" allowFullScreen title="TikTok Video Player" allow="autoplay; encrypted-media;" referrerPolicy="strict-origin-when-cross-origin"></iframe>');

fs.writeFileSync('components/TikTokFeed.jsx', code);
