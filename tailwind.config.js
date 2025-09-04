/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Wallet App Theme Colors
        wallet: {
          bg: "#222222", // Main background
          card: "#2E2E31", // Card backgrounds
          accent: "#FF2C55", // Primary accent (pink/red)
          divider: "#434447", // Dividers and borders
          text: {
            primary: "#EFF0F4", // Primary text
            secondary: "#E3E4E9", // Secondary text
            muted: "#9E9FA6", // Muted text
          },
          switch: {
            track: {
              active: "#FF2C55", // Switch track when active
              inactive: "#434447", // Switch track when inactive
            },
            thumb: {
              active: "#FFFFFF", // Switch thumb when active
              inactive: "#9E9FA6", // Switch thumb when inactive
            },
          },
        },
      },
    },
  },
  plugins: [],
};
