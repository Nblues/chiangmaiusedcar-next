console.log('Runner start');

import('../test-shopify-connection.mjs')
  .then(() => {
    console.log('Runner done');
  })
  .catch(err => {
    console.error('Runner error:', err);
    process.exit(1);
  });
