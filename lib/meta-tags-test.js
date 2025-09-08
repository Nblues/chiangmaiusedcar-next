// lib/meta-tags-test.js
// Utility for testing meta tags and social sharing

export const testMetaTags = () => {
  if (typeof window === 'undefined') return null;

  const metaTags = {};

  // Basic meta tags
  metaTags.title = document.title;
  metaTags.description = document.querySelector('meta[name="description"]')?.content;
  metaTags.keywords = document.querySelector('meta[name="keywords"]')?.content;
  metaTags.canonical = document.querySelector('link[rel="canonical"]')?.href;

  // Open Graph tags
  metaTags.og = {
    title: document.querySelector('meta[property="og:title"]')?.content,
    description: document.querySelector('meta[property="og:description"]')?.content,
    image: document.querySelector('meta[property="og:image"]')?.content,
    url: document.querySelector('meta[property="og:url"]')?.content,
    type: document.querySelector('meta[property="og:type"]')?.content,
    site_name: document.querySelector('meta[property="og:site_name"]')?.content,
    locale: document.querySelector('meta[property="og:locale"]')?.content,
  };

  // Twitter Card tags
  metaTags.twitter = {
    card: document.querySelector('meta[name="twitter:card"]')?.content,
    title: document.querySelector('meta[name="twitter:title"]')?.content,
    description: document.querySelector('meta[name="twitter:description"]')?.content,
    image: document.querySelector('meta[name="twitter:image"]')?.content,
    site: document.querySelector('meta[name="twitter:site"]')?.content,
  };

  // LINE and WhatsApp specific
  metaTags.line = {
    title: document.querySelector('meta[property="line:title"]')?.content,
    description: document.querySelector('meta[property="line:description"]')?.content,
    image: document.querySelector('meta[property="line:image"]')?.content,
  };

  // Structured data
  const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
  metaTags.structuredData = Array.from(structuredDataScripts)
    .map(script => {
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  return metaTags;
};

export const validateMetaTags = metaTags => {
  const issues = [];

  // Title validation
  if (!metaTags.title || metaTags.title.length === 0) {
    issues.push('❌ Missing page title');
  } else if (metaTags.title.length > 60) {
    issues.push('⚠️ Title too long (>60 characters)');
  }

  // Description validation
  if (!metaTags.description || metaTags.description.length === 0) {
    issues.push('❌ Missing meta description');
  } else if (metaTags.description.length > 160) {
    issues.push('⚠️ Description too long (>160 characters)');
  }

  // Open Graph validation
  if (!metaTags.og.title) issues.push('❌ Missing og:title');
  if (!metaTags.og.description) issues.push('❌ Missing og:description');
  if (!metaTags.og.image) issues.push('❌ Missing og:image');
  if (!metaTags.og.url) issues.push('❌ Missing og:url');

  // Twitter Card validation
  if (!metaTags.twitter.card) issues.push('❌ Missing twitter:card');
  if (!metaTags.twitter.title) issues.push('❌ Missing twitter:title');
  if (!metaTags.twitter.description) issues.push('❌ Missing twitter:description');
  if (!metaTags.twitter.image) issues.push('❌ Missing twitter:image');

  // Image validation
  if (metaTags.og.image && !metaTags.og.image.startsWith('https://')) {
    issues.push('⚠️ OG image should use HTTPS');
  }

  // Structured data validation
  if (metaTags.structuredData.length === 0) {
    issues.push('⚠️ No structured data found');
  }

  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, 100 - issues.length * 10),
  };
};

export const generateShareUrls = (
  url = window.location.href,
  title = document.title,
  description = ''
) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
};

export const testSocialSharing = async url => {
  try {
    // Test Facebook debugger
    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/?id=${encodeURIComponent(url)}&scrape=true`,
      {
        method: 'POST',
      }
    );

    // Test Twitter card validator (requires auth)
    // const twitterResponse = await fetch(`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(url)}`);

    return {
      facebook: fbResponse.ok ? 'Pass' : 'Fail',
      twitter: 'Manual check required',
      line: 'Manual check required',
      whatsapp: 'Manual check required',
    };
  } catch (error) {
    return {
      error: 'Testing failed',
      message: error.message,
    };
  }
};

// Development helper
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.testMetaTags = testMetaTags;
  window.validateMetaTags = validateMetaTags;
  window.generateShareUrls = generateShareUrls;
  window.testSocialSharing = testSocialSharing;

  // Auto-test on page load
  setTimeout(() => {
    const tags = testMetaTags();
    const validation = validateMetaTags(tags);

    // eslint-disable-next-line no-console
    console.group('📱 Social Sharing Meta Tags Test');
    // eslint-disable-next-line no-console
    console.log('Meta Tags:', tags);
    // eslint-disable-next-line no-console
    console.log('Validation:', validation);
    // eslint-disable-next-line no-console
    console.log('Share URLs:', generateShareUrls());
    // eslint-disable-next-line no-console
    console.groupEnd();

    if (validation.issues.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('🔧 Issues found:', validation.issues);
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ All meta tags are properly configured!');
    }
  }, 1000);
}

const metaTagsUtils = {
  testMetaTags,
  validateMetaTags,
  generateShareUrls,
  testSocialSharing,
};

export default metaTagsUtils;
