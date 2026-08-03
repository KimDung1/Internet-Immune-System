import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'immune-teal': '#06B6D4',
        'cyan-pulse': '#22D3EE',
        'crimson-threat': '#EF4444',
      },
    },
  },
  plugins: [],
}

export default config
