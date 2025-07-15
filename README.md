# Chiangmai Used Car – Next.js

## Setup
```bash
git clone <repo>
cd chiangmaiusedcar-next
cp .env.example .env.local   # ใส่ MAPS_API_KEY / Firebase จริง
npm install
npm run dev
```

## Deploy
* Vercel: `vercel --prod`
* Netlify: Connect repo → build command `npm run build`

### Shopify & Firebase
Storefront API + Firebase config อยู่ใน `.env.local` เท่านั้น ไม่เผยฝั่ง client.
