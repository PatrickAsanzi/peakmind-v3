import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
