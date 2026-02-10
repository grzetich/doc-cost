/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          0: "#ffffff",
          1: "#f8f9fa",
          2: "#f0f1f3",
          3: "#e5e7eb",
        },
        accent: {
          green: "#16a34a",
          amber: "#d97706",
          red: "#dc2626",
          blue: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};
