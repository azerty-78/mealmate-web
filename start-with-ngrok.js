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

// Vérifier si Vite est disponible
function checkViteServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path: '/',
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

async function startWithNgrok() {
  log('🚀 Démarrage de MealMate avec ngrok...', 'cyan');
  log('=====================================', 'cyan');
  log('');

  // Vérifier les services
  const isJsonServerRunning = await checkJsonServer();
  const isViteRunning = await checkViteServer();

  if (!isViteRunning) {
    log('🌐 Démarrage du serveur Vite...', 'blue');
    const viteProcess = spawn('npm', ['run', 'dev:vite'], {
      stdio: 'inherit',
      shell: true
    });

    // Attendre que Vite démarre
    await new Promise(resolve => setTimeout(resolve, 5000));
  } else {
    log('✅ Serveur Vite déjà en cours d\'exécution', 'green');
  }

  if (!isJsonServerRunning) {
    log('🗄️ Démarrage du serveur JSON...', 'blue');
    const jsonProcess = spawn('npm', ['run', 'db'], {
      stdio: 'inherit',
      shell: true
    });

    // Attendre que le serveur JSON démarre
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else {
    log('✅ Serveur JSON déjà en cours d\'exécution', 'green');
  }

  // Démarrer ngrok
  log('🌍 Démarrage de ngrok...', 'magenta');
  log('', 'reset');
  
  const ngrokProcess = spawn('ngrok', ['start', '--all', '--config=ngrok.yml'], {
    stdio: 'pipe',
    shell: true
  });

  let tunnelUrls = {
    frontend: null,
    api: null
  };

  ngrokProcess.stdout.on('data', (data) => {
    const output = data.toString();
    
    // Extraire les URLs des tunnels
    const frontendMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io.*?->.*?localhost:5173/);
    const apiMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io.*?->.*?localhost:3001/);
    
    if (frontendMatch && !tunnelUrls.frontend) {
      tunnelUrls.frontend = frontendMatch[0].split(' ')[0];
      log(`🌐 Frontend accessible sur: ${tunnelUrls.frontend}`, 'green');
    }
    
    if (apiMatch && !tunnelUrls.api) {
      tunnelUrls.api = apiMatch[0].split(' ')[0];
      log(`🔌 API accessible sur: ${tunnelUrls.api}`, 'green');
    }
  });

  ngrokProcess.stderr.on('data', (data) => {
    const error = data.toString();
    if (error.includes('authtoken')) {
      log('', 'reset');
      log('⚠️ Token d\'authentification ngrok manquant!', 'yellow');
      log('', 'reset');
      log('📖 Pour obtenir votre token:', 'blue');
      log('   1. Allez sur https://dashboard.ngrok.com/get-started/your-authtoken', 'blue');
      log('   2. Créez un compte gratuit', 'blue');
      log('   3. Copiez votre token', 'blue');
      log('', 'reset');
      log('💡 Configurez le token avec:', 'cyan');
      log('   ngrok config add-authtoken YOUR_TOKEN', 'cyan');
      log('', 'reset');
      log('🔄 Redémarrez ensuite avec: npm run ngrok', 'yellow');
    } else if (!error.includes('t=2024')) {
      console.error(error);
    }
  });

  ngrokProcess.on('error', (error) => {
    log(`❌ Erreur ngrok: ${error.message}`, 'red');
    log('', 'reset');
    log('🔧 Solutions possibles:', 'yellow');
    log('   1. Installez ngrok: https://ngrok.com/download', 'blue');
    log('   2. Configurez votre token: ngrok config add-authtoken YOUR_TOKEN', 'blue');
    log('   3. Relancez: npm run ngrok', 'blue');
  });

  // Afficher les informations finales
  setTimeout(() => {
    log('', 'reset');
    log('🎉 MealMate est maintenant accessible via ngrok!', 'green');
    log('==============================================', 'green');
    log('', 'reset');
    
    if (tunnelUrls.frontend) {
      log(`🌐 Application: ${tunnelUrls.frontend}`, 'cyan');
    }
    if (tunnelUrls.api) {
      log(`🔌 API: ${tunnelUrls.api}`, 'cyan');
    }
    
    log('', 'reset');
    log('📋 Partagez ces URLs pour donner accès à votre application!', 'yellow');
    log('🛑 Appuyez sur Ctrl+C pour arrêter tous les services', 'red');
    log('', 'reset');
  }, 5000);

  // Gestion des signaux d'arrêt
  process.on('SIGINT', () => {
    log('\n🛑 Arrêt de tous les services...', 'yellow');
    ngrokProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('\n🛑 Arrêt de tous les services...', 'yellow');
    ngrokProcess.kill();
    process.exit(0);
  });
}

startWithNgrok().catch((error) => {
  log(`❌ Erreur: ${error.message}`, 'red');
  process.exit(1);
});
