const fs = require('fs');

const file = 'pages/_app.jsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/timeoutId = setTimeout\(loadAnalytics, 5000\);[\s\S]+?return \(\) => {[\s\S]+?if \(timeoutId\) clearTimeout\(timeoutId\);[\s\S]+?interactionEvents\.forEach\(event => {[\s\S]+?window\.removeEventListener\(event, handleInteraction\);[\s\S]+?}\);[\s\S]+?};/g, 
`const initDelay = () => {
      interactionEvents.forEach(event => {
        window.addEventListener(event, handleInteraction, { passive: true, once: true });
      });
      timeoutId = setTimeout(loadAnalytics, 7000);
    };

    if (document.readyState === 'complete') {
      initDelay();
    } else {
      window.addEventListener('load', initDelay, { once: true });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
      window.removeEventListener('load', initDelay);
    };`);

c = c.replace(/interactionEvents\.forEach\(event => {[\s\S]+?window\.addEventListener\(event, handleInteraction, { passive: true, once: true }\);[\s\S]+?}\);/g, '');

c = c.replace(/setTimeout\(\(\) => {/g, 'timeoutId = setTimeout(() => {');
c = c.replace(/}, 100\);/g, '}, 500);');

fs.writeFileSync(file, c);
console.log("Fixed _app.jsx");