# Chiangmai Used Car Next.js Setup

Minimal boilerplate with ESLint, TypeScript, Husky pre‑commit hook, and GitHub Action CI.

## Quick Start

```bash
npm install         # install deps
npm run dev         # local dev
npm run lint        # eslint check
npm run type-check  # ts syntax check
npm run build       # production build
```

Husky runs `lint` and `type-check` before every commit.
Push to **main** → GitHub Action verifies build → Vercel auto‑deploys.
