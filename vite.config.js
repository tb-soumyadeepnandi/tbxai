import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ✅ React plugin handles JSX, fast refresh, etc.
    react({
      babel: {
        plugins: [
          // Optional: if you want to use the new React Compiler
          ['babel-plugin-react-compiler']
        ],
      },
    }),

    // ✅ Tailwind plugin for Vite (automatically sets up PostCSS)
    tailwindcss(),
  ],
})
