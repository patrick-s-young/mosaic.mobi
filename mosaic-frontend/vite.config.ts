import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app': resolve(__dirname, './src/app'),
      '@api': resolve(__dirname, './src/api'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@theme': resolve(__dirname, './src/theme'),
      '@devTools': resolve(__dirname, './src/devTools'),
      '@analytics': resolve(__dirname, './src/analytics'),
      '@store': resolve(__dirname, './src/store'),
      '@sass': resolve(__dirname, './src/sass'),
      '@enums': resolve(__dirname, './src/typescript/enums'),
      '@types': resolve(__dirname, './src/typescript/types'),
      '@interfaces': resolve(__dirname, './src/typescript/interfaces'),
      '@typescript': resolve(__dirname, './src/typescript'),
    }
  }
})

