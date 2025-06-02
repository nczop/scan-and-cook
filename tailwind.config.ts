import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        md: '1024px',
        lg: '1280px',
        xl: '1536px',
      },
    },
  },
  plugins: [],
};

export default config;
