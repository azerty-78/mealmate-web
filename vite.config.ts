import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Écoute sur toutes les interfaces
    port: 5173, // Port par défaut de Vite
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok.io',
      '.ngrok-free.app',
      '.ngrok.app'
    ],
    // Proxy pour l'API backend avec configuration robuste
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Pour ngrok
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req: any, res: any) => {
            // Ne pas afficher les erreurs ECONNREFUSED pour éviter le spam
            // Les erreurs sont gérées silencieusement
            // Retourner une réponse 503 pour indiquer que le service est indisponible
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Service temporairement indisponible', 
                message: 'Le serveur de base de données n\'est pas démarré. Utilisez "npm run dev:full" pour démarrer les deux services.' 
              }));
            }
          });
        },
        // Timeout et retry pour ngrok
        timeout: 5000,
        proxyTimeout: 5000,
        // Configuration pour gérer l'absence du serveur
        ws: false,
        followRedirects: false,
      }
    }
  },
  // Optimisations pour la production
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  },
  // Optimisations pour le développement
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material']
  }
})
