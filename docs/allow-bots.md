# Cloudflare Bot Management Rules

## Allow Essential Bots Rule

### Purpose

This rule ensures that essential SEO and performance monitoring tools can access the website without being blocked by Cloudflare's bot protection.

### Rule Configuration

**Expression:**

```text
(http.user_agent contains "Chrome-Lighthouse") or (http.user_agent contains "Googlebot")
```

**Action:** Allow

### Covered Bots

1. **Chrome Lighthouse** (`Chrome-Lighthouse`)
   - Google's automated tool for improving web page quality
   - Used for performance, accessibility, SEO, and PWA audits
   - Essential for PageSpeed Insights and Core Web Vitals monitoring

2. **Googlebot** (`Googlebot`)
   - Google's web crawling bot
   - Critical for search engine indexing and SEO
   - Ensures proper website visibility in Google Search

### Implementation Steps

1. Log into Cloudflare Dashboard
2. Navigate to Security → WAF → Custom rules
3. Create new rule with the expression above
4. Set action to "Allow"
5. Deploy the rule

### Why This Rule is Important

- **SEO Performance:** Ensures Google can properly crawl and index the website
- **Performance Monitoring:** Allows Lighthouse audits for performance optimization
- **Core Web Vitals:** Enables accurate measurement of user experience metrics
- **Search Visibility:** Prevents accidental blocking of search engine crawlers

### Notes

- This rule should be applied at the highest priority to prevent other rules from blocking these essential bots
- Monitor Cloudflare analytics to ensure the rule is working correctly
- Consider adding other essential bots (Bingbot, etc.) as needed

### Related Documentation

- [Cloudflare Bot Management](https://developers.cloudflare.com/bots/)
- [Google Search Central - Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot)
- [Chrome Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
