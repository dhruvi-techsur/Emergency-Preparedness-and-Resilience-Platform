import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Library build for the EPMP Design System.
//
// Produces:
//   dist/bundle.es.js  — ES module, for bundler consumers (import { Button } from '@epmp/design-system')
//   dist/bundle.js     — IIFE, for the "load via <script> tag" contract in EPMP-llm-build-guide.md:
//                         attaches `window.EPMP` when loaded after react.production.min.js +
//                         react-dom.production.min.js on a plain HTML page.
//   dist/bundle.css    — extracted component styles (separate from tokens.css, which ships
//                         unbundled from tokens/tokens.css since it is hand-authored, not compiled).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EPMP',
      formats: ['es', 'iife'],
      fileName: (format) => (format === 'iife' ? 'bundle.js' : 'bundle.es.js'),
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // Ensure the IIFE's CSS output file is named `bundle.css` regardless of
        // Rollup's default asset naming.
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css' || assetInfo.name?.endsWith('.css')) {
            return 'bundle.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
