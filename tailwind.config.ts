import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
   
    extend: {
      fontFamily: {
        ubuntu: "Ubuntu Mono"
      },
      colors: {
        "madoka-white": "#FFFDFF",
        "madoka-pink": "#FFCBCF",
        "madoka-salmon": "#FDE8CD",
        "madoka-yellow": "#FFFFE9",
        "madoka-black": "#15110F"
      },
    }
  },
  plugins: [],
};
export default config;
