# 🗄️ Guide d'accès à la base de données MealMate

Ce guide vous explique toutes les méthodes pour consulter, modifier et gérer votre base de données MealMate.

## 📋 Table des matières

1. [Démarrage de la base de données](#démarrage-de-la-base-de-données)
2. [Accès via l'interface web](#accès-via-linterface-web)
3. [Accès via l'API REST](#accès-via-lapi-rest)
4. [Accès direct aux fichiers JSON](#accès-direct-aux-fichiers-json)
5. [Collections disponibles](#collections-disponibles)
6. [Outils de développement](#outils-de-développement)
7. [Commandes utiles](#commandes-utiles)
8. [Résolution de problèmes](#résolution-de-problèmes)

## 🚀 Démarrage de la base de données

### Option 1 : Démarrage simple
```bash
npm run db
```
- **Port** : 3001
- **Interface** : http://localhost:3001
- **Durée** : Jusqu'à arrêt manuel (Ctrl+C)

### Option 2 : Démarrage complet (Frontend + BD)
```bash
npm run dev:full
```
- **Frontend** : http://localhost:5173
- **Base de données** : http://localhost:3001
- **Durée** : Jusqu'à arrêt manuel (Ctrl+C)

### Option 3 : Démarrage intelligent
```bash
npm run dev
```
- **Frontend** : http://localhost:5173
- **Base de données** : Détectée automatiquement
- **Bannière** : Affiche le statut de la BD

## 🌐 Accès via l'interface web

### Interface principale
1. Démarrez le serveur : `npm run db`
2. Ouvrez votre navigateur : http://localhost:3001
3. Vous verrez l'interface JSON Server avec :
   - Liste de toutes les collections
   - Liens cliquables vers chaque endpoint
   - Documentation des routes disponibles

### Navigation dans l'interface
- **Accueil** : http://localhost:3001
- **Collections** : Cliquez sur les liens dans la liste
- **Recherche** : Utilisez les paramètres de requête
- **Documentation** : Liens vers la documentation officielle

## 🔌 Accès via l'API REST

### Endpoints principaux

#### Utilisateurs
```bash
# Tous les utilisateurs
GET http://localhost:3001/users

# Utilisateur spécifique
GET http://localhost:3001/users/1

# Recherche par email
GET http://localhost:3001/users?email=marie.helene@example.com

# Recherche par type
GET http://localhost:3001/users?type=diabetic_person
```

#### Repas (Meals)
```bash
# Tous les repas
GET http://localhost:3001/meals

# Repas spécifique
GET http://localhost:3001/meals/1

# Repas diabétiques
GET http://localhost:3001/meals?diabeticFriendly=true

# Repas par catégorie
GET http://localhost:3001/meals?category=breakfast

# Repas actifs
GET http://localhost:3001/meals?isActive=true
```

#### Dossiers diabétiques
```bash
# Tous les dossiers
GET http://localhost:3001/diabeticRecords

# Dossier d'un utilisateur
GET http://localhost:3001/diabeticRecords?userId=1

# Dossier spécifique
GET http://localhost:3001/diabeticRecords/1
```

#### Médicaments
```bash
# Tous les médicaments
GET http://localhost:3001/medications

# Médicaments d'un utilisateur
GET http://localhost:3001/medications?userId=1

# Médicament spécifique
GET http://localhost:3001/medications/1
```

#### Logs de médicaments
```bash
# Tous les logs
GET http://localhost:3001/medicationLogs

# Logs d'un utilisateur
GET http://localhost:3001/medicationLogs?userId=1

# Logs d'aujourd'hui
GET http://localhost:3001/medicationLogs?date=2024-01-15
```

#### Injections d'insuline
```bash
# Toutes les injections
GET http://localhost:3001/insulinInjections

# Injections d'un utilisateur
GET http://localhost:3001/insulinInjections?userId=1

# Injections d'aujourd'hui
GET http://localhost:3001/insulinInjections?date=2024-01-15
```

#### Alertes
```bash
# Toutes les alertes
GET http://localhost:3001/alerts

# Alertes d'un utilisateur
GET http://localhost:3001/alerts?userId=1

# Alertes actives
GET http://localhost:3001/alerts?isActive=true
```

### Opérations CRUD

#### Créer une ressource
```bash
# Créer un utilisateur
POST http://localhost:3001/users
Content-Type: application/json

{
  "name": "Nouvel Utilisateur",
  "email": "nouveau@example.com",
  "type": "diabetic_person"
}
```

#### Modifier une ressource
```bash
# Modifier un utilisateur
PUT http://localhost:3001/users/1
Content-Type: application/json

{
  "name": "Nom Modifié",
  "email": "modifie@example.com"
}
```

#### Supprimer une ressource
```bash
# Supprimer un utilisateur
DELETE http://localhost:3001/users/1
```

## 📁 Accès direct aux fichiers JSON

### Fichier principal
- **Chemin** : `db/db.json`
- **Contenu** : Toutes les collections
- **Format** : JSON structuré

### Structure du fichier
```json
{
  "users": [...],
  "meals": [...],
  "diabeticRecords": [...],
  "medications": [...],
  "medicationLogs": [...],
  "insulinInjections": [...],
  "alerts": [...],
  "communityMessages": [...],
  "doctorChats": [...],
  "aiCoachChats": [...]
}
```

### Édition directe
1. Ouvrez `db/db.json` dans votre éditeur
2. Modifiez les données directement
3. Sauvegardez le fichier
4. Les changements sont immédiatement visibles

## 📊 Collections disponibles

### 1. **users** - Utilisateurs
```json
{
  "id": 1,
  "name": "Marie Hélène",
  "email": "marie.helene@example.com",
  "type": "diabetic_person",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. **meals** - Repas
```json
{
  "id": 1,
  "name": "Petit-déjeuner diabétique",
  "category": "breakfast",
  "diabeticFriendly": true,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. **diabeticRecords** - Dossiers diabétiques
```json
{
  "id": 1,
  "userId": 1,
  "diabetesType": "type2",
  "bloodGlucoseTargets": {
    "fasting": {"min": 80, "max": 130},
    "beforeMeals": {"min": 80, "max": 130},
    "afterMeals": {"min": 80, "max": 180}
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. **medications** - Médicaments
```json
{
  "id": 1,
  "userId": 1,
  "name": "Metformine",
  "dosage": "500mg",
  "frequency": "2 fois par jour",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. **medicationLogs** - Logs de médicaments
```json
{
  "id": 1,
  "userId": 1,
  "medicationId": 1,
  "takenTime": "2024-01-15T08:00:00.000Z",
  "notes": "Pris avec le petit-déjeuner",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```

### 6. **insulinInjections** - Injections d'insuline
```json
{
  "id": 1,
  "userId": 1,
  "type": "rapide",
  "units": 8,
  "injectionTime": "2024-01-15T08:00:00.000Z",
  "notes": "Avant le petit-déjeuner",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```

### 7. **alerts** - Alertes
```json
{
  "id": 1,
  "userId": 1,
  "type": "medication_reminder",
  "message": "N'oubliez pas de prendre votre médicament",
  "isActive": true,
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```

## 🛠️ Outils de développement

### 1. **Postman**
- Importez la collection d'API
- Testez tous les endpoints
- Sauvegardez les requêtes

### 2. **Insomnia**
- Interface graphique pour les requêtes
- Gestion des environnements
- Export/Import des requêtes

### 3. **Thunder Client** (VS Code)
- Extension VS Code
- Interface intégrée
- Gestion des collections

### 4. **curl** (Terminal)
```bash
# Test de connexion
curl http://localhost:3001

# Récupérer tous les utilisateurs
curl http://localhost:3001/users

# Créer un utilisateur
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","type":"diabetic_person"}'
```

## 🔧 Commandes utiles

### Vérification du statut
```bash
# Vérifier si le serveur est en cours d'exécution
curl http://localhost:3001/health

# Vérifier une collection spécifique
curl http://localhost:3001/users
```

### Recherche avancée
```bash
# Recherche par plusieurs critères
curl "http://localhost:3001/meals?diabeticFriendly=true&category=breakfast"

# Limiter le nombre de résultats
curl "http://localhost:3001/users?_limit=5"

# Trier les résultats
curl "http://localhost:3001/meals?_sort=name&_order=asc"

# Pagination
curl "http://localhost:3001/users?_page=1&_limit=10"
```

### Sauvegarde
```bash
# Sauvegarder toutes les données
curl http://localhost:3001 > backup.json

# Sauvegarder une collection
curl http://localhost:3001/users > users_backup.json
```

## 🚨 Résolution de problèmes

### Problème : Port 3001 déjà utilisé
```bash
# Vérifier ce qui utilise le port
netstat -ano | findstr :3001

# Tuer le processus (Windows)
taskkill /PID <PID> /F

# Tuer le processus (Linux/Mac)
kill -9 <PID>
```

### Problème : Données corrompues
1. Arrêtez le serveur (Ctrl+C)
2. Vérifiez le fichier `db/db.json`
3. Corrigez la syntaxe JSON
4. Redémarrez le serveur

### Problème : CORS
Le serveur est configuré pour accepter toutes les origines en développement.

### Problème : Données non sauvegardées
- Vérifiez que le fichier `db/db.json` est accessible en écriture
- Redémarrez le serveur après modification directe du fichier

## 📝 Conseils pratiques

1. **Sauvegardez régulièrement** votre fichier `db/db.json`
2. **Utilisez l'interface web** pour une navigation facile
3. **Testez vos modifications** avec des requêtes API
4. **Vérifiez la syntaxe JSON** avant de sauvegarder
5. **Utilisez des outils de développement** pour des opérations complexes

## 🔗 Liens utiles

- **Documentation JSON Server** : https://github.com/typicode/json-server
- **Interface web** : http://localhost:3001 (quand le serveur est démarré)
- **Fichier de données** : `db/db.json`
- **Configuration** : `db/routes.json`

---

**Note** : Ce guide couvre tous les aspects de l'accès à votre base de données MealMate. Pour toute question spécifique, consultez la documentation officielle de JSON Server.
