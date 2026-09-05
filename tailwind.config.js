/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5162fa',
        dark: '#24262b',
        neutral: '#d6d9dd',
        light: '#f0f0f0',
      },
      fontFamily: {
        sans: ['Inter', 'San Francisco Text', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
