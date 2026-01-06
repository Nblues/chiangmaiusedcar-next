/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  // Safelist for dynamic classes that might be purged incorrectly
  safelist: [
    'text-shadow',
    'text-shadow-lg',
    'text-shadow-xl',
    'form-input',
    'form-select',
    'form-label',
    'form-section-government',
    'form-section-company',
    'btn-primary',
    'btn-secondary',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'Kanit', 'Sarabun', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '475px',
        '3xl': '1600px',
      },
      zIndex: {
        // Z-index hierarchy to prevent overlap
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50', // Base UI elements
        60: '60', // Sticky navbar
        70: '70', // Cookie consent
        80: '80', // Social share buttons
        90: '90', // PWA install banner
        100: '100', // Cache dashboard (dev only)
        modal: '9998', // Image gallery modals
        overlay: '9999', // PWA install modal (highest)
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
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
        // Accent used for primary CTAs. Adjusted to a darker orange to meet
        // WCAG contrast when used with white text on CTA buttons/badges.
        accent: {
          DEFAULT: '#bf360c', // deeper orange (accessible with white)
          50: '#fff2ec',
          100: '#ffd9c9',
          200: '#ffbfa0',
          300: '#ff9b6d',
          400: '#f77a42',
          500: '#bf360c', // same as DEFAULT
          600: '#a6310b',
          700: '#8c2a0a',
          800: '#6f2107',
          900: '#4e1705',
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
          // use the new accent as form border to keep the theme consistent
          border: '#bf360c',
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
          // align badge 'cheap' with accessible accent
          cheap: '#bf360c',
          new: '#ff5252',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-shadow': {
          'text-shadow': '2px 2px 4px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-lg': {
          'text-shadow': '3px 3px 6px rgba(0, 0, 0, 0.9), 1px 1px 2px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-xl': {
          'text-shadow': '4px 4px 8px rgba(0, 0, 0, 0.9), 2px 2px 4px rgba(0, 0, 0, 0.8)',
        },
        // Form utilities
        '.form-input': {
          'border-width': '1px',
          'border-color': theme('colors.form.border'),
          'background-color': theme('colors.form.bg'),
          'border-radius': '0.375rem',
          padding: '0.5rem 0.75rem',
          '&:focus': {
            outline: 'none',
            'border-color': theme('colors.form.focus'),
            ring: '2px',
            'ring-color': theme('colors.primary.300'),
          },
        },
        '.form-select': {
          'border-width': '1px',
          'border-color': theme('colors.form.border'),
          'background-color': theme('colors.form.bg'),
          'border-radius': '0.375rem',
          padding: '0.5rem 2rem 0.5rem 0.75rem',
        },
        '.form-label': {
          'font-weight': '500',
          color: theme('colors.gray.700'),
          'margin-bottom': '0.25rem',
        },
        // Section-specific form styles
        '.form-section-government': {
          'background-color': theme('colors.primary.50'),
          border: '1px solid',
          'border-color': theme('colors.primary.200'),
          padding: '1.5rem',
          'border-radius': '0.5rem',
        },
        '.form-section-company': {
          'background-color': theme('colors.accent.50'),
          border: '1px solid',
          'border-color': theme('colors.accent.200'),
          padding: '1.5rem',
          'border-radius': '0.5rem',
        },
      });
    },
  ],
};
