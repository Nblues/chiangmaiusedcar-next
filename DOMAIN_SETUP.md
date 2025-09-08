# 🌐 Custom Domain Setup Guide

## Step 1: Add Domain in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-next)
2. Click on "Settings" tab
3. Navigate to "Domains" section
4. Click "Add Domain"
5. Enter: `chiangmaiusedcar.com`
6. Click "Add"

## Step 2: Configure DNS Records

Add these DNS records in your domain registrar:

### For Root Domain (chiangmaiusedcar.com):

```
Type: A
Name: @
Value: 76.76.19.61
TTL: 300
```

### For WWW Subdomain (www.chiangmaiusedcar.com):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

### Alternative: Using Vercel Nameservers (Recommended)

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## Step 3: SSL Certificate (Automatic)

- SSL certificate will be automatically provisioned by Vercel
- Usually takes 24-48 hours for full propagation
- No additional configuration needed

## Step 4: Verify Domain Setup

1. Check DNS propagation: https://www.whatsmydns.net/
2. Test HTTPS: https://chiangmaiusedcar.com
3. Test WWW redirect: https://www.chiangmaiusedcar.com
4. Verify SSL certificate

## Step 5: Update Environment Variables

Update `SITE_URL` in Vercel environment variables:

```
SITE_URL=https://chiangmaiusedcar.com
```

## Current Deployment URL

Temporary URL: https://chiangmaiusedcar-next-qnyqjw2bp-chiangmaiusedcars-projects.vercel.app

## Expected Final URLs

- Primary: https://chiangmaiusedcar.com
- Alternative: https://www.chiangmaiusedcar.com
