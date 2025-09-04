// Bridge component for TypeScript: proxy to the runtime SEO.jsx without creating a TS alias cycle.
import React from 'react';

interface CarData {
  title?: string;
  brand?: string;
  model?: string;
  year?: string;
  price?: string;
  images?: Array<{ url: string; altText?: string }>;
  [key: string]: unknown;
}

interface FAQJsonLD {
  '@context'?: string;
  '@type'?: string;
  mainEntity?: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  keywords?: string;
  author?: string;
  type?: string;
  image?: string | null;
  carData?: CarData;
  breadcrumb?: Array<{ name: string; url: string }>;
  faqJsonld?: FAQJsonLD;
}

const SEOProxy = (props: SEOProps) => {
  // Use require to avoid static import alias cycles during type-check.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('./SEO.jsx');
  const Comp = mod && mod.default ? mod.default : mod;
  return Comp ? React.createElement(Comp, props) : null;
};

export default SEOProxy;
