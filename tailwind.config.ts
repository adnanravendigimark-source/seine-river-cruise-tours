import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Riverwater palette: deep teal (the Seine itself) + warm amber
        // (bridge lamps at dusk) + a near-black teal ink for contrast —
        // deliberately cooler and greener than the old gold/blue Paris-dusk
        // palette so the site reads as its own distinct brand.
        stone: {
          50: "#f7faf9",
          900: "#1a2422",
        },
        gold: {
          400: "rgb(var(--color-gold-400) / <alpha-value>)",
          500: "#c6892c",
          600: "#a06d1f",
        },
        // seine.* and gold.400 are backed by CSS variables (defaults in
        // globals.css :root) instead of fixed hex, so the admin-editable
        // "Brand Colors" panel (/admin/homepage → Advanced SEO tab) can
        // override them site-wide at runtime — see app/layout.tsx, which
        // injects the admin's chosen values as an inline <style> tag. The
        // `rgb(var(...) / <alpha-value>)` form is Tailwind's documented
        // pattern for CSS-variable colors that still support opacity
        // modifiers like `bg-seine-teal/40`, used throughout.
        seine: {
          teal: "rgb(var(--color-seine-teal) / <alpha-value>)",
          amber: "rgb(var(--color-seine-amber) / <alpha-value>)",
          ink: "rgb(var(--color-seine-ink) / <alpha-value>)",
        },
        navy: {
          900: "#132a2e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        mosaic:
          "radial-gradient(circle at 20% 20%, rgba(232,130,58,0.22) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(12,116,137,0.28) 0, transparent 40%), radial-gradient(circle at 50% 80%, rgba(10,46,53,0.22) 0, transparent 45%)",
      },
    },
  },
  plugins: [],
};
export default config;
