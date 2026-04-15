/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryDark: "#1d4ed8",
        secondary: "#0ea5e9",
        slateBg: "#f8fafc",
        surface: "#ffffff",
        card: "#f8fafc",
        accent: "#38bdf8",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
};
