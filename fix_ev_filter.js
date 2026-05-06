const fs = require('fs');
let code = fs.readFileSync('pages/ev-cars-chiang-mai.jsx', 'utf8');

const regex = /cars = cars\.filter\(c => \{[\s\S]*?\}\);/;

const newFilter = `cars = cars.filter(c => {
    const title = (c.title || '').toLowerCase();
    const tags = (c.tags || []).join(' ').toLowerCase();
    const fuel = ((c.fuelType || '') + ' ' + (c.fuel_type || '')).toLowerCase();
    
    // Explicitly exclude hybrids to prevent matching e:HEV, PHEV, Hybrid
    if (title.includes('hev') || tags.includes('hev') || fuel.includes('hev') || 
        title.includes('hybrid') || tags.includes('hybrid') || fuel.includes('ไฮบริด')) {
      return false;
    }

    const text = title + ' ' + tags + ' ' + fuel;
    
    // Pure BEV text matches
    const isEv = text.includes(' ev ') || 
                 text.includes('electric') || 
                 text.includes('ไฟฟ้า') || 
                 text.includes('100%');
                 
    // Specific EV brands/models
    const isPureEvBrand = text.includes('byd') || 
                          text.includes('tesla') || 
                          text.includes('neta') || 
                          text.includes('aion') || 
                          text.includes('changan') || 
                          text.includes('wuling') || 
                          text.includes('ora');
                          
    const isMgEv = text.includes('mg4') || 
                   text.includes('mg ep') || 
                   text.includes('mg zs ev') || 
                   text.includes('mg maxus');

    return isEv || isPureEvBrand || isMgEv;
  });`;

if (code.match(regex)) {
    code = code.replace(regex, newFilter);
    fs.writeFileSync('pages/ev-cars-chiang-mai.jsx', code);
    console.log('Filter updated successfully!');
} else {
    console.log('Regex did not match.');
}