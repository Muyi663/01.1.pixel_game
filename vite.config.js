import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/01.1.pixel_game/' : '/', // 确保在 GitHub Pages 的子目录下能正确加载资源
})
