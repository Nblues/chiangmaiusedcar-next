// Basic Shopify client setup
const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
};

async function getAllCars() {
  // Mock data for testing sitemap generation
  return [
    {
      handle: 'test-car-1',
      title: 'รถทดสอบ 1',
      images: [
        { url: 'https://example.com/car1-image1.jpg' },
        { url: 'https://example.com/car1-image2.jpg' },
      ],
    },
    {
      handle: 'test-car-2',
      title: 'รถทดสอบ 2',
      images: [{ url: 'https://example.com/car2-image1.jpg' }],
    },
  ];
}

module.exports = {
  getAllCars,
};
