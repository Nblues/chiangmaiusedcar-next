# Critical Font URLs - Prompt Thai (เฉพาะที่จำเป็น)

## High Priority Fonts (ควร preload):

### Prompt Regular (400) - Thai Unicode Range

```
https://fonts.gstatic.com/s/prompt/v11/-W__XJnvUD7dzB26dAOiEnxZ1yzwlkgQ.woff2
```

### Prompt SemiBold (600) - Thai Unicode Range

```
https://fonts.gstatic.com/s/prompt/v11/-W_8XJnvUD7dzB26dAMi8w9jf9wlkfGQkQ.woff2
```

### Prompt Bold (700) - Thai Unicode Range

```
https://fonts.gstatic.com/s/prompt/v11/-W_9XJnvUD7dzB26dANCig16cwWqWfLZBw.woff2
```

## Critical Chain Analysis:

**ปัญหาเดิม:**

- Critical Path: 457ms สำหรับ font loading
- ไม่มี preconnect ทำให้ DNS lookup + TCP handshake เสียเวลา

**การแก้ไข:**

1. **Preconnect** fonts.googleapis.com และ fonts.gstatic.com
2. **Preload** font files ที่สำคัญที่สุด (Regular + SemiBold)
3. **Inline CSS** สำหรับ @font-face declarations
4. **font-display: swap** เพื่อป้องกัน FOIT (Flash of Invisible Text)

## Performance Impact:

### Before:

- DNS Lookup: ~20ms
- TCP Connect: ~40ms
- SSL Handshake: ~60ms
- Font Download: ~300ms+
- **Total: 420ms+**

### After:

- Preconnect eliminates DNS + TCP delay
- Preload starts download immediately
- Inline CSS prevents additional request
- **Expected reduction: 200-300ms**

## Implementation Strategy:

### Critical Fonts Only:

- Prompt Regular (400) - หลักสำหรับเนื้อหา
- Prompt SemiBold (600) - สำหรับหัวข้อสำคัญ

### Non-Critical (Lazy Load):

- Prompt Light (300)
- Prompt Medium (500)
- Prompt Bold (700) - ยกเว้นหน้าที่จำเป็น

### Fallback Strategy:

```css
font-family: 'Prompt', 'Sarabun', 'Leelawadee UI', sans-serif;
```

## Testing Commands:

```bash
# ทดสอบ Critical Path
curl -w "@curl-format.txt" -o /dev/null -s "https://fonts.gstatic.com/s/prompt/v11/-W__XJnvUD7dzB26dAOiEnxZ1yzwlkgQ.woff2"

# ทดสอบ DNS resolution
nslookup fonts.gstatic.com

# ทดสอบ connection
curl -w "DNS: %{time_namelookup}s, Connect: %{time_connect}s, Total: %{time_total}s\n" -o /dev/null -s https://fonts.gstatic.com/
```

## WebPageTest Analysis:

- **Start Render** should improve by 200-300ms
- **Speed Index** should improve significantly
- **LCP** will be faster with non-blocking fonts

## Next.js Specific:

- Place preconnect in `_document.jsx`
- Inline critical @font-face in `<style>` tag
- Use `font-display: swap` consistently
- Subset fonts to Thai characters only when possible
