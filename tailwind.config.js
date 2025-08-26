/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00f5ff',
        'cyber-purple': '#8b5cf6', 
        'cyber-pink': '#ec4899'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
