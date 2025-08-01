/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        prompt: [
          "Prompt",
          "Kanit",
          "Sarabun",
          "sans-serif"
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#1a237e",   // Modern Blue (main)
        },
        accent: {
          DEFAULT: "#ff9800",   // Vivid Orange (accent)
        },
        black: {
          DEFAULT: "#181818",   // Elegant black
        },
        white: {
          DEFAULT: "#fff",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        gold: {
          DEFAULT: "#ffd700",
          50: "#fff9e6",
          100: "#fff3bf",
          200: "#ffe066",
          300: "#ffd700",
          400: "#ffca2c",
          500: "#ffb800",
          600: "#ffa600",
          700: "#e6a800",
          800: "#cc9900",
          900: "#b38f00",
        },
        success: {
          DEFAULT: "#4caf50",
          50: "#e7fbe8",
          100: "#c6f6d5",
          200: "#a0eac1",
          300: "#81dba5",
          400: "#65c887",
          500: "#4caf50",
          600: "#388e3c",
          700: "#27632a",
          800: "#1b421b",
          900: "#102910",
        },
        brand: {
          50: "#ede7f6",
          100: "#d1c4e9",
          200: "#b39ddb",
          300: "#9575cd",
          400: "#7e57c2",
          500: "#673ab7",
          600: "#5e35b1",
          700: "#512da8",
          800: "#4527a0",
          900: "#311b92",
        }
      },
    },
  },
  plugins: [],
};
