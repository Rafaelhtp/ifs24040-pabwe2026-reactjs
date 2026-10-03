import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Memecah file JS besar menjadi beberapa bagian kecil
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['react-redux', '@reduxjs/toolkit'],
          'vendor-icons': ['@tabler/icons-react']
        }
      }
    }
  }
})