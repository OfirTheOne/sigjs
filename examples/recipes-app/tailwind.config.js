/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ]
  },
  safelist: [
    "flex", "flex-col", "min-h-screen", "bg-gray-100",
    "bg-white", "shadow", "max-w-7xl", "mx-auto", "py-6", "px-4",
    "sm:px-6", "lg:px-8", "items-center", "items-start", "justify-between", "flex-shrink-0",
    "h-8", "w-8", "md:ml-auto", "flex-wrap", "text-base", "justify-center",
    "mr-5", "hover:text-gray-900", "flex-1", "flex-row", "w-2/5", "h-1/2", "gap-4",
    "py-6", "justify-start", "items-end", "gap-2", "h-2", "w-2", "bg-slate-400/20",
    "-mt-16", "h-6", "w-6", "bg-blue-400/20", "-mt-14", "h-12", "w-12", "bg-blue-600/20",
    "-mt-8", "h-24", "w-24", "items-end", "bg-indigo-400/20", "h-32", "w-32", "bg-purple-400/20",
    "justify-end", "flex-end", "bg-teal-400/20", "h-36", "w-36", "bg-orange-400/20"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

