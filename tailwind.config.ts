import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Deep navy / charcoal surfaces
        ink: {
          950: "#0a0a1a",
          900: "#0d0d1f",
          850: "#111126",
          800: "#16162e",
          750: "#1c1c38",
          700: "#242444",
          600: "#323256",
        },
        // HVAC "heat" accent — orange to red
        ember: {
          300: "#ffb27a",
          400: "#ff9d4d",
          500: "#ff7a18",
          600: "#f9542d",
          700: "#e1341e",
        },
      },
      boxShadow: {
        ember: "0 0 40px -8px rgba(249, 84, 45, 0.45)",
        "ember-lg": "0 0 80px -12px rgba(249, 84, 45, 0.55)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "float-up": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "10%, 90%": { opacity: "0.5" },
          "100%": { transform: "translateY(-110vh)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
