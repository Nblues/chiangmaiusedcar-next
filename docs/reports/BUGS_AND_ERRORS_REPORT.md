# Bugs and Errors Summary Report

**Date**: 2025-10-12  
**Status**: 🔍 Found 4 categories of issues

---

## 🚨 Critical Issues (Affecting Functionality)

### 1. Jest Worker Error - Car Detail Pages

**Error Message:**

```
⨯ Error: Jest worker encountered 2 child process exceptions, exceeding retry limit
page: '/car/mitsubishi-pajero-2-5-gt-auto-2wd-2013'
```

**Impact:**

- ❌ Some car detail pages return 500 error
- ❌ Affects: `/car/[handle]` dynamic routes
- 🔍 Scope: Development server (production status unknown)

**Suspected Cause:**

- Next.js image optimization worker crash
- Possible memory issue with image processing
- Worker pool exhaustion

**Suggested Fix:**

1. Check image sizes (too large?)
2. Review Next.js image optimization config
3. Increase worker memory limit
4. Add error boundaries

---

## ⚠️ Warnings (Non-blocking but should fix)

### 2. React fetchPriority Warning

**Warning:**

```
Warning: React does not recognize the `fetchPriority` prop on a DOM element.
Spell it as lowercase `fetchpriority` instead.
```

**Location:** `pages/_document.jsx` or `pages/car/[handle].jsx`

**Impact:**

- ⚠️ Console warning (development + production)
- 🔍 Does not break functionality
- 📊 SEO/Performance: Still works but uses non-standard prop

**Fix:**

```jsx
// Before:
<link ... fetchPriority="high" />

// After:
<link ... fetchpriority="high" />
```

---

## 🟡 Code Quality Issues (ESLint)

### 3. SocialShareButtons.jsx

**Issue A: Unexpected console statement**

```javascript
// Line 48
console.error('Copy failed:', err);
```

**Fix:**

```javascript
// Use conditional logging or remove
if (process.env.NODE_ENV === 'development') {
  console.error('Copy failed:', err);
}
```

**Issue B: gtag not defined**

```javascript
// Line 64
gtag('event', 'share', { ... });
```

**Fix:**

```javascript
// Option 1: Add check
if (typeof gtag !== 'undefined') {
  gtag('event', 'share', { ... });
}

// Option 2: Add ESLint comment
// eslint-disable-next-line no-undef
gtag('event', 'share', { ... });
```

---

### 4. CacheDashboard.jsx

**Issue A: Unused error variable**

```javascript
// Line 38
} catch (error) {
  // error not used
}
```

**Fix:**

```javascript
} catch {
  // No need to catch error if not using it
}
```

**Issue B: Lexical declarations in case blocks**

```javascript
// Lines 52, 53, 59, 69
case 'action':
  const isDev = ...;  // ❌ Not allowed
  const swFile = ...; // ❌ Not allowed
```

**Fix:**

```javascript
case 'action': {
  const isDev = ...;  // ✅ Wrapped in block
  const swFile = ...;
  break;
}
```

---

### 5. TypeScript Configuration

**Issue: baseUrl deprecated**

```json
// tsconfig.json line 29
"baseUrl": ".",
```

**Warning:**

```
Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0.
```

**Fix Option 1: Add ignoreDeprecations**

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": "."
  }
}
```

**Fix Option 2: Use paths instead**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "~/*": ["./*"]
    }
  }
}
```

---

## 📝 Markdown Linting Issues (Non-functional)

### 6. Documentation Files

**Files Affected:**

- `WEBSOCKET_HMR_FIX.md`
- `ZINDEX_HIERARCHY_FIX.md`
- `FACEBOOK_BROWSER_AUDIT_2025.md`
- `LINE_IMAGE_CACHE_FIX.md`

**Issues:**

- MD040: Fenced code blocks missing language
- MD022: Headings not surrounded by blank lines
- MD032: Lists not surrounded by blank lines
- MD026: Trailing punctuation in headings
- MD031: Fenced code blocks not surrounded by blank lines

**Impact:** ✅ None - purely cosmetic

**Fix:** (Optional - for clean markdown)

- Add language to code blocks: ` ```javascript`
- Add blank lines around lists
- Remove trailing `:` from headings

---

## 📊 Issue Summary

| Priority | Issue                   | Files                    | Impact          | Status       |
| -------- | ----------------------- | ------------------------ | --------------- | ------------ |
| 🔴 P0    | Jest Worker Error       | car/[handle]             | 500 errors      | ❌ Not fixed |
| 🟡 P1    | fetchPriority warning   | \_document, car/[handle] | Console warning | ❌ Not fixed |
| 🟢 P2    | ESLint - console.error  | SocialShareButtons       | Code quality    | ❌ Not fixed |
| 🟢 P2    | ESLint - gtag undefined | SocialShareButtons       | Code quality    | ❌ Not fixed |
| 🟢 P2    | ESLint - unused error   | CacheDashboard           | Code quality    | ❌ Not fixed |
| 🟢 P2    | ESLint - case blocks    | CacheDashboard           | Code quality    | ❌ Not fixed |
| 🔵 P3    | TypeScript deprecated   | tsconfig.json            | Future TS 7.0   | ❌ Not fixed |
| ⚪ P4    | Markdown linting        | \*.md files              | Cosmetic        | ❌ Not fixed |

---

## 🎯 Recommended Fix Order

### Phase 1: Critical (Do First)

1. ✅ **Jest Worker Error** - Fix 500 errors on car pages
2. ✅ **fetchPriority** - Simple prop name change

### Phase 2: Code Quality (Do Soon)

3. ✅ **SocialShareButtons** - Clean up console/gtag
4. ✅ **CacheDashboard** - Fix case blocks
5. ✅ **TypeScript** - Add ignoreDeprecations or migrate

### Phase 3: Optional (Do Later)

6. ⚪ **Markdown** - Clean up formatting (low priority)

---

## 🔧 Quick Fix Commands

### Run Lint

```bash
pnpm lint
```

### Run Type Check

```bash
pnpm type-check
```

### Run Build (test for production errors)

```bash
pnpm build
```

---

## 📈 Expected Results After Fixes

### Before:

- ❌ Jest worker crashes on some car pages
- ⚠️ fetchPriority warning in console
- 🟡 ESLint shows 7+ errors
- 📝 Markdown linting shows 50+ warnings

### After:

- ✅ All car pages load successfully
- ✅ No React warnings in console
- ✅ ESLint clean (0 errors)
- ✅ TypeScript future-proof
- ✅ Clean markdown (optional)

---

## 🚀 Next Steps

**Ready to fix?** Choose priority:

1. **Fix all critical issues now** (Jest + fetchPriority)
2. **Fix all ESLint issues** (Code quality)
3. **Fix everything** (Complete cleanup)
4. **Skip for now** (Continue development)

---

**Status**: 📋 Ready for fixes  
**Total Issues**: 8 categories (1 critical, 1 warning, 5 code quality, 1 cosmetic)
