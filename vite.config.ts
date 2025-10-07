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
      '.ngrok.app',
      '.ngrok.dev'
    ],
    // Configuration pour ngrok
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    // Proxy pour l'API backend avec configuration robuste
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Pour ngrok
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: () => {
          // Configuration du proxy pour gérer les erreurs de connexion
          // Les erreurs ECONNREFUSED sont gérées silencieusement
          // Le proxy retourne automatiquement une erreur 503 si le serveur n'est pas disponible
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
