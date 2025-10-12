# Environment Variables Cleanup

**Date**: 2025-10-12  
**Action**: Removed unused Facebook-related environment variables

## Variables Removed

### 1. FACEBOOK_APP_SECRET
- **Environments**: Production, Preview, Development
- **Reason**: Facebook OG re-scrape system removed, never used

### 2. FACEBOOK_GRAPH_ACCESS_TOKEN
- **Environments**: Production, Preview, Development
- **Reason**: Token expired, API endpoint removed

### 3. RESCRAPE_SECRET
- **Environments**: Production, Preview, Development
- **Reason**: `/api/social/rescrape` endpoint deleted

## Remaining Active Variables

### Shopify Integration ✅
- `SHOPIFY_STOREFRONT_TOKEN` (Production)
- `SHOPIFY_DOMAIN` (Production, Development)
- `SHOPIFY_WEBHOOK_SECRET` (Production)

### EmailJS Contact Form ✅
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (Production)
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` (Production)
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` (Production)

### reCAPTCHA ✅
- `RECAPTCHA_SECRET_KEY` (Production)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (Production)

### Google Maps ✅
- `MAPS_API_KEY` (Production)
- `NEXT_PUBLIC_GMAPS_KEY` (Development)

### Other ✅
- `SITE_URL` (Production)
- `FIREBASE_CONFIG` (Production)
- `REVALIDATE_SECRET` (Preview, Development)

## Commands Used

```bash
# Remove FACEBOOK_APP_SECRET
vercel env rm FACEBOOK_APP_SECRET production --yes
vercel env rm FACEBOOK_APP_SECRET preview --yes
vercel env rm FACEBOOK_APP_SECRET development --yes

# Remove FACEBOOK_GRAPH_ACCESS_TOKEN
vercel env rm FACEBOOK_GRAPH_ACCESS_TOKEN production --yes
vercel env rm FACEBOOK_GRAPH_ACCESS_TOKEN preview --yes
vercel env rm FACEBOOK_GRAPH_ACCESS_TOKEN development --yes

# Remove RESCRAPE_SECRET
vercel env rm RESCRAPE_SECRET production --yes
vercel env rm RESCRAPE_SECRET preview --yes
vercel env rm RESCRAPE_SECRET development --yes
```

## Impact

- ✅ No impact on live site
- ✅ All active features still work
- ✅ Cleaner environment variable list
- ✅ Better security (no unused secrets)

## Summary

**Total Removed**: 9 environment variables (3 variables × 3 environments each)  
**Total Remaining**: 14 active environment variables  
**Status**: ✅ Complete - all unused variables cleaned up

---

*Environment variables are now aligned with active features only.*
