# Z-Index Hierarchy Fix

**Date**: 2025-10-12  
**Issue**: Multiple components using `z-50` causing overlap issues  
**Status**: ✅ Fixed

## Problem

Multiple components were using the same `z-index: 50`, causing potential overlapping issues:

- **Navbar**: `z-50` (sticky top)
- **SocialShareButtons**: `z-50` (fixed bottom-right) ⚠️ Conflict
- **PWAInstallPrompt Banner**: `z-50` (fixed bottom) ⚠️ Conflict
- **CookieConsent**: `z-50` (fixed bottom) ⚠️ Conflict
- **ImageGallery**: `z-50` (modal) ⚠️ Conflict
- **CacheDashboard**: `z-50` (fixed bottom-right) ⚠️ Conflict

This caused:
- Social share buttons overlapping with cookie consent
- PWA install banner competing with cookie consent
- Cache dashboard (dev only) overlapping with social buttons
- Modals not always appearing above other elements

## Solution

Created a proper **z-index hierarchy** in `tailwind.config.js`:

```javascript
zIndex: {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',        // Base UI elements
  60: '60',        // Sticky navbar
  70: '70',        // Cookie consent
  80: '80',        // Social share buttons
  90: '90',        // PWA install banner
  100: '100',      // Cache dashboard (dev only)
  modal: '9998',   // Image gallery modals
  overlay: '9999', // PWA install modal (highest)
}
```

## Changes Applied

### 1. Tailwind Config
**File**: `tailwind.config.js`
- Added custom z-index scale with semantic names
- Created clear hierarchy from 0 to 9999

### 2. Navbar
**File**: `components/Navbar.jsx`
- **Before**: `z-50`
- **After**: `z-60`
- **Reason**: Should be above base elements but below user interactions

### 3. Cookie Consent
**File**: `components/CookieConsent.jsx`
- **Before**: `z-50`
- **After**: `z-70`
- **Reason**: Important legal notice, should be above navbar

### 4. Social Share Buttons
**File**: `components/SocialShareButtons.jsx`
- **Before**: `z-50`
- **After**: `z-80`
- **Reason**: Interactive element, should be above cookie consent

### 5. PWA Install Banner
**File**: `components/PWAInstallPrompt.jsx`
- **Before**: `z-50` (banner)
- **After**: `z-90`
- **Reason**: Important user action, should be highly visible

### 6. PWA Install Modal
**File**: `components/PWAInstallPrompt.jsx`
- **Before**: `z-[9999]`
- **After**: `z-overlay`
- **Reason**: Full-screen overlay, must be on top of everything

### 7. Image Gallery Modal
**File**: `components/ImageGallery.jsx`
- **Before**: `z-50`
- **After**: `z-modal`
- **Reason**: Modal overlay, should be just below PWA modal

### 8. Cache Dashboard (Dev Only)
**File**: `components/CacheDashboard.jsx`
- **Before**: `z-50`
- **After**: `z-100`
- **Reason**: Development tool, should be always visible when debugging

## Visual Hierarchy (Bottom to Top)

```
z-50  │ Base UI elements
z-60  │ Sticky Navbar ← Always visible at top
z-70  │ Cookie Consent ← Legal notice at bottom
z-80  │ Social Share Buttons ← Bottom-right corner
z-90  │ PWA Install Banner ← Important prompt
z-100 │ Cache Dashboard ← Dev tools (only in development)
z-9998│ Image Gallery Modal ← Full-screen photo viewer
z-9999│ PWA Install Modal ← Highest priority overlay
```

## Benefits

1. **No Overlap**: Each component has its own layer
2. **Predictable**: Clear hierarchy from least to most important
3. **Maintainable**: Semantic names (z-modal, z-overlay) instead of magic numbers
4. **Accessible**: Important interactions (modals) always on top
5. **Flexible**: Easy to add new components in the right layer

## Testing

To verify the fix:

1. Open any page with multiple overlays
2. Check that:
   - ✅ Navbar stays at top
   - ✅ Cookie consent appears above navbar
   - ✅ Social buttons are clickable and visible
   - ✅ PWA banner doesn't hide behind anything
   - ✅ Image gallery modal covers everything
   - ✅ No elements overlap incorrectly

## Usage Guidelines

When adding new components:

- **Static content**: `z-10` to `z-40`
- **Sticky/Fixed UI**: `z-50` to `z-60`
- **Notifications**: `z-70` to `z-90`
- **Dev Tools**: `z-100`
- **Modals**: `z-modal` (9998)
- **Full Overlays**: `z-overlay` (9999)

## Rollback (if needed)

If this causes issues, you can revert by changing all components back to `z-50`, but this will reintroduce the overlap problems.

---

**Status**: ✅ All components updated with proper z-index hierarchy  
**Next**: Test on live site to ensure no visual regressions
