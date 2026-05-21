import type { Config } from "tailwindcss";

/* Design system ported 1:1 from datastaq-hvac (DataStaq AI). */
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        syne: ["var(--font-jakarta)", "sans-serif"],
      },
      colors: {
        ds: {
          bg: "#F5F0E1",
          surface: "#FAF6EA",
          card: "#FFFFFF",
          border: "rgba(0,0,0,0.15)",
          primary: "#C9A227",
          "primary-light": "#E5C463",
          "primary-dark": "#8C6F1E",
          "primary-glow": "#D4AF37",
          heading: "#09090B",
          text: "#3F3F46",
          muted: "#71717A",
          subtle: "#A1A1AA",
          success: "#22A559",
        },
      },
      letterSpacing: {
        heading: "-0.04em",
        "heading-tight": "-0.05em",
        "body-tight": "-0.02em",
      },
      borderRadius: {
        card: "24px",
        button: "100px",
      },
      maxWidth: {
        content: "1356px",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "floatSlow 9s ease-in-out infinite",
        "float-reverse": "floatReverse 8s ease-in-out infinite",
        "float-diagonal": "floatDiagonal 11s ease-in-out infinite",
        shine: "shine 0.75s cubic-bezier(0.01,0.56,1,1)",
        "blur-in": "blurAnimate 0.5s cubic-bezier(0.01,0.56,1,1) forwards",
        "border-rotate": "borderRotate 5s linear infinite",
        "gradient-shift": "gradientShift 3s ease infinite",
        "gradient-flow": "gradientShift 6s ease infinite",
        "spin-slow": "spin 22s linear infinite",
        "spin-slower": "spin 40s linear infinite",
        aurora: "aurora 18s ease infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.5s ease-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        blob: "morphBlob 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(2deg)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(-8px) rotate(0deg)" },
          "50%": { transform: "translateY(8px) rotate(-1.5deg)" },
        },
        floatDiagonal: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(8px, -12px) rotate(1deg)" },
          "66%": { transform: "translate(-6px, -6px) rotate(-1deg)" },
        },
        shine: {
          "0%": { left: "150%" },
          "100%": { left: "-200%" },
        },
        blurAnimate: {
          from: { opacity: "0", filter: "blur(10px)" },
          to: { opacity: "1", filter: "blur(0px)" },
        },
        borderRotate: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "300% 50%" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%", filter: "hue-rotate(0deg)" },
          "50%": { backgroundPosition: "100% 50%", filter: "hue-rotate(12deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.85)" },
          "50%": { opacity: "0.7", transform: "scale(1.15)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        morphBlob: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 60% 70% 40%" },
          "75%": { borderRadius: "60% 30% 60% 40% / 60% 40% 30% 70%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
