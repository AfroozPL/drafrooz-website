import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — Dr_Afrooz_Purarjomand_Brand_Guide v1.0
        "electric-blue": "#00C2FF",
        "deep-violet": "#7C3AED",
        "vivid-mint": "#06FFA5",
        "amber-gold": "#F59E0B",
        midnight: "#0A0E1A",
        ink: "#060A14",
        navy: "#0D1B2A",
        paper: "#EAF0F8",
        "light-gray": "#B8C4D4",
        muted: "#6B7A8F",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "Helvetica",
          "-apple-system",
          "BlinkMacSystemFont",
          "Arial",
          "sans-serif",
        ],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-blue": "0 0 32px rgba(0,194,255,0.25)",
        "glow-violet": "0 0 28px rgba(124,58,237,0.25)",
        "glow-mint": "0 0 32px rgba(6,255,165,0.25)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(184,196,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,196,212,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(0.6em)", filter: "blur(8px)" },
          to: { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "rise-in": "rise-in 0.9s cubic-bezier(0.2,0.7,0.2,1) both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.2,0.7,0.2,1) infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
