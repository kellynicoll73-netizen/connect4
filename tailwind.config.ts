import type { Config } from "tailwindcss";
import { colors, fontFamily, borderRadius, boxShadow } from "./src/tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily,
      borderRadius,
      boxShadow,
    },
  },
  plugins: [],
};

export default config;
