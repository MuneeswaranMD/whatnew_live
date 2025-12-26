import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      // Use absolute base for proper routing with BrowserRouter
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        historyApiFallback: true,
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          }
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        assetsInlineLimit: 4096,
        rollupOptions: {
          output: {
            // Better long-term caching by separating vendor chunks
            manualChunks(id) {
              if (id.includes('node_modules')) return 'vendor';
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});