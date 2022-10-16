/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ['./public/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
    },
    colors: {
      current: 'currentColor',
      midnight: '#000032',
      gold1: '#FD8900',
      green2: '#01CC9B',
      white: '#FFFFFF',
      grey1: '#BEBEBE',
      otivo_blue: '#0064FF',
    },
    fontSize: {
      xss: ['0.5625rem', { lineHeight: 1}],
      xs: ['0.75rem', { lineHeight: 1.3 }],
      sm: ['0.875rem', { lineHeight: 1.3 }],
      base: ['1rem', { lineHeight: 1.3 }],
      lg: ['1.125rem', { lineHeight: 1.3 }],
      xl: ['1.25rem', { lineHeight: 1.3 }],
      '1.5xl': ['1.375rem', { lineHeight: 1.3 }],
      '2xl': ['1.5rem', { lineHeight: 1.3 }],
      '3xl': ['1.875rem', { lineHeight: 1.3 }],
    },
  },
  plugins: [],
}
