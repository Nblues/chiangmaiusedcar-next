# Vercel Performance Standards - Environment Setup

## Required Environment Variables

Add these to your Vercel project environment variables:

### Production Variables
```bash
# Cache Revalidation (Required for ISR)
REVALIDATE_SECRET=your-super-secret-key-here-change-this

# Google Tag Manager (Optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Performance Monitoring (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### Development Variables (.env.local)
```bash
# Cache Revalidation
REVALIDATE_SECRET=dev-secret-key

# Development mode
NODE_ENV=development
```

## Setup Instructions

### 1. Vercel Dashboard
1. Go to your project settings in Vercel
2. Navigate to Environment Variables
3. Add the variables above with your values

### 2. Local Development
1. Copy `.env.local.example` to `.env.local`
2. Fill in your values
3. Never commit `.env.local` to git

### 3. Testing Cache Revalidation
```bash
# Test in development
curl -X POST "http://localhost:3000/api/revalidate?secret=dev-secret-key&tag=home"

# Test in production
curl -X POST "https://chiangmaiusedcar.com/api/revalidate?secret=your-super-secret-key-here-change-this&tag=home"
```

## Security Notes

- Always use strong, unique secrets
- Never expose secrets in client-side code
- Rotate secrets regularly
- Use different secrets for different environments

## Performance Monitoring

After deployment, monitor these metrics:
- Core Web Vitals (LCP, FID, CLS)
- Bundle sizes via `pnpm analyze`
- Cache hit rates in Vercel Analytics
- User experience via Real User Monitoring
