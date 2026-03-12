fetch('https://html.duckduckgo.com/html/?q=site:taladrod.com+mazda+2').then(r=>r.text()).then(t => console.log(t.match(/href="[^"]*"/g).slice(0, 10)));
