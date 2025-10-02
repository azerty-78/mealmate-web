# Configuration Développeur - MEALMATE Web

Guide complet pour configurer l'environnement de développement de MEALMATE Web.

## 🚀 Configuration Rapide

### Prérequis
- **Node.js** 18.0.0+
- **npm** 8.0.0+
- **Git** 2.30.0+
- **VS Code** (recommandé)

### Installation Express
```bash
# Cloner le projet
git clone https://github.com/votre-username/mealmate-web.git
cd mealmate-web

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev:full
```

## 🔧 Configuration Détaillée

### 1. Configuration Node.js

#### Installation via NVM (Recommandé)
```bash
# Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Redémarrer le terminal
source ~/.bashrc

# Installer Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

#### Installation Directe
- **Windows** : [nodejs.org](https://nodejs.org/)
- **macOS** : `brew install node@18`
- **Linux** : `sudo apt install nodejs npm`

### 2. Configuration Git

```bash
# Configuration globale
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Configuration du projet
git config --local core.autocrlf true  # Windows
git config --local core.autocrlf input # Linux/Mac
```

### 3. Configuration VS Code

#### Extensions Recommandées
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-css-peek"
  ]
}
```

#### Configuration Workspace
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 4. Configuration de l'Environnement

#### Variables d'Environnement
```bash
# .env.development
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=MEALMATE Web Dev
VITE_GEMINI_API_KEY=AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
```

#### Configuration Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

## 🛠️ Scripts de Développement

### Scripts Disponibles
```bash
# Développement
npm run dev              # Démarrer l'application
npm run dev:full         # Application + base de données
npm run db               # Base de données uniquement

# Build
npm run build            # Build de production
npm run preview          # Prévisualiser la build

# Qualité de code
npm run lint             # Linter ESLint
npm run lint:fix         # Corriger automatiquement
npm run type-check       # Vérification TypeScript

# Tests
npm run test             # Tests unitaires
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Couverture de code
```

### Scripts Personnalisés
```json
{
  "scripts": {
    "dev:full": "concurrently \"npm run db\" \"npm run dev\"",
    "db": "json-server --watch db/db.json --port 3001",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules/.vite",
    "reset": "npm run clean && npm install"
  }
}
```

## 🗄️ Base de Données de Développement

### Structure JSON Server
```json
{
  "users": [...],
  "diabeticRecords": [...],
  "meals": [...],
  "appointments": [...],
  "medicalRecords": [...],
  "prescriptions": [...],
  "emergencyContacts": [...],
  "glucoseReadings": [...],
  "medicationLogs": [...]
}
```

### Endpoints API
```bash
# Utilisateurs
GET    /users
POST   /users
PUT    /users/:id
DELETE /users/:id

# Dossiers diabétiques
GET    /diabetic-records
POST   /diabetic-records
PUT    /diabetic-records/:id
DELETE /diabetic-records/:id

# Repas
GET    /meal-templates
POST   /meal-templates
PUT    /meal-templates/:id
DELETE /meal-templates/:id
```

### Données de Test
```typescript
// Comptes de test préconfigurés
const testUsers = {
  diabetic: {
    email: 'marie.helene@example.com',
    password: 'password123',
    type: 'diabetic_person'
  },
  doctor: {
    email: 'bernard.arnaud@example.com',
    password: 'password123',
    type: 'doctor'
  },
  admin: {
    email: 'admin@mealmate.com',
    password: 'admin123',
    type: 'administrator'
  }
};
```

## 🧪 Tests et Qualité

### Configuration Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ]
};
```

### Configuration ESLint
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error'
  }
};
```

### Configuration Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🔍 Debugging

### Configuration VS Code Debug
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "name": "Attach to Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Logs de Développement
```typescript
// Configuration des logs
const DEBUG = import.meta.env.VITE_DEBUG_MODE === 'true';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (DEBUG) console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    if (DEBUG) console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    if (DEBUG) console.warn(`[WARN] ${message}`, ...args);
  }
};
```

## 🚀 Déploiement

### Build de Production
```bash
# Build optimisé
npm run build

# Vérifier la build
npm run preview

# Analyser la taille
npm run build -- --analyze
```

### Variables d'Environnement Production
```bash
# .env.production
VITE_API_URL=https://api.mealmate.com
VITE_APP_NAME=MEALMATE Web
VITE_GEMINI_API_KEY=your_production_key
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### Configuration Serveur
```nginx
# nginx.conf
server {
    listen 80;
    server_name mealmate.com;
    root /var/www/mealmate/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📚 Ressources Utiles

### Documentation
- [React](https://reactjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Vite](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Material-UI](https://mui.com/material-ui)

### Outils de Développement
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- [JSON Server](https://github.com/typicode/json-server)

### APIs et Services
- [Google Gemini AI](https://ai.google.dev)
- [JSON Server](https://github.com/typicode/json-server)
- [jsPDF](https://github.com/parallax/jsPDF)

## 🐛 Résolution de Problèmes

### Problèmes Courants

#### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5173
# Tuer le processus
kill -9 <PID>
```

#### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
npm run clean
npm install
```

#### Problèmes de cache
```bash
# Nettoyer le cache Vite
rm -rf node_modules/.vite
npm run dev
```

#### Erreurs TypeScript
```bash
# Vérifier les types
npm run type-check
# Redémarrer le serveur TypeScript
# Dans VS Code : Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

## 📞 Support

### Aide et Support
- **GitHub Issues** : Pour les bugs et questions
- **Discussions** : Pour les discussions générales
- **Email** : [votre-email@example.com]

### Ressources Communautaires
- **Stack Overflow** : Tag `mealmate-web`
- **Discord** : [Lien du serveur Discord]
- **Reddit** : r/mealmate

---

**Bon développement ! 🚀**
