fetch('https://html.duckduckgo.com/html/?q=ttb+bluebook').then(r=>r.text()).then(t => console.log(t.match(/href="[^"]*"/g).slice(0, 20)));
