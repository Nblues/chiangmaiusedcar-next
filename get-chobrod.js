fetch('https://chobrod.com/car-sale').then(r=>r.text()).then(t => console.log(t.substring(0,2000)));
