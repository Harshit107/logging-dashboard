import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const targetBackend = env.VITE_BACKEND_URL || 'http://localhost:5001';
  const apiKey = env.LOGGING_SERVICE_API_KEY || '50b65cea-691b-406e-9d28-0718b86abe98';

  return {
    plugins: [react()],
    server: {
      port: 5174,
      // Secure server-side proxy layer: attaches x-logging-key on dev server side,
      // so the secret is NEVER exposed to client-side bundles or browser memory!
      proxy: {
        '/api': {
          target: targetBackend,
          changeOrigin: true,
          headers: {
            'x-logging-key': apiKey,
          },
        },
      },
    },
  };
});
