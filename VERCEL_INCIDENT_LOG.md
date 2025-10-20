# Vercel Infrastructure Incident Log

## 📅 Date: October 20, 2025

### 🔴 Issue: Elevated errors in iad1 region

**Timeline (UTC / Thailand Time):**

- **07:33 UTC (14:33 ICT)** - Investigating: Issue detected
- **07:40 UTC (14:40 ICT)** - Continuing investigation
- **07:50 UTC (14:50 ICT)** - Continuing investigation
- **08:03 UTC (15:03 ICT)** - **Identified**: Multiple services affected
  - CDN traffic re-routed from iad1 to healthy region
  - Builds re-routed
- **08:45 UTC (15:45 ICT)** - **Update**: Seeing recovery across services, CDN traffic is healthy

---

## 📊 Impact on Our Project

### Affected Services:

- ✅ Git Integration webhook (working - webhook ID: 576273275)
- ❌ Deployments (failing with Error status)
- ❌ Vercel API (502/504 timeouts)
- ❌ Build process (failed after 3-9s)

### Our Actions Taken:

1. ✅ Created Vercel webhook manually (ID: 576273275)
2. ✅ Confirmed auto-deploy triggered by git push
3. ⏳ Waiting for Vercel infrastructure recovery

---

## 🎯 Next Steps

### When Vercel announces "Resolved":

1. Test auto-deploy with empty commit
2. Verify deployment succeeds
3. Test toggle button fix in production

### Commands to Run:

```powershell
# 1. Check Vercel status
vercel ls

# 2. If deployments are working, trigger new deploy
git commit --allow-empty -m "test: verify deployment after Vercel incident recovery"
git push origin master

# 3. Wait 1-2 minutes, then check
vercel ls

# 4. Open latest deployment
Start-Process "https://chiangmaiusedcar-setup-chiangmaiusedcars-projects.vercel.app"
```

---

## 📝 Notes

- **Incident Region**: iad1 (US East, Virginia)
- **Our Project Region**: Likely affected by iad1 outage
- **Webhook Status**: ✅ Working (auto-deploy triggered successfully)
- **Build Status**: ❌ Failing due to infrastructure issues
- **Toggle Button Fix**: ✅ Code ready (commit 06544c3), waiting to deploy

---

## 🔗 References

- Vercel Status Page: https://www.vercel-status.com
- Our Project: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup
- Repository: https://github.com/Nblues/chiangmaiusedcar-next

---

## 🔴 Latest Update: Force Deploy via CLI

**Deployment**: c41h6ecsm (via `vercel --prod --force`)

- **Region**: pdx1 (Portland, USA West) - Successfully bypassed iad1
- **Build Time**: 6 minutes
- **Result**: ❌ "An unexpected error happened when running this build"
- **Root Cause**: Vercel internal infrastructure issue (not code problem)
- **Evidence**: Local build succeeds ✅, Vercel build fails ❌

### Conclusion:

- ✅ Code is working (local build successful)
- ✅ Webhook configured (ID: 576273275)
- ✅ Auto-deploy enabled
- ❌ Vercel build infrastructure still experiencing issues
- ⏳ Need to wait for Vercel to fully resolve incident

---

**Last Updated**: Oct 20, 2025 - 16:18 ICT (09:18 UTC) **Status**: � Vercel Infrastructure Still Failing
