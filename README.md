# 🚗 Chiangmai Used Car (ครูหนึ่งรถสวย)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://www.chiangmaiusedcar.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

> เว็บไซต์รถมือสองคุณภาพจากเชียงใหม่ | Next.js 14 + Shopify Headless CMS + Vercel

**Live Website**: [www.chiangmaiusedcar.com](https://www.chiangmaiusedcar.com)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

เว็บไซต์รถมือสองครูหนึ่งรถสวย เป็นแพลตฟอร์มออนไลน์สำหรับซื้อขายรถยนต์มือสองคุณภาพในเชียงใหม่
สร้างด้วยเทคโนโลยีที่ทันสมัยเพื่อประสบการณ์ผู้ใช้ที่ดีที่สุด

**Key Highlights:**

- ⚡ **Performance-First**: Core Web Vitals optimized
- 🎨 **Modern UI/UX**: Responsive design with Tailwind CSS
- 🔐 **Secure**: Environment-based secrets, SSO protection
- 📊 **Analytics**: Web Analytics & Speed Insights enabled
- 🤖 **Automated**: Dependabot + Renovate for dependency updates

---

## ✨ Features

---

## ✨ Features

### 🏠 Public Website

- 🚙 **Car Listings**: Browse quality used cars with detailed specifications
- 🔍 **Advanced Search**: Filter by brand, model, year, price, and more
- 📱 **Responsive Design**: Mobile-first, works perfectly on all devices
- 🖼️ **Image Gallery**: High-quality car photos with Shopify CDN
- 📝 **Contact Forms**: EmailJS integration for instant inquiries
- 🌐 **SEO Optimized**: Sitemaps, robots.txt, meta tags

### 🔐 Admin Dashboard

- 📊 **Analytics**: Real-time visitor stats and insights
- 🔑 **Secure Login**: Session-based authentication
- 🛠️ **Management Tools**: Car inventory, content management
- 📈 **SEO Tools**: Keyword checker, indexing status

### 🚀 Performance & Security

- ✅ **Core Web Vitals**: Optimized for speed and UX
- 🔒 **Environment Secrets**: No hardcoded credentials
- 🛡️ **Headers**: Security headers (CSP, X-Frame-Options, etc.)
- 📊 **Monitoring**: Vercel Analytics & Speed Insights

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 14.2.5](https://nextjs.org/) (Pages Router)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.x](https://tailwindcss.com/)
- **Fonts**: [@fontsource/prompt](https://fontsource.org/fonts/prompt) (Thai-optimized)

### Backend & CMS

- **Headless CMS**: [Shopify](https://www.shopify.com/) (Products with custom metafields)
- **Email**: [EmailJS](https://www.emailjs.com/) (Contact forms)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

### DevOps & Deployment

- **Hosting**: [Vercel](https://vercel.com/)
- **Package Manager**: [pnpm 10.x](https://pnpm.io/)
- **CI/CD**: GitHub Actions
- **Automation**: Dependabot + Renovate Bot

### Development Tools

- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Git Hooks**: Husky
- **Version Control**: Git + GitHub

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.19.0 or higher (LTS)
- **pnpm**: v10.0.0 or higher
- **Git**: Latest version

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nblues/chiangmaiusedcar-next.git
   cd chiangmaiusedcar-next
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env.local` file:

   ```env
   # Shopify
   SHOPIFY_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token

   # Site URLs
   SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # EmailJS (optional for local dev)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

   # Admin (optional)
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   SESSION_SECRET=your_random_secret_key
   ```

4. **Run development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Development

### Available Scripts

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
pnpm format       # Format code with Prettier
```

### Project Structure

```
chiangmaiusedcar-next/
├── .github/              # GitHub configurations
│   ├── workflows/        # CI/CD workflows
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── components/           # React components
├── lib/                  # Utilities and helpers
│   ├── shopify.js        # Shopify GraphQL client
│   └── blog.js           # Blog utilities
├── pages/                # Next.js pages (Pages Router)
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   └── cars/             # Car listing pages
├── public/               # Static assets
├── styles/               # Global CSS
├── docs/                 # Documentation
├── .editorconfig         # Editor configuration
├── .gitignore            # Git ignore rules
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # Contribution guidelines
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vercel.json           # Vercel deployment config
```

### Code Quality

This project follows international standards 2025:

- ✅ **Conventional Commits**: `feat:`, `fix:`, `docs:`, etc.
- ✅ **Semantic Versioning**: MAJOR.MINOR.PATCH
- ✅ **EditorConfig**: Consistent code formatting
- ✅ **ESLint**: Code linting
- ✅ **TypeScript**: Type safety
- ✅ **Husky**: Pre-commit hooks

---

## 📦 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect to Vercel**

   - Import repository to Vercel
   - Framework preset: Next.js
   - Root directory: `./`

2. **Configure Environment Variables**

   Add all variables from `.env.local` to Vercel Dashboard:

   - Settings → Environment Variables
   - Add for Production, Preview, and Development

3. **Deploy**

   ```bash
   git push origin master
   ```

   Vercel will automatically deploy on push to `master` branch.

### Manual Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

© 2025 Chiangmai Used Car (ครูหนึ่งรถสวย). All rights reserved.

This is proprietary software created exclusively for Chiangmai Used Car business.

**Proprietary Files:**

- `/pages/admin/*` - Admin dashboard system
- `/components/*` - Custom UI components
- `/lib/*` - Business logic and utilities

**Open Source Dependencies:** This project uses MIT-licensed open-source libraries (Next.js, React, Tailwind CSS, etc.)

---

## 🔗 Links

- **Website**: [www.chiangmaiusedcar.com](https://www.chiangmaiusedcar.com)
- **Repository**: [github.com/Nblues/chiangmaiusedcar-next](https://github.com/Nblues/chiangmaiusedcar-next)
- **Issues**: [Report a bug](https://github.com/Nblues/chiangmaiusedcar-next/issues/new?template=bug_report.md)
- **Security**: [Report security issue](SECURITY.md)

---

## 📞 Contact

For business inquiries or support:

- **Website**: https://www.chiangmaiusedcar.com
- **GitHub**: [@Nblues](https://github.com/Nblues)

---

<div align="center">
  Made with ❤️ in Chiang Mai, Thailand
</div>

### ระบบ Admin

- จัดการบทความ (CRUD)
- ระบบ Authentication (อ่านจาก env vars)
- API Dashboard
- ตรวจสอบสถานะระบบ

## การเข้าถึง Admin

### Development (Local)

- URL: `/admin`
- Username: `admin`
- Password: `changeme123`

ข้อมูล credentials จะถูกอ่านจาก `.env.local`:

```env
ADMIN_USERNAME=<YOUR_ADMIN_USERNAME>
ADMIN_PASSWORD=<YOUR_ADMIN_PASSWORD>
SESSION_SECRET=<RANDOM_32+_CHARS>
```

### Production (Vercel)

**⚠️ สำคัญ**: ต้องตั้งค่า Environment Variables บน Vercel ก่อน

1. เข้า Vercel Dashboard → Settings → Environment Variables
2. เพิ่ม `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`
3. Redeploy production

📖 **คู่มือครบถ้วน**: ดูที่ `VERCEL_ENV_QUICK_SETUP.md` หรือ `VERCEL_ENV_VARIABLES_REQUIRED.md`

🔍 **ตรวจสอบ env vars**: รัน `node scripts/check-vercel-env.mjs`

## โครงสร้างไฟล์

```text
├── pages/
│   ├── admin/          # ระบบจัดการหลังบ้าน
│   │   ├── index.jsx   # หน้าแรก Admin
│   │   ├── articles/   # จัดการบทความ
│   │   └── api-dashboard.jsx  # ตรวจสอบ API
│   ├── features/       # หน้าบทความ
│   └── api/           # API endpoints
├── components/        # React components
├── lib/              # Utilities และ helpers
└── styles/           # CSS และ Tailwind
```

## Development Notes

- ใช้ `pnpm` สำหรับจัดการ packages
- Husky runs `lint` และ `type-check` ก่อน commit
- Push ไป **main** → GitHub Action ตรวจสอบ build → Vercel auto-deploy
- ข้อมูลบทความเก็บใน localStorage สำหรับ demo

## การพัฒนา

ทีมพัฒนา: Chiangmai Used Car Development Team

สำหรับคำถามเกี่ยวกับโค้ด กรุณาติดต่อผ่านทางเว็บไซต์

---

**หมายเหตุ**: โค้ดทั้งหมดในโปรเจกต์นี้เป็นผลงานต้นฉบับที่พัฒนาโดยทีมงาน
ไม่มีการคัดลอกหรือใช้โค้ดจากแหล่งอื่นที่อาจมีปัญหาลิขสิทธิ์
