/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        institutional: {
          navy: '#1B3A5C',
          'navy-light': '#2A5A8C',
          'navy-dark': '#0F2440',
          'navy-50': '#EBF0F5',
          'navy-100': '#D1DEE9',
          gold: '#B8860B',
          'gold-light': '#D4A843',
          'gold-soft': 'rgba(184, 134, 11, 0.08)',
        },
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8F9FB',
          tertiary: '#F0F2F5',
        },
        fin: {
          green: '#16A34A',
          'green-bg': '#F0FDF4',
          red: '#DC2626',
          'red-bg': '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)',
        'nav': '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
