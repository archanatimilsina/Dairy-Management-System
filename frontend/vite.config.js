import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:8000',
      '/register': 'http://localhost:8000',
      '/logout': 'http://localhost:8000',
      '/api': 'http://localhost:8000',
      '/user': 'http://localhost:8000',
      '/sendMail': 'http://localhost:8000',
      '/company-info': 'http://localhost:8000',
      '/forgot-password': 'http://localhost:8000',
      '/reset-password-confirm': 'http://localhost:8000',
      '/product': 'http://localhost:8000',
      '/order': 'http://localhost:8000',
      '/contact': 'http://localhost:8000',
      '/feedback': 'http://localhost:8000',
    },
  },
})

