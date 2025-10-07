#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Vérifier si le serveur JSON est disponible
function checkJsonServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'HEAD',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function startDev() {
  log('🚀 Démarrage de MealMate Web...', 'cyan');
  
  // Vérifier si le serveur JSON est déjà en cours d'exécution
  const isJsonServerRunning = await checkJsonServer();
  
  if (isJsonServerRunning) {
    log('✅ Serveur JSON détecté sur le port 3001', 'green');
    log('🌐 Démarrage du serveur de développement Vite...', 'blue');
    
    // Démarrer seulement Vite
    const viteProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('error', (err) => {
      log(`❌ Erreur lors du démarrage de Vite: ${err.message}`, 'red');
      process.exit(1);
    });
    
  } else {
    log('⚠️  Serveur JSON non détecté sur le port 3001', 'yellow');
    log('📋 Options disponibles:', 'cyan');
    log('   1. Démarrer seulement le frontend (recommandé pour le développement UI)', 'blue');
    log('   2. Démarrer les deux services (frontend + base de données)', 'blue');
    log('', 'reset');
    
    log('🌐 Démarrage du serveur de développement Vite...', 'blue');
    log('💡 Pour démarrer avec la base de données, utilisez: npm run dev:full', 'yellow');
    log('', 'reset');
    
    // Démarrer seulement Vite
    const viteProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('error', (err) => {
      log(`❌ Erreur lors du démarrage de Vite: ${err.message}`, 'red');
      process.exit(1);
    });
  }
}

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
  log('\n🛑 Arrêt du serveur de développement...', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Arrêt du serveur de développement...', 'yellow');
  process.exit(0);
});

startDev().catch((err) => {
  log(`❌ Erreur: ${err.message}`, 'red');
  process.exit(1);
});
