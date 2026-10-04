import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Membiarkan Vite mengatur pemisahan file secara cerdas dan otomatis
    target: 'esnext',
  }
})