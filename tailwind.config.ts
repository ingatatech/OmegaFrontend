/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config =  {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1760b0',
      },
    },
  },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;