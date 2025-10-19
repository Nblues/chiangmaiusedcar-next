# 📊 SEO & Analytics Setup Guide

## Google Search Console Setup

### Step 1: Add Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Enter: `https://chiangmaiusedcar.com`
4. Verify ownership using HTML meta tag method

### Step 2: Submit Sitemap

1. In Search Console, go to "Sitemaps"
2. Add sitemap URL: `https://chiangmaiusedcar.com/sitemap.xml`
3. Click "Submit"

### Step 3: Monitor Performance

- Track impressions, clicks, CTR
- Monitor Core Web Vitals
- Check page indexing status

## Google Analytics Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new GA4 property for chiangmaiusedcar.com
3. Get Measurement ID (GA_MEASUREMENT_ID)

### Step 2: Update Environment Variables

Add to Vercel environment variables:

```
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your_api_secret_key
```

### Step 3: Verify Tracking

- Check Real-Time reports
- Verify page views
- Monitor conversion events

## Facebook/Meta Business Setup

### Step 1: Business Manager

1. Create Facebook Business account
2. Add website: chiangmaiusedcar.com
3. Verify domain ownership

### Step 2: Meta Pixel (Optional)

```html
<!-- Add to _app.jsx or _document.jsx -->
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## Local Business Schema (Already Implemented)

The website includes structured data for:

- LocalBusiness
- AutoDealer
- ContactPoint
- Address information

## Social Media Integration

### Facebook Page

- Create Facebook page for business
- Link to website
- Regular posts about car listings

### LINE Official Account

- Set up LINE Official account
- Add LINE chat widget
- Integrate with contact forms

## Performance Monitoring (Already Active)

### Web Vitals Tracking

- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)

### API Endpoint

Performance data collected at: `/api/analytics`

## Content Marketing Setup

### Blog Content Strategy

1. Car buying guides
2. Market trends in Chiang Mai
3. Financing tips
4. Car maintenance advice

### Local SEO

- Google My Business listing
- Local directory submissions
- Customer reviews management
- Local keyword optimization

## Monitoring & Maintenance

### Weekly Tasks

- Check Google Search Console
- Review analytics data
- Monitor site performance
- Update car listings

### Monthly Tasks

- SEO performance review
- Content updates
- Technical SEO audit
- Competitor analysis

## Key Metrics to Track

### Traffic Metrics

- Organic search traffic
- Direct traffic
- Referral traffic
- Social media traffic

### Engagement Metrics

- Page views per session
- Session duration
- Bounce rate
- Contact form submissions

### Business Metrics

- Lead generation
- Inquiry-to-sale conversion
- Popular car models
- Geographic traffic distribution

## Current Implementation Status

✅ **Completed**

- Meta tags optimization
- Sitemap generation
- Performance monitoring
- Social sharing optimization
- Structured data implementation

⏳ **Pending Setup**

- Google Search Console verification
- Google Analytics configuration
- Social media accounts creation
- Local business listings
