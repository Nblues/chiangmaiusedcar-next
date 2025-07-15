export async function fetchShopify(query, variables={}) {
  const domain = process.env.SHOPIFY_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const res = await fetch(`https://${domain}/api/2023-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function getAllCars() {
  const query = `
  {
    products(first: 250) {
      edges {
        node {
          id
          handle
          title
          description
          variants(first:1){ edges{ node{ price } } }
          images(first:20){ edges{ node{ url altText } } }
          metafields(first:10){ edges{ node{ key value } } }
        }
      }
    }
  }`;
  const data = await fetchShopify(query);
  return data.products.edges.map(e => e.node);
}

export async function getCarByHandle(handle) {
  const query = `
  {
    productByHandle(handle: "${handle}") {
      id
      handle
      title
      description
      variants(first:1){ edges{ node{ price } } }
      images(first:20){ edges{ node{ url altText } } }
      metafields(first:10){ edges{ node{ key value } } }
    }
  }`;
  const data = await fetchShopify(query);
  return data.productByHandle;
}
