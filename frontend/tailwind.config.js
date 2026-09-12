/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        supreme: {
          navy: '#001f3f',
          dark: '#0a193c',
          deep: '#003264',
          blue: '#007bff',
          cyan: '#00c6ff',
          gold: '#f1910c',
          amber: '#ffc107',
          ice: '#eef5ff',
          bg: '#f5f7fb',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#007bff', // Updated primary accent to electric blue
          600: '#0069d9',
          700: '#005cbb',
          800: '#003264',
          900: '#001f3f',
        },
        solar: {
          orange: '#f5821f',
          dark: '#0a193c',
          navy: '#001f3f',
          blue: '#007bff',
          cyan: '#00c6ff',
          gold: '#f1910c',
          slate: '#1e293b',
          green: '#16a34a',
        }
      }
    },
  },
  plugins: [],
}
