import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': import.meta.dirname,
      },
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            maxSize: 450 * 1024,
            groups: [
              {
                name: 'react-vendor',
                test: /(?:^|[\\/])node_modules[\\/](?:react|react-dom|react-is|react-router|react-router-dom|scheduler)[\\/]/,
                priority: 30,
              },
              {
                name: 'firebase-vendor',
                test: /(?:^|[\\/])node_modules[\\/](?:@firebase|firebase)[\\/]/,
                priority: 20,
              },
              {
                name: 'recharts-vendor',
                test: /(?:^|[\\/])node_modules[\\/](?:recharts|d3-[^\\/]+|victory-vendor)[\\/]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
