import sharp from 'sharp';
['414','640','828','1024','1200'].forEach(async (w) => { await sharp('public/herobanner/heroallcars-1400w.webp').resize(parseInt(w)).webp({ quality: 70, effort: 6 }).toFile('public/herobanner/heroallcars-' + w + 'w.webp'); console.log('generated ' + w); });
