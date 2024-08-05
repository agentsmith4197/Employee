// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans all your component files
  ],
  theme: {
    extend: {
      colors: {
        // Customize your colors here
        primary: {
          light: '#4f8cdf',
          DEFAULT: '#1d4ed8',
          dark: '#1e40af',
        },
        secondary: {
          light: '#ff7c7c',
          DEFAULT: '#ff4949',
          dark: '#b80000',
        },
      },
      backgroundImage: {
        // Add custom background images
        'hero-pattern': "url('/path/to/your/background.jpg')",
      },
      spacing: {
        // Customize spacing scale
        128: '32rem',
        144: '36rem',
      },
    },
  },
  plugins: [
    // Add any plugins here
  ],
  darkMode: 'class', // Enable dark mode
};
