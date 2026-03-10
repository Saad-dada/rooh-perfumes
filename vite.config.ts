import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-axios': ['axios'],
          },
        },
      },
    },
    server: {
      // Proxy WooCommerce API calls during local dev to avoid CORS issues
      proxy: env.VITE_WC_BASE_URL
        ? {
            '/wp-json': {
              target: env.VITE_WC_BASE_URL,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
  }
})
