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
  },
  plugins: [],
}
