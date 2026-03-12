const fs = require('fs');

const file = 'lib/seo/jsonld.js';
let content = fs.readFileSync(file, 'utf8');

// replace hardcoded seller info in buildProductJsonLd / buildCarJsonLd
content = content.replace(/telephone: '\+66940649018'/g, 'telephone: \+66\\, email: BUSINESS_INFO.email');

// add ContactPoint to buildLocalBusinessJsonLd
content = content.replace(
  /currenciesAccepted: 'THB',\s+sameAs: \[/,
  \currenciesAccepted: 'THB',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: \\\+66\\\\\\\\,
        contactType: 'customer service',
        email: BUSINESS_INFO.email,
        availableLanguage: ['Thai', 'English']
      },
      sameAs: [\
);

fs.writeFileSync(file, content);
console.log('Update Complete');
