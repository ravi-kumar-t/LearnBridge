/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'heading-purple': '#6C47FF',
        'subheading-purple': '#7B42F6',
        'section-light-bg': '#F8FAFC',
        'card-light-bg': '#FFFFFF',
        'card-accent-bg': '#EDE9FE',
        'card-border': '#E0E7FF',
      },
      // ADDED: Keyframes for various animations
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOutline: {
          '0%, 100%': { 'box-shadow': '0 0 0 0 rgba(108, 71, 255, 0.4)' }, // Use heading-purple
          '50%': { 'box-shadow': '0 0 0 10px rgba(108, 71, 255, 0)' },
        }
      },
      // ADDED: Animation utilities using the defined keyframes
      animation: {
        'spin-slow': 'spin 3s linear infinite', // Spins slower than default
        float: 'float 4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        'fadeIn-1': 'fadeIn 0.8s ease-out 0.2s forwards', // Delayed fade-in
        'fadeIn-2': 'fadeIn 0.8s ease-out 0.4s forwards', // Delayed fade-in
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        'fadeInUp-1': 'fadeInUp 0.8s ease-out 0.2s forwards', // Delayed slide-up
        'fadeInUp-2': 'fadeInUp 0.8s ease-out 0.4s forwards', // Further delayed slide-up
        'fadeInUp-3': 'fadeInUp 0.8s ease-out 0.6s forwards', // Even further delayed slide-up
        pulseOutline: 'pulseOutline 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}