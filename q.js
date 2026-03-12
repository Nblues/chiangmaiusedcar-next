fetch('https://chobrod.com/car-sale').then(r=>r.text()).then(t => console.log((t.match(/<form [^>]*.*?<\/form>/gis) || t.match(/<form [^>]*>/gis) || []).join('\n')));
