/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "../recipes-server/src/**/*.ts",
    ]
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

