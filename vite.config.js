import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true' 
    ? '/SignUpSource/' 
    : './', // GitHub Pages 使用仓库名称作为 base，本地开发使用相对路径
  plugins: [react()],
  server: {
    port: 5129, // 使用不同于其他包的端口
    proxy: {
      '/ot': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist', // 构建输出到后端的public目录下的signupsource子目录
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
