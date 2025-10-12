# Facebook OG Re-scrape System Removed

**Date**: 2025-10-12  
**Action**: Complete removal of Facebook re-scrape automation

## Reason for Removal

Facebook Graph API requires valid access tokens for all automated scraping operations. Without token management:

- Workflow continuously fails with token expiry errors
- No token-free alternative exists for automation
- Manual re-scraping via Facebook Sharing Debugger is sufficient

## Files Removed

1. `.github/workflows/rescrape-facebook.yml` - Auto re-scrape workflow
2. `pages/api/social/rescrape.js` - Re-scrape API endpoint
3. `FACEBOOK_RESCRAPE_NO_TOKEN.md` - Documentation (obsolete)
4. `FACEBOOK_TOKEN_REALITY.md` - Analysis documentation

## Alternative: Manual Re-scraping

When you need to refresh Facebook's OG cache:

1. Visit: <https://developers.facebook.com/tools/debug/>
2. Paste your URL (e.g., `https://www.chiangmaiusedcar.com/cars/honda-accord`)
3. Click "Scrape Again"

**Typical use cases:**

- After changing site-wide OG image
- After updating brand/title formats
- When testing new car listings

## Natural Facebook Scraping

Facebook automatically scrapes URLs when:

- Someone shares the URL for the first time
- The URL is posted in a Facebook post
- The URL is used in Facebook Ads

**Your OG tags are well-implemented, so natural scraping works perfectly.**

## Environment Variables

You can safely remove these from Vercel (optional):

- `FACEBOOK_GRAPH_ACCESS_TOKEN` (expired)
- `FACEBOOK_APP_SECRET` (not needed)
- `RESCRAPE_SECRET` (API no longer exists)

## Remaining Social Features

These features still work perfectly:

- ✅ Open Graph meta tags on all pages
- ✅ Twitter Card meta tags
- ✅ SEO component with proper OG implementation
- ✅ Facebook sharing works naturally when URLs are posted

## Summary

**Removed**: Automated re-scraping (requires token management)  
**Kept**: Manual re-scraping option via Facebook's web tool  
**Result**: Cleaner codebase, no failing workflows, natural Facebook scraping works fine

---

*Facebook will automatically scrape your URLs when shared - no automation needed.*
