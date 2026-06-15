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
        navy: "#0D1B2A",
        "light-gray": "#B8C4D4",
        muted: "#6B7A8F",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Helvetica",
          "-apple-system",
          "BlinkMacSystemFont",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        "glow-blue": "0 0 32px rgba(0,194,255,0.25)",
        "glow-violet": "0 0 28px rgba(124,58,237,0.25)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(184,196,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,196,212,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
    },
  },
  plugins: [],
};
export default config;
