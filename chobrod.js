fetch('https://html.duckduckgo.com/html/?q=site:chobrod.com+%22mazda+2%22').then(r=>r.text()).then(t => console.log(t.match(/href="[^"]*"/g).slice(0, 10)));
