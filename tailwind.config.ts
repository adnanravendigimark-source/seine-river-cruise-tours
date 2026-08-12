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
          400: "#e0a94a",
          500: "#c6892c",
          600: "#a06d1f",
        },
        seine: {
          teal: "#0c7489",
          amber: "#e8823a",
          ink: "#0a2e35",
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
