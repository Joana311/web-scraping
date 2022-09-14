const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/layouts/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/components/ExerciseSummary/**/*.{ts,tsx}",
    "./src/containers/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "!./src/components/MuscleHeatMap.tsx"
  ],
  theme: {
    // colors: {},
    ripple: (theme) => ({
      colors: theme("colors")
    }),
    extend: {
      backgroundColor: {
        primary: "#08080C",
        // primary: "#000000",
        secondary: "#262626",
        card: "#2d2c30",
        "card-dark": "#1b1c1f",
        "card-secondary": "#544c50",
        "card-secondary-dark": "#3f3b40",
        "secondary-dark": "#131313",
        dash: "#3F3B40"
      },

      colors: {
        dash: "#3F3B40",
        "card-dark": "#1b1c1f",
        "bg.primary": "#08080C",
        blue: "#2196f3", //2196f3
        theme: "#8b66e1",
        "blue-light": "#64b5f6",
        "blue-dark": "#0d47a1",
        "text.primary": "#fff",
        "text.secondary": "#898A8A",
        "bg.secondary": "#262626"
      }
    }
  },
  variants: {
    animation: ({ after }) => after(["motion-safe", "motion-reduce"])
  },
  plugins: [
    require("tailwindcss-ripple")(),
    plugin(function ({ addVariant }) {
      // html selector
      addVariant("child-checked", "[&:has(>input[type=radio]:checked)]");
    })
  ]
};
