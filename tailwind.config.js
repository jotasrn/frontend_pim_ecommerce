// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
         fadeIn: 'fadeIn 0.3s ease-in-out',
         slideDown: 'slideDown 0.3s ease-out',
         slideInRight: 'slideInRight 0.3s ease-out',
         float: 'float 3s ease-in-out infinite', 
         enter: 'enter 0.3s ease-out',
         leave: 'leave 0.3s ease-in forwards', 
      },
      keyframes: {
         fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
         slideDown: { from: { transform: 'translateY(-10%)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
         slideInRight: { from: { transform: 'translateX(100%)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
         float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
         enter: { '0%': { transform: 'scale(0.9)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } }, 
         leave: { '0%': { transform: 'scale(1)', opacity: 1 }, '100%': { transform: 'scale(0.9)', opacity: 0 } },
      },
    },
  },
  plugins: [
     require('@tailwindcss/forms'), 
     require('@tailwindcss/line-clamp'),
  ],
}