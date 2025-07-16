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
          variants(first: 1) {
            edges {
              node {
                price { amount currencyCode }
              }
            }
          }
          images(first: 1) { edges { node { url altText } } }
        }
      }
    }
  }`;
  const data = await fetchShopify(query);
  // ส่งเฉพาะ field ที่จำเป็น: id, handle, title, ราคา, รูปแรก
  return data.products.edges.map(e => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    price: e.node.variants.edges[0]?.node.price,
    images: e.node.images.edges.map(img => img.node)
  }));
}

export async function getCarByHandle(handle) {
  const query = `
  {
    productByHandle(handle: "${handle}") {
      id
      handle
      title
      description
      variants(first: 1) {
        edges {
          node {
            price { amount currencyCode }
          }
        }
      }
      images(first:20){ edges{ node{ url altText } } }
    }
  }`;
  const data = await fetchShopify(query);
  const p = data.productByHandle;
  return p ? { ...p, images: p.images.edges.map(img => img.node) } : null;
}
