
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using (process as any).cwd() to resolve TS error in some environments.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Helper to check both .env (env) and system (process.env) variables
  const getVar = (key: string) => {
    return env[key] || process.env[key];
  };

  // Prioritize VITE_ > NEXT_PUBLIC_ > Generic names
  const apiKey = 
    getVar('VITE_API_KEY') || 
    getVar('API_KEY');

  const supabaseUrl = 
    getVar('VITE_SUPABASE_URL') || 
    getVar('NEXT_PUBLIC_SUPABASE_URL') || 
    getVar('SUPABASE_URL');

  const supabaseKey = 
    getVar('VITE_SUPABASE_ANON_KEY') || 
    getVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
    getVar('SUPABASE_ANON_KEY');

  // Debug log for build time (visible in build logs)
  console.log('Build-time Config Check:');
  console.log('API_KEY found:', !!apiKey);
  console.log('SUPABASE_URL found:', !!supabaseUrl);
  console.log('SUPABASE_KEY found:', !!supabaseKey);

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
      // Inject variables into the client code.
      // Use JSON.stringify to ensure they are valid string literals in the bundle.
      // Default to empty string to prevent 'undefined' errors, handled in client.
      'process.env.API_KEY': JSON.stringify(apiKey || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(supabaseUrl || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey || ''),
    },
    build: {
      chunkSizeWarningLimit: 1600,
    }
  };
});
