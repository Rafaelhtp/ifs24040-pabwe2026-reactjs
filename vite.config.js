import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Menggunakan format fungsi agar tidak terjadi TypeError
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tabler/icons-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('redux')) {
              return 'vendor-core';
            }
            return 'vendor'; // Sisa library lainnya
          }
        }
      }
    }
  }
})