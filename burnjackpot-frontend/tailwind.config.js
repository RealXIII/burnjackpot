/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#FF4500',
          secondary: '#DC2626',
          accent: '#FFD700',
          dark: '#1F2937',
          light: '#F3F4F6',
        },
        animation: {
          'flame-pulse': 'flamePulse 1.5s infinite',
        },
        keyframes: {
          flamePulse: {
            '0%, 100%': { transform: 'scale(1)', opacity: '1' },
            '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          },
        },
      },
    },
    plugins: [],
  };