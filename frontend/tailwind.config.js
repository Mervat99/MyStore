/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0B0B0F",
        card: "#1A1A22",
        ink: "#F5F5F7",
        muted: "#9A9AA2",
        accent: {
          DEFAULT: "#818CF8",
          dark: "#6366F1",
          light: "#1E1B4B",
        },
        line: "#2A2A33",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}