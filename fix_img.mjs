import fs from 'fs';
let code = fs.readFileSync('components/TikTokFeed.jsx', 'utf-8');
code = code.replace(/\{.*?eslint-disable-next-line[^\n]*\n\s*<img/g, '<img');
code = code.replace('<img', '{/* eslint-disable-next-line @next/next/no-img-element */}\n                    <img');
fs.writeFileSync('components/TikTokFeed.jsx', code);
