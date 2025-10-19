# Security Policy

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:

1. **Do NOT** create a public GitHub issue
2. Contact the project maintainer directly
3. Provide detailed information about the vulnerability

## Supported Versions

| Version | Supported              |
| ------- | ---------------------- |
| 2.0.x   | ✅ Yes (Current)       |
| 1.0.x   | ⚠️ Critical fixes only |
| < 1.0   | ❌ No longer supported |

## Security Measures

### Current Implementations

- ✅ Admin authentication required
- ✅ Environment variables for secrets
- ✅ HTTPS only (enforced)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Input validation on forms
- ✅ Rate limiting on APIs
- ✅ Automated dependency updates (Dependabot)

### Best Practices

1. **Never commit secrets**

   - Use `.env.local` for development
   - Use Vercel Environment Variables for production
   - Add sensitive files to `.gitignore`

2. **Keep dependencies updated**

   - Run `pnpm audit` regularly
   - Update dependencies monthly
   - Review Dependabot PRs

3. **Access Control**
   - Admin pages require authentication
   - API routes check authorization
   - Production deployment protected

## Response Time

- **Critical**: Within 24 hours
- **High**: Within 3 days
- **Medium**: Within 7 days
- **Low**: Next release cycle

## Disclosure Policy

We follow responsible disclosure:

1. Report received
2. Issue confirmed
3. Fix developed and tested
4. Fix deployed to production
5. Public disclosure (if applicable)

---

© 2025 Chiangmai Used Car (ครูหนึ่งรถสวย)
