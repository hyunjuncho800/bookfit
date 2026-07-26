/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FBF9F5',
          light: '#FFFDF9',
          card: '#F4EFE6',
          dark: '#EFE7DA',
        },
        charcoal: {
          DEFAULT: '#2D3748',
          light: '#4A5568',
          muted: '#718096',
          dark: '#1A202C',
        },
        forest: {
          DEFAULT: '#2C4A3E',
          light: '#3A5F50',
          dark: '#1E352C',
          muted: '#E8EFEA',
        },
        oak: {
          DEFAULT: '#D4A373',
          light: '#E6BD94',
          dark: '#B88654',
          subtle: '#FAF3EB',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif KR"', 'serif'],
        sans: ['"Pretendard"', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 10px 25px -5px rgba(44, 74, 62, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'shelf': '0 4px 20px -2px rgba(212, 163, 115, 0.2)',
        'elevated': '0 20px 30px -10px rgba(45, 55, 72, 0.12)',
      }
    },
  },
  plugins: [],
}
