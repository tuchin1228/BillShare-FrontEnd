import {
  fileURLToPath,
  URL
} from 'url'

import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080
  },
  define: {
    'process.env': {
      API_URL: "http://billshare.3b8.site"
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    }
  }
})