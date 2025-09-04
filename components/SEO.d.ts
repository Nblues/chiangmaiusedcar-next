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

declare const SEO: (_props: SEOProps) => JSX.Element;
export default SEO;
