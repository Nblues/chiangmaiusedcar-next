declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js built-in
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_VERCEL_URL?: string;

    // Site configuration
    SITE_URL: string;
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_SITE_DESCRIPTION: string;
    NEXT_PUBLIC_SITE_KEYWORDS: string;
    NEXT_PUBLIC_SITE_AUTHOR: string;
    CUSTOM_BUILD_TIME: string;
    NEXT_PUBLIC_BUILD_ENV: string;

    // Shopify integration
    SHOPIFY_DOMAIN: string;
    SHOPIFY_STOREFRONT_TOKEN: string;
    SHOPIFY_ADMIN_TOKEN?: string;

    // Analytics
    NEXT_PUBLIC_GA_ID: string;
    NEXT_PUBLIC_GTM_ID?: string;

    // EmailJS
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: string;
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: string;
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: string;

    // ReCAPTCHA
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;

    // Optional features
    ANALYZE?: 'true' | 'false';
    NEXT_PUBLIC_PWA_ENABLED?: 'true' | 'false';
    NEXT_PUBLIC_MAINTENANCE_MODE?: 'true' | 'false';
  }
}
