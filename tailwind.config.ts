import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Parisian Midnight Plum & Amber Glow palette
        stone: {
          50: "#faf5ff",
          900: "#1a0f24",
        },
        gold: {
          400: "rgb(var(--color-gold-400) / <alpha-value>)",
          500: "#f59e0b",
          600: "#d97706",
        },
        plum: {
          900: "#4a044e",
          950: "#1e0524",
        },
        seine: {
          teal: "rgb(var(--color-seine-teal) / <alpha-value>)",
          amber: "rgb(var(--color-seine-amber) / <alpha-value>)",
          ink: "rgb(var(--color-seine-ink) / <alpha-value>)",
        },
        navy: {
          900: "#1e0524",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "ui-serif", "serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        mosaic:
          "radial-gradient(circle at 20% 20%, rgba(245,158,11,0.22) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(134,25,143,0.32) 0, transparent 40%), radial-gradient(circle at 50% 80%, rgba(46,8,54,0.28) 0, transparent 45%)",
      },
    },
  },
  plugins: [],
};
export default config;
