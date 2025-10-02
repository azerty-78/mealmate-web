# Guide d'Installation - MEALMATE Web

## 📋 Prérequis Système

### Configuration Minimale
- **OS** : Windows 10/11, macOS 10.15+, ou Linux Ubuntu 18.04+
- **RAM** : 4 GB minimum (8 GB recommandé)
- **Espace disque** : 2 GB libres
- **Résolution** : 1024x768 minimum

### Logiciels Requis

#### 1. Node.js (Obligatoire)
- **Version** : 18.0.0 ou supérieure
- **Téléchargement** : [nodejs.org](https://nodejs.org/)
- **Vérification** : `node --version` (doit afficher v18+)
- **npm inclus** : Vérification avec `npm --version`

#### 2. Git (Obligatoire)
- **Téléchargement** : [git-scm.com](https://git-scm.com/)
- **Vérification** : `git --version`
- **Configuration** : `git config --global user.name "Votre Nom"`

#### 3. Éditeur de Code (Recommandé)
- **Visual Studio Code** : [code.visualstudio.com](https://code.visualstudio.com/)
- **Extensions recommandées** :
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter

## 🚀 Installation Étape par Étape

### Étape 1 : Cloner le Projet

```bash
# Ouvrir un terminal/command prompt
# Naviguer vers le dossier souhaité
cd C:\Users\VotreNom\Desktop

# Cloner le repository
git clone https://github.com/votre-username/mealmate-web.git

# Entrer dans le dossier du projet
cd mealmate-web
```

### Étape 2 : Installation des Dépendances

```bash
# Installer toutes les dépendances
npm install

# Vérifier l'installation
npm list --depth=0
```

**Si erreur d'installation :**
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
# ou
rmdir /s node_modules & del package-lock.json  # Windows

# Réinstaller
npm install
```

### Étape 3 : Configuration de l'Environnement

#### Créer le fichier .env (Optionnel)
```bash
# Créer le fichier .env à la racine du projet
touch .env  # Linux/Mac
# ou
type nul > .env  # Windows
```

#### Contenu du fichier .env
```env
# Configuration API
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=MEALMATE Web

# Configuration Gemini AI
VITE_GEMINI_API_KEY=AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw

# Configuration de développement
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
```

### Étape 4 : Démarrage de l'Application

#### Option A : Démarrage Complet (Recommandé)
```bash
# Démarrer l'application + base de données
npm run dev:full
```

#### Option B : Démarrage Séparé
```bash
# Terminal 1 : Démarrer la base de données
npm run db

# Terminal 2 : Démarrer l'application
npm run dev
```

### Étape 5 : Vérification de l'Installation

1. **Ouvrir le navigateur** : http://localhost:5173
2. **Vérifier l'API** : http://localhost:3001
3. **Tester la connexion** : Créer un compte utilisateur
4. **Vérifier les fonctionnalités** : Navigation, chat IA, profil

## 🔧 Configuration Avancée

### Configuration du Serveur JSON

Le fichier `db.json` contient toutes les données de l'application :

```json
{
  "users": [...],           // Utilisateurs de l'application
  "diabeticRecords": [...], // Dossiers diabétiques
  "meals": [...],           // Repas recommandés
  "appointments": [...],    // Rendez-vous médicaux
  "medicalRecords": [...]   // Dossiers médicaux
}
```

### Configuration Vite

Le fichier `vite.config.ts` est préconfiguré pour :
- **Proxy API** : Redirection automatique des requêtes API
- **HMR** : Hot Module Replacement pour le développement
- **Build optimisé** : Configuration de production
- **Support ngrok** : Partage local sécurisé

### Configuration Tailwind CSS

Le fichier `tailwind.config.js` inclut :
- **Classes personnalisées** pour l'application
- **Animations** fluides
- **Responsive design** mobile-first
- **Thème cohérent** avec Material Design

## 🐛 Résolution des Problèmes

### Problème : Port déjà utilisé

**Erreur** : `Port 5173 is already in use`

**Solution** :
```bash
# Trouver le processus utilisant le port
netstat -ano | findstr :5173  # Windows
lsof -i :5173  # Linux/Mac

# Tuer le processus
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Linux/Mac

# Ou utiliser un autre port
npm run dev -- --port 3000
```

### Problème : Erreur de dépendances

**Erreur** : `Cannot find module` ou `npm ERR!`

**Solution** :
```bash
# Nettoyer complètement
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Ou forcer la réinstallation
npm install --force
```

### Problème : API non accessible

**Erreur** : `Failed to fetch` ou `Connection refused`

**Solution** :
1. Vérifier que le serveur JSON est démarré : `npm run db`
2. Vérifier l'URL dans le navigateur : http://localhost:3001
3. Vérifier les logs dans le terminal
4. Redémarrer l'application : `npm run dev:full`

### Problème : Chat IA ne fonctionne pas

**Erreur** : `Gemini API error` ou `Timeout`

**Solution** :
1. Vérifier la clé API Gemini dans `.env`
2. Vérifier la connexion internet
3. Vérifier les logs dans la console du navigateur
4. Redémarrer l'application

### Problème : Authentification échoue

**Erreur** : `User not found` ou `Invalid credentials`

**Solution** :
1. Vérifier que la base de données est démarrée
2. Vérifier les données dans `db.json`
3. Créer un nouvel utilisateur via l'interface
4. Vérifier les logs dans la console

## 📱 Test de l'Application

### Comptes de Test

L'application inclut des comptes de test préconfigurés :

#### Personne Diabétique
- **Email** : marie.helene@example.com
- **Mot de passe** : password123
- **Type** : diabetic_person

#### Médecin
- **Email** : bernard.arnaud@example.com
- **Mot de passe** : password123
- **Type** : doctor

#### Administrateur
- **Email** : admin@mealmate.com
- **Mot de passe** : admin123
- **Type** : administrator

### Fonctionnalités à Tester

1. **Authentification** : Connexion/déconnexion
2. **Navigation** : Toutes les pages accessibles
3. **Chat IA** : Posez des questions sur le diabète
4. **Profil** : Modification des informations
5. **Dashboard** : Affichage des données
6. **Communauté** : Chat avec le médecin
7. **Responsive** : Test sur mobile/tablette

## 🚀 Déploiement en Production

### Build de Production

```bash
# Créer la build de production
npm run build

# Prévisualiser la build
npm run preview
```

### Variables d'Environnement Production

```env
# .env.production
VITE_API_URL=https://api.mealmate.com
VITE_APP_NAME=MEALMATE Web
VITE_GEMINI_API_KEY=your_production_api_key
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### Serveur de Production

Pour déployer en production, vous aurez besoin de :
- **Serveur web** : Nginx, Apache, ou serveur Node.js
- **Base de données** : PostgreSQL, MySQL, ou MongoDB
- **CDN** : Pour les assets statiques
- **SSL** : Certificat HTTPS

## 📞 Support et Aide

### Logs et Debugging

```bash
# Activer le mode debug
VITE_DEBUG_MODE=true npm run dev

# Voir les logs détaillés
npm run dev -- --debug

# Vérifier les erreurs
npm run lint
```

### Ressources Utiles

- **Documentation React** : [reactjs.org](https://reactjs.org/)
- **Documentation Vite** : [vitejs.dev](https://vitejs.dev/)
- **Documentation Tailwind** : [tailwindcss.com](https://tailwindcss.com/)
- **Documentation Gemini** : [ai.google.dev](https://ai.google.dev/)

### Contact

Pour toute question ou problème :
1. Vérifier ce guide d'installation
2. Consulter les issues GitHub
3. Créer une nouvelle issue avec les détails
4. Inclure les logs d'erreur et la configuration système

---

**🎉 Félicitations ! Votre application MEALMATE Web est maintenant prête à être utilisée.**