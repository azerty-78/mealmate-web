#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Vérifier si ngrok est installé
function checkNgrokInstalled() {
  return new Promise((resolve) => {
    exec('ngrok version', (error) => {
      if (error) {
        log('❌ Ngrok n\'est pas installé', 'red');
        resolve(false);
      } else {
        log('✅ Ngrok est installé', 'green');
        resolve(true);
      }
    });
  });
}

// Installer ngrok automatiquement
function installNgrok() {
  return new Promise((resolve, reject) => {
    log('📦 Installation de ngrok...', 'yellow');
    
    const platform = process.platform;
    let installCommand;
    
    if (platform === 'win32') {
      // Windows - utiliser chocolatey ou winget
      installCommand = 'winget install ngrok.ngrok';
    } else if (platform === 'darwin') {
      // macOS - utiliser homebrew
      installCommand = 'brew install ngrok/ngrok/ngrok';
    } else {
      // Linux - utiliser snap ou apt
      installCommand = 'sudo snap install ngrok';
    }
    
    exec(installCommand, (error, stdout, stderr) => {
      if (error) {
        log('⚠️ Installation automatique échouée. Veuillez installer ngrok manuellement.', 'yellow');
        log('📖 Guide d\'installation: https://ngrok.com/download', 'blue');
        resolve(false);
      } else {
        log('✅ Ngrok installé avec succès', 'green');
        resolve(true);
      }
    });
  });
}

// Configurer ngrok
function setupNgrok() {
  return new Promise((resolve) => {
    log('🔧 Configuration de ngrok...', 'yellow');
    
    // Créer le fichier de configuration ngrok
    const ngrokConfig = `version: "2"
authtoken: ""
tunnels:
  mealmate:
    proto: http
    addr: 5173
    subdomain: mealmate-${Date.now().toString().slice(-6)}
    inspect: true
    bind_tls: true
    host_header: "localhost:5173"
  mealmate-api:
    proto: http
    addr: 3001
    subdomain: mealmate-api-${Date.now().toString().slice(-6)}
    inspect: true
    bind_tls: true
    host_header: "localhost:3001"
`;

    const configPath = path.join(process.cwd(), 'ngrok.yml');
    fs.writeFileSync(configPath, ngrokConfig);
    
    log('✅ Configuration ngrok créée: ngrok.yml', 'green');
    resolve(true);
  });
}

// Démarrer ngrok
function startNgrok() {
  return new Promise((resolve, reject) => {
    log('🚀 Démarrage de ngrok...', 'cyan');
    
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
      console.log(output);
      
      // Extraire les URLs des tunnels
      const frontendMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io.*?->.*?localhost:5173/);
      const apiMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io.*?->.*?localhost:3001/);
      
      if (frontendMatch) {
        tunnelUrls.frontend = frontendMatch[0].split(' ')[0];
        log(`🌐 Frontend: ${tunnelUrls.frontend}`, 'green');
      }
      
      if (apiMatch) {
        tunnelUrls.api = apiMatch[0].split(' ')[0];
        log(`🔌 API: ${tunnelUrls.api}`, 'green');
      }
    });

    ngrokProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('authtoken')) {
        log('⚠️ Token d\'authentification ngrok manquant', 'yellow');
        log('📖 Obtenez votre token sur: https://dashboard.ngrok.com/get-started/your-authtoken', 'blue');
        log('💡 Ajoutez-le dans ngrok.yml ou configurez-le avec: ngrok config add-authtoken YOUR_TOKEN', 'cyan');
      }
      console.error(error);
    });

    ngrokProcess.on('error', (error) => {
      log(`❌ Erreur ngrok: ${error.message}`, 'red');
      reject(error);
    });

    // Attendre un peu pour que ngrok démarre
    setTimeout(() => {
      if (tunnelUrls.frontend || tunnelUrls.api) {
        log('🎉 Ngrok démarré avec succès!', 'green');
        log('', 'reset');
        log('📋 URLs des tunnels:', 'cyan');
        if (tunnelUrls.frontend) {
          log(`   Frontend: ${tunnelUrls.frontend}`, 'green');
        }
        if (tunnelUrls.api) {
          log(`   API: ${tunnelUrls.api}`, 'green');
        }
        log('', 'reset');
        log('💡 Partagez ces URLs pour accéder à votre application!', 'yellow');
        resolve(tunnelUrls);
      } else {
        log('⚠️ Ngrok démarré mais URLs non détectées', 'yellow');
        resolve(tunnelUrls);
      }
    }, 3000);
  });
}

// Fonction principale
async function main() {
  log('🚀 Configuration automatique de ngrok pour MealMate', 'cyan');
  log('================================================', 'cyan');
  log('');

  try {
    // 1. Vérifier si ngrok est installé
    const isInstalled = await checkNgrokInstalled();
    
    if (!isInstalled) {
      log('📦 Ngrok n\'est pas installé. Tentative d\'installation automatique...', 'yellow');
      const installed = await installNgrok();
      
      if (!installed) {
        log('', 'reset');
        log('📖 Installation manuelle requise:', 'red');
        log('   1. Allez sur https://ngrok.com/download', 'blue');
        log('   2. Téléchargez et installez ngrok', 'blue');
        log('   3. Relancez ce script', 'blue');
        process.exit(1);
      }
    }

    // 2. Configurer ngrok
    await setupNgrok();

    // 3. Démarrer ngrok
    await startNgrok();

  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
  log('\n🛑 Arrêt de ngrok...', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Arrêt de ngrok...', 'yellow');
  process.exit(0);
});

main();
