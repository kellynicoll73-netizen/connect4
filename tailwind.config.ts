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
  safelist: [
    'md:max-w-xl',
    'lg:max-w-2xl',
    'md:px-8',
  ],
  plugins: [],
};

export default config;
