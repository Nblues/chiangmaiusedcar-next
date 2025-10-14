# 🎯 Admin Overlay (ม่านดำ) Fix - October 13, 2025

## ปัญหาที่พบ

หน้า Admin Dashboard มีม่านดำจางๆบังอยู่ ทำให้ใช้งานไม่สะดวก

## สาเหตุ

**PWAInstallPrompt component** ถูกโหลดในทุกหน้า (รวมถึงหน้า admin) ผ่าน `pages/_app.jsx`

- PWAInstallPrompt สร้าง modal overlay พร้อม `bg-black bg-opacity-50` และ `z-overlay` (9999)
- Modal นี้ออกแบบมาสำหรับหน้า public เพื่อแนะนำให้ติดตั้ง PWA
- แต่ในหน้า admin ไม่จำเป็นต้องมี PWA prompt, Cookie Consent, Navbar, Footer

## การแก้ไข ✅

### 1. แก้ไข `pages/_app.jsx`

เพิ่มการตรวจสอบว่าเป็นหน้า admin หรือไม่ และใช้ layout แยก:

```javascript
// Check if this is an admin page
const isAdminPage =
  Component.displayName?.includes('Admin') ||
  (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin'));

// Check if page has a custom layout
const getLayout =
  Component.getLayout ||
  (page => {
    // Admin pages get minimal layout (no Navbar, Footer, PWA prompts)
    if (isAdminPage) {
      return (
        <main id="main" role="main">
          {page}
        </main>
      );
    }

    // Regular pages get full layout with Navbar, Footer, etc.
    return (
      <>
        <ClientOnly fallback={...}><Navbar /></ClientOnly>
        <main id="main" role="main">{page}</main>
        <ClientOnly><Footer /></ClientOnly>
        <ClientOnly><Suspense fallback={...}><CookieConsent /></Suspense></ClientOnly>
        <ClientOnly><Suspense fallback={...}><PWAInstallPrompt /></Suspense></ClientOnly>
      </>
    );
  });
```

### 2. เพิ่ม `displayName` ใน Admin Pages

**pages/admin/login.jsx:**

```javascript
function AdminLogin() {
  // ... existing code
}

AdminLogin.displayName = 'AdminLogin';
export default AdminLogin;
```

**pages/admin/dashboard.jsx:**

```javascript
function AdminDashboard() {
  // ... existing code
}

AdminDashboard.displayName = 'AdminDashboard';
export default AdminDashboard;
```

## ผลลัพธ์ 🎉

### ✅ หน้า Admin (Clean Layout)

- ❌ ไม่มี Navbar
- ❌ ไม่มี Footer
- ❌ ไม่มี PWA Install Prompt (ม่านดำ)
- ❌ ไม่มี Cookie Consent
- ✅ เฉพาะเนื้อหา Admin Dashboard เท่านั้น

### ✅ หน้า Public (Full Layout)

- ✅ Navbar พร้อม navigation
- ✅ Footer พร้อม social links
- ✅ PWA Install Prompt สำหรับ mobile users
- ✅ Cookie Consent สำหรับ GDPR compliance

## ประโยชน์

1. **UX ดีขึ้น**: Admin dashboard สะอาด ไม่มี overlay บัง
2. **Performance ดีขึ้น**: หน้า admin ไม่โหลด components ที่ไม่จำเป็น (Navbar, Footer, PWA)
3. **Security**: แยก admin layout ชัดเจน ไม่ปะปนกับ public layout
4. **Maintainability**: ง่ายต่อการเพิ่ม admin pages ใหม่ ใส่ `displayName` ก็ใช้งานได้เลย

## Test Verification ✅

### Admin Pages

- ✅ http://localhost:3000/admin/login - Clean, no overlay
- ✅ http://localhost:3000/admin/dashboard - Clean, no overlay

### Public Pages

- ✅ http://localhost:3000/ - Full layout with Navbar, Footer, PWA prompt
- ✅ http://localhost:3000/all-cars - Full layout
- ✅ http://localhost:3000/contact - Full layout

## Files Changed

1. `pages/_app.jsx` - เพิ่มการตรวจสอบ admin page และแยก layout
2. `pages/admin/login.jsx` - เพิ่ม `displayName = 'AdminLogin'`
3. `pages/admin/dashboard.jsx` - เพิ่ม `displayName = 'AdminDashboard'`

## สรุป

ปัญหาม่านดำบังหน้า admin **แก้ไขสำเร็จแล้ว** ✅

ทำงานโดยการแยก layout สำหรับหน้า admin ให้ไม่โหลด PWAInstallPrompt และ components อื่นๆ ที่ไม่จำเป็น พร้อมใช้งานได้เลย!
🎉

---

**Date:** October 13, 2025  
**Status:** ✅ Resolved  
**Tested:** ✅ Verified on localhost:3000
