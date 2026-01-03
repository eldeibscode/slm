/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Primary: Brand greens (green-* from Tailwind CSS)
        primary: {
          50: '#f0fdf4',   // green-50 - Almost white with subtle green tint
          100: '#dcfce7',  // green-100 - Very light green-white
          200: '#bbf7d0',  // green-200 - Soft light green
          300: '#86efac',  // green-300 - Light fresh green
          400: '#4ade80',  // green-400 - Medium-light vibrant green
          500: '#22c55e',  // green-500 - Core green (main brand color)
          600: '#16a34a',  // green-600 - Strong medium green
          700: '#15803d',  // green-700 - Dark green
          800: '#166534',  // green-800 - Darker forest green
          900: '#14532d',  // green-900 - Very dark green
          950: '#052e16',  // green-950 - Almost black green
        },
        // Secondary: Neutral grays (gray-* from Tailwind CSS)
        secondary: {
          50: '#f9fafb',   // gray-50 - Almost white
          100: '#f3f4f6',  // gray-100 - Very light gray
          200: '#e5e7eb',  // gray-200 - Light gray
          300: '#d1d5db',  // gray-300 - Soft gray
          400: '#9ca3af',  // gray-400 - Medium gray
          500: '#6b7280',  // gray-500 - Core gray
          600: '#4b5563',  // gray-600 - Dark gray
          700: '#374151',  // gray-700 - Darker gray
          800: '#1f2937',  // gray-800 - Very dark gray
          900: '#111827',  // gray-900 - Almost black
        },
      },
    },
  },
  plugins: [],
};
