import { fetchShopifyAdmin, fetchShopify } from './lib/shopify.mjs';

async function check() {
  try {
    const adminData = await fetchShopifyAdmin(`{
      products(first: 5, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            title
            status
            publishedOnCurrentPublication
            updatedAt
          }
        }
      }
    }`);
    console.log("== ADMIN API (Latest 5 cars) ==");
    console.dir(adminData.products.edges.map(e => e.node), { depth: null });

    const storeData = await fetchShopify(`{
      products(first: 5, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            title
            availableForSale
          }
        }
      }
    }`);
    console.log("== STOREFRONT API (Latest 5 cars) ==");
    console.dir(storeData, { depth: null });
  } catch (e) {
    console.error(e);
  }
}
check();