fetch('https://html.duckduckgo.com/html/?q=site:chobrod.com+mazda+2').then(r=>r.text()).then(t => console.log(t.split('href="').filter(s => s.startsWith('//duckduckgo.com/l/?uddg='))));
