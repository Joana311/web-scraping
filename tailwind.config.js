/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/layouts/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/containers/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}"
  ],
  theme: {
    // colors: {},
    extend: {
      backgroundColor: {
        primary: "#000",
        secondary: "#262626"
      },
      colors: {
        blue: "#2196f3",
        "blue-light": "#64b5f6",
        "blue-dark": "#0d47a1",
        "text.primary": "#fff",
        "text.secondary": "#898A8A"
      }
    }
  },
  plugins: []
};
