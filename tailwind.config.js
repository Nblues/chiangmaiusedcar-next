/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'Kanit', 'Sarabun', 'sans-serif'],
      },
      colors: {
        // สีหลัก
        primary: {
          DEFAULT: '#1a237e', // น้ำเงินเข้ม
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e', // same as DEFAULT
        },
        accent: {
          DEFAULT: '#ff9800', // ส้มสด
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800', // same as DEFAULT
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },
        white: '#fff',
        black: '#181818',
        // ทองใช้เน้น SEO/UX/CTA
        gold: {
          DEFAULT: '#ffd700',
          50: '#fffbe6',
          100: '#fff3bf',
          200: '#ffe066',
          300: '#ffd700', // same as DEFAULT
          400: '#ffca2c',
          500: '#ffb800',
          600: '#ffa600',
          700: '#e6a800',
          800: '#cc9900',
          900: '#b38f00',
        },
        // เทา/พื้นหลัง/ฟอร์ม
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // สีฟอร์ม input border
        form: {
          bg: '#fff',
          border: '#ff9800',
          focus: '#1a237e',
        },
        // ปุ่ม Success/Error
        success: '#4caf50',
        error: '#ff5252',
        // Social (สีแท้แบรนด์)
        facebook: '#1877f3',
        line: '#06c755',
        tiktok: '#000000',
        youtube: '#ff0000',
        x: '#14171a', // X/Twitter
        // Badge สีพิเศษ
        badge: {
          free: '#06c755',
          cheap: '#ff9800',
          new: '#ff5252',
        },
      },
    },
  },
  plugins: [],
};
