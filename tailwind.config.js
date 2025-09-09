/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00f5ff',
        'cyber-purple': '#8b5cf6',
        'cyber-pink': '#ec4899',
        // Azura theme colors
        'azura': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#22d3ee',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        }
      },
      backgroundColor: {
        'light-primary': '#ffffff',
        'light-secondary': '#f8fafc',
        'dark-primary': '#0f172a',
        'dark-secondary': '#1e293b'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
