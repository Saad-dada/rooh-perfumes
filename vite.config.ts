import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devWooAuthHeader = env.WC_CONSUMER_KEY && env.WC_CONSUMER_SECRET
    ? `Basic ${Buffer.from(`${env.WC_CONSUMER_KEY}:${env.WC_CONSUMER_SECRET}`).toString('base64')}`
    : undefined

  const wpJsonProxy = env.VITE_WC_BASE_URL
    ? {
        '/wp-json': {
          target: env.VITE_WC_BASE_URL,
          changeOrigin: true,
          secure: true,
        },
        '/api/woo.php': {
          target: env.VITE_WC_BASE_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) => path.replace(/^\/api\/woo\.php\/?/, '/wp-json/wc/v3/'),
          ...(devWooAuthHeader ? { headers: { Authorization: devWooAuthHeader } } : {}),
        },
      }
    : undefined

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
      proxy: wpJsonProxy,
    },
    preview: {
      proxy: wpJsonProxy,
    },
  }
})
