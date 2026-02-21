import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/assessment02",
  plugins: [react()],
  define: {
    // 从 .env 里读取并注入到全局
    API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL)
  }
})
