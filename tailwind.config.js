/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      // Add only the custom properties you actually use
      colors: {
        'cyber-blue': '#00f5ff',
        'cyber-purple': '#8b5cf6',
        'cyber-pink': '#ec4899'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  // Optimize CSS output
  experimental: {
    optimizeUniversalDefaults: true,
  },
  // Remove unused utilities
  safelist: [
    // Add any dynamic classes that might be removed incorrectly
    'animate-pulse',
    'animate-spin',
    'bg-gradient-to-r',
    'from-cyan-400',
    'to-purple-600'
  ]
}
