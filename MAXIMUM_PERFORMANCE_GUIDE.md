# Maximum System Performance Configuration

## การตั้งค่าใช้แรมเต็มระบบ (8GB) สำหรับประมวลผลและแก้ปัญหา

### 🚀 ไฟล์ที่อัปเดตแล้ว:

#### 1. package.json - Scripts

- `pnpm dev` - 6GB RAM (--max-old-space-size=6144)
- `pnpm build` - 8GB RAM (--max-old-space-size=8192)
- `pnpm dev:max` - 8GB RAM + Profiling
- `pnpm build:max` - 8GB RAM + Full optimization
- `pnpm start:max` - 6GB RAM for production

#### 2. next.config.js - Enhanced Performance

- Turbo mode: 2GB memory limit
- Worker threads: Enabled
- SWC transforms: Full optimization
- All CPU cores: Unlimited
- Maximum chunk sizes: 500KB
- Parallel processing: Maximum
- Filesystem caching: Enabled

#### 3. .env.local - System Resources

- Node.js heap: 8GB
- Semi-space: 1GB
- Thread pool: 16 threads
- Profiling: Enabled
- Source maps: Enabled
- All experimental features: Enabled

#### 4. Batch Scripts

- `start-dev-maximum.bat` - Maximum performance development
- `build-maximum.bat` - Maximum performance build

### 💾 การใช้หน่วยความจำ:

| โหมด        | RAM ใช้ | Features                       |
| ----------- | ------- | ------------------------------ |
| Development | 6-8GB   | Full profiling, HMR, debugging |
| Build       | 8GB     | Maximum optimization, analysis |
| Production  | 4-6GB   | Optimized runtime              |

### 🛠️ คำสั่งใหม่:

```bash
# Development with maximum RAM
pnpm dev:max

# Build with maximum performance
pnpm build:max

# Production with optimized RAM
pnpm start:max

# Batch scripts (Windows)
.\start-dev-maximum.bat
.\build-maximum.bat
```

### ⚡ Performance Features:

#### เปิดใช้งาน:

- ✅ Full heap profiling
- ✅ Memory analysis
- ✅ CPU profiling
- ✅ Bundle analysis
- ✅ Source maps
- ✅ Fast refresh
- ✅ Hot module replacement
- ✅ Turbo mode (2GB)
- ✅ Worker threads
- ✅ All CPU cores
- ✅ Filesystem caching
- ✅ Enhanced optimization

#### Browser Polyfills:

- crypto-browserify
- path-browserify
- os-browserify
- stream-browserify
- util, buffer, process

### 🎯 การใช้งาน:

1. **Development**: ใช้ `pnpm dev:max` สำหรับการพัฒนาที่ต้องการประสิทธิภาพสูงสุด
2. **Build**: ใช้ `pnpm build:max` สำหรับการ build ที่มีการวิเคราะห์และปรับปรุงแบบสมบูรณ์
3. **Production**: ใช้ `pnpm start:max` สำหรับการรันที่ปรับปรุงแล้ว

### 📊 Monitoring:

การตั้งค่านี้จะเปิดใช้งาน:

- Memory profiling reports
- CPU usage analysis
- Bundle size analysis
- Build performance metrics
- Runtime performance tracking

### ⚠️ หมายเหตุ:

- การตั้งค่านี้เหมาะสำหรับระบบที่มี RAM 8GB ขึ้นไป
- สำหรับระบบที่มี RAM น้อยกว่า ให้ลดค่า max-old-space-size ลง
- การใช้ทรัพยากรเต็มระบบจะช่วยในการประมวลผลและแก้ปัญหาได้อย่างมีประสิทธิภาพ
