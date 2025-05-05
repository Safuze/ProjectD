import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.min.mjs']
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001' // или твой порт для Node.js сервера
    }
  }
})

