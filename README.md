# Chiangmai Used Car Next.js Setup

⚡ Production-ready car dealership website with **automatic deployment** to https://chiangmaiusedcar.com

## 🚀 Auto-Deployment Setup

✅ **Vercel Configuration:**
- **Production Branch:** `main`
- **Auto-deploy on push:** `ON`
- **Domain:** `chiangmaiusedcar.com`

```bash
git push origin main  # → Automatic production deployment! 🎯
```

## Quick Start

```bash
pnpm install        # install deps
pnpm dev           # local dev server
pnpm lint          # eslint check
pnpm type-check    # typescript check
pnpm build         # production build
pnpm start         # production server
```

## 🧪 Test Auto-Deployment

```bash
# Windows PowerShell
.\test-auto-deployment.ps1

# Linux/macOS
./test-auto-deployment.sh
```

## 🔄 Deployment Workflow

```
Push to main → Vercel Build → Deploy → chiangmaiusedcar.com updates
```

Husky runs `lint` and `type-check` before every commit. Push to **main** → Vercel auto‑deploys to production.
