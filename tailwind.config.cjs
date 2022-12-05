/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",],
  theme: {
    extend: {
      colors: {
        bg: '#121212',
        green: '#1ed760',
        text: '#a0a0a0',
      }
    },
  },
  plugins: [],
}
