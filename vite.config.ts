
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Prioritize VITE_ prefix, fallback to NEXT_PUBLIC_ or plain names
  const apiKey = env.VITE_API_KEY || env.API_KEY;
  const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Rizz Master AI',
          short_name: 'Rizz Master',
          description: 'Your AI wingman for dating apps.',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      // Explicitly define these as strings so they are replaced at build time
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
    },
    build: {
      chunkSizeWarningLimit: 1600,
    }
  };
});
