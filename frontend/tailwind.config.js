/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3b82f6",
          pink: "#ec4899",
          green: "#10b981",
          deep: "#0a0a0a", // Vantablack
        }
      },
      backgroundImage: {
        'neural-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '0.25em',
      },
      boxShadow: {
        'neural': '0 0 20px rgba(255,255,255,0.3)',
      }
    },
  },
  plugins: [],
}
