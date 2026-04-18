import { fetchShopifyAdmin } from './lib/shopify.mjs';

async function check() {
  const q = `
    query {
      products(first: 5, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            title
            resourcePublications(first: 10) {
              edges {
                node {
                  isPublished
                  publication {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await fetchShopifyAdmin(q);
    console.log(JSON.stringify(data.products.edges.map(e => ({
      title: e.node.title,
      channels: e.node.resourcePublications.edges
        .filter(p => p.node.isPublished)
        .map(p => p.node.publication.name)
    })), null, 2));
  } catch (e) {
    console.error(e);
  }
}
check();