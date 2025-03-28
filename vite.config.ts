import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_API_URL

export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('antd')) return 'antd'
            if (id.includes('lucide-react')) return 'lucide-react'
            return 'vendor'
          }
        }
      }
    }
  }
})
