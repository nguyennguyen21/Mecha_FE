import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    // Proxy API requests to backend (optional, if needed)
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_URL || 'http://localhost:30052',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        rewrite: (path) => path
      }
    }
  }
})
