# 🚀 Démarrage rapide avec ngrok

Ce guide vous permet de partager votre application MealMate en quelques commandes simples.

## 📋 Prérequis

1. **Node.js** installé
2. **Compte ngrok gratuit** (optionnel mais recommandé)

## 🎯 Démarrage ultra-rapide

### Option 1 : Configuration automatique (recommandée)

```bash
# 1. Installer les dépendances
npm install

# 2. Configuration automatique de ngrok
npm run ngrok:setup

# 3. Démarrer avec ngrok
npm run ngrok
```

### Option 2 : Configuration manuelle

```bash
# 1. Installer les dépendances
npm install

# 2. Installer ngrok (si pas déjà fait)
# Windows: winget install ngrok.ngrok
# macOS: brew install ngrok/ngrok/ngrok
# Linux: sudo snap install ngrok

# 3. Configurer votre token ngrok (optionnel)
npm run ngrok:config YOUR_TOKEN

# 4. Démarrer avec ngrok
npm run ngrok
```

## 🌐 URLs générées

Après le démarrage, vous obtiendrez :

- **🌐 Application** : `https://xxxxx.ngrok.io` (partagez cette URL)
- **🔌 API** : `https://yyyyy.ngrok.io` (pour les développeurs)

## 📱 Partage de l'application

### Pour les utilisateurs finaux
Partagez simplement l'URL de l'application :
```
https://xxxxx.ngrok.io
```

### Pour les développeurs
Partagez les deux URLs :
```
Frontend: https://xxxxx.ngrok.io
API: https://yyyyy.ngrok.io
```

## 🔧 Commandes utiles

```bash
# Démarrer avec ngrok
npm run ngrok

# Configuration de ngrok uniquement
npm run ngrok:start

# Configuration du token ngrok
npm run ngrok:config YOUR_TOKEN

# Démarrage normal (sans ngrok)
npm run dev:full
```

## 🛠️ Dépannage

### Problème : "ngrok not found"
```bash
# Installer ngrok
npm run ngrok:setup
```

### Problème : "authtoken required"
```bash
# Obtenir un token gratuit sur https://dashboard.ngrok.com/get-started/your-authtoken
npm run ngrok:config YOUR_TOKEN
```

### Problème : "port already in use"
```bash
# Arrêter les processus existants
# Windows: Ctrl+C dans les terminaux
# macOS/Linux: killall node
```

## 📊 Avantages de ngrok

- ✅ **Partage instantané** : Partagez votre app en 30 secondes
- ✅ **HTTPS automatique** : Sécurité intégrée
- ✅ **Pas de configuration réseau** : Fonctionne derrière un firewall
- ✅ **URLs persistantes** : Même URL pendant la session
- ✅ **Inspection des requêtes** : Debug facile
- ✅ **CORS configuré** : Compatible avec l'API

## 🎉 C'est tout !

Votre application MealMate est maintenant accessible depuis n'importe où dans le monde !

**Partagez l'URL et testez votre application !** 🚀
