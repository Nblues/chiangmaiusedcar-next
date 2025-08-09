# 📊 Vercel Deployment Status Checker

## 🔍 Manual Check Commands

### 1. Git Status
```bash
git status                    # ตรวจสอบ local changes
git log --oneline -10        # ดู commits ล่าสุด 10 รายการ
```

### 2. Vercel CLI Status
```bash
vercel --version             # ตรวจสอบ Vercel CLI
vercel projects ls           # ดูรายการโปรเจค
vercel deployments ls        # ดูรายการ deployments ล่าสุด
```

### 3. Domain Status
```bash
curl -I https://chiangmaiusedcar.com    # ตรวจสอบ HTTP headers
ping chiangmaiusedcar.com               # ตรวจสอบ DNS resolution
```

---

## 🌐 Web-based Checks

### 1. Vercel Dashboard
- URL: https://vercel.com/dashboard
- โปรเจค: `chiangmaiusedcar-next`
- ดูใน **Deployments** tab

### 2. Domain Performance
- URL: https://chiangmaiusedcar.com
- Performance: https://pagespeed.web.dev/
- SSL Check: https://www.ssllabs.com/ssltest/

### 3. SEO & Analytics
- Google Search Console
- Google Analytics: GA ID `G-81DK266FDR`
- Schema Markup Test

---

## 🚨 Common Deployment Issues

### Build Errors
```bash
# Local test before push
pnpm build               # ต้องผ่านก่อน push
pnpm type-check         # ตรวจสอบ TypeScript errors
pnpm lint               # ตรวจสอบ ESLint errors
```

### Environment Variables Missing
- ตรวจสอบใน Vercel Dashboard → Settings → Environment Variables
- ต้องมีครบ 8 ตัวแปรตาม `vercel.json`

### DNS Issues
- รอ DNS propagation (24-48 ชั่วโมง)
- ใช้ DNS checker: https://dnschecker.org/

---

## ✅ Deployment Success Indicators

### 1. Vercel Dashboard
- ✅ Status: **Ready**
- ✅ Build: **Completed successfully**
- ✅ Duration: **< 3 minutes**

### 2. Website Check
- ✅ https://chiangmaiusedcar.com loads
- ✅ Car listings display
- ✅ Search functionality works
- ✅ Contact forms work

### 3. Performance
- ✅ Core Web Vitals pass
- ✅ Images loading properly
- ✅ Mobile responsive

---

## 🔄 Quick Rollback

หากมีปัญหา:

```bash
# Option 1: Vercel Dashboard Rollback
# ไปที่ Deployments → เลือก deployment ที่ดี → "Promote to Production"

# Option 2: Git Rollback
git revert HEAD                    # ยกเลิก commit ล่าสุด
git push origin main              # push เพื่อ trigger deployment ใหม่
```

---

## 📱 Monitoring Setup

### Real-time Alerts
1. **Vercel Notifications**
   - Email alerts for failed deployments
   - Webhook integrations (Slack/Discord)

2. **Uptime Monitoring**
   - UptimeRobot: https://uptimerobot.com
   - Pingdom: https://www.pingdom.com

3. **Performance Monitoring**
   - Vercel Analytics (built-in)
   - Google PageSpeed Insights
   - Core Web Vitals monitoring

---

## 📞 Emergency Contact

หากเว็บไซต์ล่มหรือมีปัญหาเร่งด่วน:

- **Vercel Support**: https://vercel.com/support
- **DNS Issues**: ติดต่อ Domain Registrar
- **Emergency Rollback**: ใช้ Vercel Dashboard
