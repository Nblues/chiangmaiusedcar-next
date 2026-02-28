// Auto-generated Shopify GraphQL queries
export const metafieldRefSelection = `
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
  `;

export const AdminSpecByIdsQuery = `
    query AdminSpecByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          shopifyMetafields: metafields(first: 100, namespace: "shopify") {
            edges {
              node {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
          specMetafields: metafields(first: 100, namespace: "spec") {
            edges {
              node {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
          customMetafields: metafields(first: 100, namespace: "custom") {
            edges {
              node {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                shopifyMetafields: metafields(first: 100, namespace: "shopify") {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                      ${metafieldRefSelection}
                    }
                  }
                }
                specMetafields: metafields(first: 100, namespace: "spec") {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                      ${metafieldRefSelection}
                    }
                  }
                }
                customMetafields: metafields(first: 100, namespace: "custom") {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                      ${metafieldRefSelection}
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

export const AllProductsQuery = `
    query GetProducts($cursor: String) {
      products(first: 250, sortKey: CREATED_AT, reverse: true, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            handle
            title
            description
            productType
            vendor
            tags
            createdAt
            updatedAt
            availableForSale
            metafields(
              identifiers: [
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "custom", key: "year" }

                { namespace: "spec", key: "year" }
                { namespace: "spec", key: "ปี" }
                { namespace: "spec", key: "mileage" }
                { namespace: "spec", key: "odometer" }
                { namespace: "spec", key: "เลขไมล์" }
                { namespace: "spec", key: "ไมล์" }
                { namespace: "spec", key: "ระยะทาง" }
                { namespace: "spec", key: "เลขไมล์แท้" }
                { namespace: "spec", key: "transmission" }
                { namespace: "spec", key: "gear" }
                { namespace: "spec", key: "เกียร์" }
                { namespace: "spec", key: "fuel_type" }
                { namespace: "spec", key: "fuel" }
                { namespace: "spec", key: "เชื้อเพลิง" }
                { namespace: "spec", key: "drivetrain" }
                { namespace: "spec", key: "drive" }
                { namespace: "spec", key: "drive_type" }
                { namespace: "spec", key: "driveType" }
                { namespace: "spec", key: "wheel_drive" }
                { namespace: "spec", key: "wheelDrive" }
                { namespace: "spec", key: "drive-type" }
                { namespace: "spec", key: "wheel-drive" }
                { namespace: "spec", key: "ระบบขับเคลื่อน" }
                { namespace: "spec", key: "ขับเคลื่อน" }
                { namespace: "spec", key: "installment" }
                { namespace: "spec", key: "category" }
                { namespace: "spec", key: "vehicle_category" }
                { namespace: "spec", key: "car_category" }
                { namespace: "spec", key: "ประเภทรถ" }
                { namespace: "spec", key: "หมวดหมู่" }
                { namespace: "spec", key: "ประเภท" }
                { namespace: "spec", key: "body_type" }
                { namespace: "spec", key: "bodyType" }
                { namespace: "spec", key: "ประเภทตัวถัง" }
                { namespace: "spec", key: "brand" }
                { namespace: "spec", key: "model" }
              ]
            ) {
              namespace
              key
              value
              type
              ${metafieldRefSelection}
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  metafields(
                    identifiers: [
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "custom", key: "year" }

                      { namespace: "spec", key: "year" }
                      { namespace: "spec", key: "ปี" }
                      { namespace: "spec", key: "mileage" }
                      { namespace: "spec", key: "odometer" }
                      { namespace: "spec", key: "เลขไมล์" }
                      { namespace: "spec", key: "ไมล์" }
                      { namespace: "spec", key: "ระยะทาง" }
                      { namespace: "spec", key: "เลขไมล์แท้" }
                      { namespace: "spec", key: "transmission" }
                      { namespace: "spec", key: "gear" }
                      { namespace: "spec", key: "เกียร์" }
                      { namespace: "spec", key: "fuel_type" }
                      { namespace: "spec", key: "fuel" }
                      { namespace: "spec", key: "เชื้อเพลิง" }
                      { namespace: "spec", key: "drivetrain" }
                      { namespace: "spec", key: "drive" }
                      { namespace: "spec", key: "drive_type" }
                      { namespace: "spec", key: "driveType" }
                      { namespace: "spec", key: "wheel_drive" }
                      { namespace: "spec", key: "wheelDrive" }
                      { namespace: "spec", key: "drive-type" }
                      { namespace: "spec", key: "wheel-drive" }
                      { namespace: "spec", key: "ระบบขับเคลื่อน" }
                      { namespace: "spec", key: "ขับเคลื่อน" }
                      { namespace: "spec", key: "installment" }
                      { namespace: "spec", key: "category" }
                      { namespace: "spec", key: "vehicle_category" }
                      { namespace: "spec", key: "car_category" }
                      { namespace: "spec", key: "ประเภทรถ" }
                      { namespace: "spec", key: "หมวดหมู่" }
                      { namespace: "spec", key: "ประเภท" }
                      { namespace: "spec", key: "body_type" }
                      { namespace: "spec", key: "bodyType" }
                      { namespace: "spec", key: "ประเภทตัวถัง" }
                      { namespace: "spec", key: "brand" }
                      { namespace: "spec", key: "model" }
                    ]
                  ) {
                    namespace
                    key
                    value
                    type
                    ${metafieldRefSelection}
                  }
                  selectedOptions {
                    name
                    value
                  }
                  weight
                  weightUnit
                }
              }
            }
          }
        }
      }
    }
  `;

export const getCarSpecsByHandlesQuery = (varDefs, fields) => `
    query CarSpecsByHandles(${varDefs}) {
      ${fields}
    }
  `;

export const getHomepageProductsQuery = (limitNum) => `
  {
    products(first: ${limitNum}, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          description
          vendor
          tags
          availableForSale
          metafields(
            identifiers: [
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "custom", key: "year" }

              { namespace: "spec", key: "year" }
              { namespace: "spec", key: "ปี" }
              { namespace: "spec", key: "mileage" }
              { namespace: "spec", key: "odometer" }
              { namespace: "spec", key: "เลขไมล์" }
              { namespace: "spec", key: "transmission" }
              { namespace: "spec", key: "gear" }
              { namespace: "spec", key: "เกียร์" }
              { namespace: "spec", key: "fuel_type" }
              { namespace: "spec", key: "fuel" }
              { namespace: "spec", key: "เชื้อเพลิง" }
              { namespace: "spec", key: "drivetrain" }
              { namespace: "spec", key: "drive" }
              { namespace: "spec", key: "drive_type" }
              { namespace: "spec", key: "driveType" }
              { namespace: "spec", key: "wheel_drive" }
              { namespace: "spec", key: "wheelDrive" }
              { namespace: "spec", key: "drive-type" }
              { namespace: "spec", key: "wheel-drive" }
              { namespace: "spec", key: "ระบบขับเคลื่อน" }
              { namespace: "spec", key: "ขับเคลื่อน" }
              { namespace: "spec", key: "installment" }
              { namespace: "spec", key: "category" }
              { namespace: "spec", key: "vehicle_category" }
              { namespace: "spec", key: "car_category" }
              { namespace: "spec", key: "ประเภทรถ" }
              { namespace: "spec", key: "หมวดหมู่" }
              { namespace: "spec", key: "ประเภท" }
              { namespace: "spec", key: "body_type" }
              { namespace: "spec", key: "bodyType" }
              { namespace: "spec", key: "ประเภทตัวถัง" }
              { namespace: "spec", key: "brand" }
              { namespace: "spec", key: "model" }
            ]
          ) {
            namespace
            key
            value
            type
            ${metafieldRefSelection}
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                metafields(
                  identifiers: [
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "custom", key: "year" }

                    { namespace: "spec", key: "year" }
                    { namespace: "spec", key: "ปี" }
                    { namespace: "spec", key: "mileage" }
                    { namespace: "spec", key: "odometer" }
                    { namespace: "spec", key: "เลขไมล์" }
                    { namespace: "spec", key: "transmission" }
                    { namespace: "spec", key: "gear" }
                    { namespace: "spec", key: "เกียร์" }
                    { namespace: "spec", key: "fuel_type" }
                    { namespace: "spec", key: "fuel" }
                    { namespace: "spec", key: "เชื้อเพลิง" }
                    { namespace: "spec", key: "drivetrain" }
                    { namespace: "spec", key: "drive" }
                    { namespace: "spec", key: "drive_type" }
                    { namespace: "spec", key: "driveType" }
                    { namespace: "spec", key: "wheel_drive" }
                    { namespace: "spec", key: "wheelDrive" }
                    { namespace: "spec", key: "drive-type" }
                    { namespace: "spec", key: "wheel-drive" }
                    { namespace: "spec", key: "ระบบขับเคลื่อน" }
                    { namespace: "spec", key: "ขับเคลื่อน" }
                    { namespace: "spec", key: "installment" }
                    { namespace: "spec", key: "category" }
                    { namespace: "spec", key: "vehicle_category" }
                    { namespace: "spec", key: "car_category" }
                    { namespace: "spec", key: "ประเภทรถ" }
                    { namespace: "spec", key: "หมวดหมู่" }
                    { namespace: "spec", key: "ประเภท" }
                    { namespace: "spec", key: "body_type" }
                    { namespace: "spec", key: "bodyType" }
                    { namespace: "spec", key: "ประเภทตัวถัง" }
                    { namespace: "spec", key: "brand" }
                    { namespace: "spec", key: "model" }
                  ]
                ) {
                  namespace
                  key
                  value
                  type
                  ${metafieldRefSelection}
                }
              }
            }
          }
        }
      }
    }
  }
  `;

export const BrandCountsQuery = `
  {
    products(first: 250) {
      edges {
        node {
          vendor
          availableForSale
          metafield(namespace: "spec", key: "brand") { value }
        }
      }
    }
  }
  `;

export const getCarByHandleQuery = (handle) => `
  {
    productByHandle(handle: "${handle}") {
      id
      handle
      title
      description
      productType
      vendor
      tags
      createdAt
      updatedAt
      availableForSale
      metafields(
        identifiers: [
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "custom", key: "year" }

          { namespace: "spec", key: "year" }
          { namespace: "spec", key: "ปี" }
          { namespace: "spec", key: "mileage" }
          { namespace: "spec", key: "odometer" }
          { namespace: "spec", key: "เลขไมล์" }
          { namespace: "spec", key: "transmission" }
          { namespace: "spec", key: "gear" }
          { namespace: "spec", key: "เกียร์" }
          { namespace: "spec", key: "fuel_type" }
          { namespace: "spec", key: "fuel" }
          { namespace: "spec", key: "เชื้อเพลิง" }
          { namespace: "spec", key: "installment" }
          { namespace: "spec", key: "category" }
          { namespace: "spec", key: "vehicle_category" }
          { namespace: "spec", key: "car_category" }
          { namespace: "spec", key: "ประเภทรถ" }
          { namespace: "spec", key: "หมวดหมู่" }
          { namespace: "spec", key: "ประเภท" }
          { namespace: "spec", key: "body_type" }
          { namespace: "spec", key: "bodyType" }
          { namespace: "spec", key: "ประเภทตัวถัง" }
          { namespace: "spec", key: "brand" }
          { namespace: "spec", key: "model" }
        ]
      ) {
        namespace
        key
        value
        type
        ${metafieldRefSelection}
      }
      images(first: 50) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            metafields(
              identifiers: [
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "custom", key: "year" }

                { namespace: "spec", key: "year" }
                { namespace: "spec", key: "ปี" }
                { namespace: "spec", key: "mileage" }
                { namespace: "spec", key: "odometer" }
                { namespace: "spec", key: "เลขไมล์" }
                { namespace: "spec", key: "transmission" }
                { namespace: "spec", key: "gear" }
                { namespace: "spec", key: "เกียร์" }
                { namespace: "spec", key: "fuel_type" }
                { namespace: "spec", key: "fuel" }
                { namespace: "spec", key: "เชื้อเพลิง" }
                { namespace: "spec", key: "installment" }
                { namespace: "spec", key: "category" }
                { namespace: "spec", key: "vehicle_category" }
                { namespace: "spec", key: "car_category" }
                { namespace: "spec", key: "ประเภทรถ" }
                { namespace: "spec", key: "หมวดหมู่" }
                { namespace: "spec", key: "ประเภท" }
                { namespace: "spec", key: "body_type" }
                { namespace: "spec", key: "bodyType" }
                { namespace: "spec", key: "ประเภทตัวถัง" }
                { namespace: "spec", key: "brand" }
                { namespace: "spec", key: "model" }
              ]
            ) {
              namespace
              key
              value
              type
              ${metafieldRefSelection}
            }
          }
        }
      }
    }
  }
  `;
