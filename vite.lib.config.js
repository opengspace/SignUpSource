import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'SignUpSource',
      fileName: (format) => `signupsource.${format}.js`
    },
    rollupOptions: {
      // Make sure to externalize dependencies that shouldn't be bundled
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // Generate separate CSS file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist', // 构建输出到后端的public目录下的signupsource子目录
    emptyOutDir: false,
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Minify the output
    minify: true
  }
}); 