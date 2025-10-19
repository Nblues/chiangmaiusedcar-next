# 🚨 SECURITY INCIDENT REPORT - API Tokens Exposed

**Date**: October 3, 2025  
**Severity**: 🔴 **CRITICAL**  
**Status**: ⚠️ In Progress

---

## 📋 Summary

API credentials and tokens were accidentally committed to Git repository in `vercel.json` file, potentially exposing
sensitive information to unauthorized access.

---

## 🔍 Exposed Information

### 1. Shopify Storefront API Token

```
File: vercel.json
Token: bb70cb008199a94b83c98df0e45ada67
Domain: kn-goodcar.com
Risk: HIGH - Can access product data, inventory, customer orders
```

### 2. EmailJS Credentials

```
Service ID: service_qlcksif
Template ID: template_zd6e3f6
Public Key: P3wnNJB_Y_PddrdBJ
Risk: MEDIUM - Can send emails on behalf of your service
```

---

## ✅ Immediate Actions Taken

1. ✅ **Removed hardcoded secrets from vercel.json**

   - Changed to use Vercel Secret references (@shopify_domain, @shopify_storefront_token, etc.)
   - Commit: TBD

2. ⏳ **Pending Actions**:
   - Rotate Shopify Storefront API Token immediately
   - Regenerate EmailJS keys if possible
   - Add secrets to Vercel Environment Variables dashboard
   - Verify no unauthorized access to Shopify store
   - Review Git history for token usage

---

## 🔐 Required Actions (URGENT)

### Priority 1: Rotate Shopify Token (DO THIS NOW)

1. **Go to Shopify Admin**:

   - Navigate to: Settings → Apps and sales channels → Develop apps
   - Find your app: "chiangmaiusedcar" or similar
   - Click "API credentials"
   - **Revoke** the exposed Storefront API access token
   - **Generate new token**

2. **Add New Token to Vercel**:

   ```bash
   vercel env add SHOPIFY_STOREFRONT_TOKEN
   # Paste NEW token when prompted
   # Select: Production, Preview, Development
   ```

3. **Update .env.production.local** (local development):
   ```env
   SHOPIFY_STOREFRONT_TOKEN=<NEW_TOKEN_HERE>
   ```

### Priority 2: Configure Vercel Secrets

```bash
# Add all secrets to Vercel dashboard
vercel env add SHOPIFY_DOMAIN
# Enter: kn-goodcar.com

vercel env add SHOPIFY_STOREFRONT_TOKEN
# Enter: <NEW_TOKEN>

vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID
# Enter: service_qlcksif (or regenerate)

vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
# Enter: template_zd6e3f6 (or regenerate)

vercel env add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
# Enter: P3wnNJB_Y_PddrdBJ (or regenerate)
```

### Priority 3: EmailJS Security

1. **Login to EmailJS Dashboard**: https://dashboard.emailjs.com
2. **Regenerate Public Key** (if possible)
3. **Enable Domain Restrictions**:
   - Settings → Security
   - Add allowed domain: `chiangmaiusedcar.com`
   - Add allowed domain: `www.chiangmaiusedcar.com`

---

## 🛡️ Prevention Measures

### 1. Update .gitignore (Already Protected)

```gitignore
.env
.env.local
.env.*.local
*.key
*.pem
vercel.json (DO NOT IGNORE - just don't put secrets in it)
```

### 2. Use Environment Variables Correctly

**❌ WRONG (What we had)**:

```json
{
  "env": {
    "SHOPIFY_STOREFRONT_TOKEN": "bb70cb008199a94b83c98df0e45ada67"
  }
}
```

**✅ CORRECT (Fixed)**:

```json
{
  "build": {
    "env": {
      "SHOPIFY_STOREFRONT_TOKEN": "@shopify_storefront_token"
    }
  }
}
```

### 3. Pre-commit Hooks

Already configured in `.husky/pre-commit` to prevent committing secrets.

---

## 📊 Impact Assessment

### Shopify Storefront API Token

- **Exposed Since**: Unknown (needs Git history review)
- **Scope**: Read-only access to:
  - Product catalog (public data)
  - Collections
  - Product variants
  - Basic store info
- **Cannot**:
  - Modify products
  - Access customer personal data
  - Process payments
  - Access admin functions

### EmailJS Keys

- **Risk**: Moderate
- **Scope**: Can send emails using your templates
- **Mitigation**: Domain restrictions should prevent abuse

---

## 🔄 Recovery Steps

1. ✅ Remove secrets from Git (Done)
2. ⏳ Rotate Shopify token (Pending - USER ACTION REQUIRED)
3. ⏳ Add secrets to Vercel dashboard (Pending)
4. ⏳ Redeploy with new credentials (Pending)
5. ⏳ Monitor for unauthorized access (Pending)
6. ⏳ Review Git commit history (Pending)

---

## 📝 Lessons Learned

1. **Never commit secrets to Git** - Use environment variables
2. **Use Vercel Secrets** - Reference with `@secret_name`
3. **Regular security audits** - Check for exposed credentials
4. **Principle of least privilege** - Use read-only tokens when possible
5. **Rotate credentials regularly** - Even if not compromised

---

## 🔗 Resources

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Shopify API Best Practices](https://shopify.dev/docs/api/usage/authentication)
- [EmailJS Security](https://www.emailjs.com/docs/security/)
- [Git Secrets Scanner](https://github.com/awslabs/git-secrets)

---

## 📞 Next Steps

**IMMEDIATE (Within 1 hour)**:

- [ ] Rotate Shopify Storefront API token
- [ ] Add new token to Vercel
- [ ] Test deployment with new credentials

**SHORT-TERM (Within 24 hours)**:

- [ ] Review EmailJS security settings
- [ ] Monitor Shopify access logs
- [ ] Audit other files for hardcoded secrets

**LONG-TERM**:

- [ ] Implement automated secret scanning
- [ ] Regular security reviews
- [ ] Document secret rotation procedures

---

**Report Created**: October 3, 2025  
**Last Updated**: October 3, 2025  
**Responsible**: Development Team  
**Status**: 🔴 REQUIRES IMMEDIATE ACTION
