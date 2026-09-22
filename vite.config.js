import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// All backend calls go through /api so they never collide with frontend routes.
// /api/recipes/from-url -> http://localhost:8080/recipes/from-url
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
