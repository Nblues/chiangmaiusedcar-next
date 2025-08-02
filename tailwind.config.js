/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: { 
    extend: {
      colors: {
        // Primary brand colors (orange theme)
        primary: {
          50: '#fff7ed',   // Very light orange
          100: '#ffedd5',  // Light orange
          200: '#fed7aa',  // Lighter orange
          300: '#fdba74',  // Medium light orange
          400: '#fb923c',  // Medium orange
          500: '#f97316',  // Base orange (was orange-500)
          600: '#ea580c',  // Main brand orange (was orange-600)
          700: '#c2410c',  // Dark orange
          800: '#9a3412',  // Darker orange
          900: '#7c2d12',  // Very dark orange
        },
        // Secondary colors for different actions
        secondary: {
          50: '#f8fafc',   // Very light gray
          100: '#f1f5f9',  // Light gray - better contrast than gray-100
          200: '#e2e8f0',  // Medium light gray
          300: '#cbd5e1',  // Medium gray
          400: '#94a3b8',  // Gray
          500: '#64748b',  // Base gray
          600: '#475569',  // Dark gray - good for text
          700: '#334155',  // Darker gray
          800: '#1e293b',  // Very dark gray
          900: '#0f172a',  // Almost black
        },
        // Success/action colors (green for LINE, WhatsApp)
        success: {
          50: '#f0fdf4',   // Very light green
          100: '#dcfce7',  // Light green
          200: '#bbf7d0',  // Lighter green
          300: '#86efac',  // Medium light green
          400: '#4ade80',  // Medium green
          500: '#22c55e',  // Base green
          600: '#16a34a',  // Main green (LINE color)
          700: '#15803d',  // Dark green
          800: '#166534',  // Darker green
          900: '#14532d',  // Very dark green
        },
        // Info colors (blue for Facebook, social)
        info: {
          50: '#eff6ff',   // Very light blue
          100: '#dbeafe',  // Light blue
          200: '#bfdbfe',  // Lighter blue
          300: '#93c5fd',  // Medium light blue
          400: '#60a5fa',  // Medium blue
          500: '#3b82f6',  // Base blue
          600: '#2563eb',  // Main blue (Facebook color)
          700: '#1d4ed8',  // Dark blue
          800: '#1e40af',  // Darker blue
          900: '#1e3a8a',  // Very dark blue
        },
        // Text colors with proper contrast
        text: {
          primary: '#0f172a',    // Almost black - best contrast
          secondary: '#334155',  // Dark gray - good contrast
          muted: '#64748b',      // Medium gray - for less important text
          inverse: '#ffffff',    // White for dark backgrounds
        }
      },
      // Custom utilities for focus and hover states
      boxShadow: {
        'focus': '0 0 0 3px rgba(249, 115, 22, 0.3)', // Orange focus ring
        'focus-info': '0 0 0 3px rgba(37, 99, 235, 0.3)', // Blue focus ring
        'focus-success': '0 0 0 3px rgba(22, 163, 74, 0.3)', // Green focus ring
      }
    } 
  },
  plugins: [],
}
