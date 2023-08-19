import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://185.106.177.48:9101/',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
