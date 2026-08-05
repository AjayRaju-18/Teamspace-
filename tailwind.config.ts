/**
 * NOTE: This project uses Tailwind CSS v4 (@tailwindcss/postcss).
 * In v4, theme configuration is CSS-native via the @theme directive in globals.css.
 * This file documents the intended design tokens for reference.
 * The canonical, active configuration lives in /src/app/globals.css.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0A0A",
        "bg-secondary": "#1C1C1E",
        "text-muted": "#8E8E93",
        "bg-light": "#F2F2F7",
        accent: "#0A84FF",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
