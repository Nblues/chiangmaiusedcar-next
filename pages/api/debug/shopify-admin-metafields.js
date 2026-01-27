import { fetchShopifyAdmin } from '../../../lib/shopify.mjs';

export default async function handler(req, res) {
  // Dev-only diagnostics
  if (process.env.NODE_ENV === 'production') {
    res.status(404).end();
    return;
  }

  const handle = typeof req.query.handle === 'string' ? req.query.handle.trim() : '';
  if (!handle) {
    res.status(400).json({ error: 'Missing ?handle=' });
    return;
  }

  const nsRaw = typeof req.query.namespace === 'string' ? req.query.namespace.trim() : 'all';
  const namespace = nsRaw || 'all';

  const productMetafieldsSelection =
    namespace === 'all'
      ? 'metafields(first: 100)'
      : `metafields(first: 100, namespace: "${namespace}")`;

  const variantMetafieldsSelection =
    namespace === 'all'
      ? 'metafields(first: 100)'
      : `metafields(first: 100, namespace: "${namespace}")`;

  const query = `
    query AdminMetafieldsByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        vendor
        ${productMetafieldsSelection} {
          edges {
            node {
              namespace
              key
              type
              value
              reference {
                __typename
                ... on Metaobject {
                  id
                  handle
                  type
                  fields {
                    key
                    value
                  }
                }
              }
              references(first: 20) {
                edges {
                  node {
                    __typename
                    ... on Metaobject {
                      id
                      handle
                      type
                      fields {
                        key
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              title
              ${variantMetafieldsSelection} {
                edges {
                  node {
                    namespace
                    key
                    type
                    value
                    reference {
                      __typename
                      ... on Metaobject {
                        id
                        handle
                        type
                        fields {
                          key
                          value
                        }
                      }
                    }
                    references(first: 20) {
                      edges {
                        node {
                          __typename
                          ... on Metaobject {
                            id
                            handle
                            type
                            fields {
                              key
                              value
                            }
                          }
                        }
                      }
                    }
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
    const data = await fetchShopifyAdmin(query, { handle });

    const product = data?.productByHandle || null;
    if (!product) {
      res.status(404).json({ error: 'Product not found for handle', handle });
      return;
    }

    res.status(200).json({
      handle,
      namespace,
      product,
      note: 'This endpoint uses Admin API. If you see empty spec edges, the product may not have spec metafields set, or the token lacks permissions.',
    });
  } catch (error) {
    res.status(500).json({ error: (error && error.message) || 'Admin API error', handle });
  }
}
