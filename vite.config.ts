import path from 'path'
import fs from 'node:fs'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// 빌드 시각 1회 산출 → 번들(define)과 dist/build.json에 동일 값 기록. 런타임에서 이 둘을 비교해 새 버전 감지.
// 밀리초는 버전 식별에 불필요해 초 단위까지만(`...:30Z`) 자른다.
const buildTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

function buildTimeJson(): Plugin {
  let outDir = 'dist'
  return {
    name: 'build-time-json',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      fs.writeFileSync(path.resolve(outDir, 'build.json'), JSON.stringify({ buildTime }))
    }
  }
}

export default defineConfig({
  define: {
    __APP_BUILD_TIME__: JSON.stringify(buildTime)
  },
  plugins: [react(), buildTimeJson()],
  base: '/urbancentro-fc',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    port: 5174
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/shared/test/setup.ts']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
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
