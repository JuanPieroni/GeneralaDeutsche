import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, passes: 2 },
    },
    rollupOptions: {
      treeshake: true,
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          socket: ['socket.io-client'],
          motion: ['framer-motion'],
        }
      }
    }
  }
})
