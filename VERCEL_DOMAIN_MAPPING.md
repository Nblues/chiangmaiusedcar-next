# Vercel Domain Mapping — chiangmaiusedcar-next (Production)

This guide moves the custom domain to the correct Vercel project without downtime.

Primary target: chiangmaiusedcar-next (Production) Custom domain:
[www.chiangmaiusedcar.com](https://www.chiangmaiusedcar.com)

## 1) Pre-checks

- Confirm the project builds cleanly:
  - pnpm lint
  - pnpm type-check
  - pnpm build
- Verify health on the current deployment URL:
  - GET /api/\_probe returns JSON with ok=true

## 2) Verify current domain mapping

Use our PowerShell checker (Windows):

```powershell
./scripts/vercel-domain-check.ps1 -CustomDomain https://www.chiangmaiusedcar.com -DeploymentUrl https://example-deployment.vercel.app
```

Expected:

- Custom domain currently returns 404 HTML (mapped to old project) — this confirms mismatch.
- Deployment domain returns JSON 200 with ok=true.

## 3) Attach domain to the target project

Use Vercel CLI (idempotent and safe). You can run a dry run first:

```powershell
./scripts/vercel-attach-domain.ps1 -Project chiangmaiusedcar-next -Domain https://www.chiangmaiusedcar.com -DryRun
```

Then apply:

```powershell
./scripts/vercel-attach-domain.ps1 -Project chiangmaiusedcar-next -Domain https://www.chiangmaiusedcar.com
```

Notes:

- If the domain is attached to another project, remove it there first (Vercel Dashboard → old project → Settings →
  Domains → Remove).
- Login will be interactive on the first run.

## 4) DNS records

- www: CNAME www → cname.vercel-dns.com
  - If using Cloudflare, temporarily disable orange cloud (proxy) until SSL stabilizes, then re-enable if desired.
- Apex (optional): ALIAS/ANAME @ → cname.vercel-dns.com or A 76.76.21.21
  - Apex is redirected to www by next.config.js (host=chiangmaiusedcar.com →
    [https://www.chiangmaiusedcar.com](https://www.chiangmaiusedcar.com), 301).

## 5) Verify after propagation

```powershell
./scripts/vercel-domain-check.ps1 -CustomDomain https://www.chiangmaiusedcar.com -DeploymentUrl https://example-deployment.vercel.app
```

- Expected: Both show JSON 200 with matching vercelUrl/ids for chiangmaiusedcar-next.

## 6) Post-checks (admin)

- Open [https://www.chiangmaiusedcar.com/admin/login](https://www.chiangmaiusedcar.com/admin/login)
- Login with your admin credentials
- Confirm dashboard loads and reserved badge behavior works on homepage

## Troubleshooting

- 404 HTML on /api/\_probe = domain mapped to wrong project or DNS still propagating
- 502/504 = temporary propagation or SSL; wait 5–10 minutes and retry
- CORS issues on API = ensure SITE_URL env is [https://www.chiangmaiusedcar.com](https://www.chiangmaiusedcar.com) (or
  unset to default)

## Rollback

- If needed, remove the domain from the new project and re-attach to the old one.
- No code changes are required to rollback; mapping is controlled in Vercel.

```text
Ownership: Nblues / chiangmaiusedcar-next
Updated: 2025-10-16
```
