const https = require('https');

const domain = 'kn-goodcar.com';
const token = 'bb70cb008199a94b83c98df0e45ada67';

const postData = JSON.stringify({
  query: `{ shop { name } }`
});

const options = {
  hostname: `${domain}.myshopify.com`,
  port: 443,
  path: '/api/2023-04/graphql.json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
