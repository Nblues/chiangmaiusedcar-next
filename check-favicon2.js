const https = require('https');
https.get('https://www.chiangmaiusedcar.com', (res) => {
  let data = '';
  res.on('data', (d) => { data += d; });
  res.on('end', () => {
    let matches = data.match(/<link[^>]*rel="?(?:apple-[^"]+|icon|mask-icon|shortcut icon)"?[^>]*>/gi);
    console.log(matches ? matches.join('\n') : 'No icons found');
  });
}).on('error', (e) => {
  console.error(e);
});