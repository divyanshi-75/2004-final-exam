module.exports = {
  darkMode: 'class',
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0b3d91', // dark blue
          600: '#0a3580',
          700: '#082e6b'
        }
      }
    },
  },
  plugins: [],
}
