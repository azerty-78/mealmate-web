# MEALMATE Web - Application Complète de Gestion du Diabète

Une application web responsive et complète conçue pour la gestion du diabète, incluant des fonctionnalités avancées pour les personnes diabétiques, les médecins et les administrateurs. L'application intègre l'intelligence artificielle, la gestion médicale complète, et des outils de communication modernes.

## 🚀 Fonctionnalités Opérationnelles

### 🔐 Authentification & Sécurité
- **Page de connexion** avec email et mot de passe
- **Page d'inscription** avec formulaire complet et validation
- **Connexion Google** (interface prête)
- **Gestion des sessions** avec localStorage sécurisé
- **Redirection automatique** vers la page d'accueil après connexion
- **Déconnexion sécurisée** avec nettoyage des données
- **Protection des routes** - accès restreint aux utilisateurs connectés

### 👤 Gestion des Profils & Utilisateurs
- **Types de profils** : Personne diabétique, Médecin, Administrateur
- **Photo de profil** optionnelle (conversion base64, validation taille/type)
- **Informations personnelles** complètes
- **Affichage dynamique** dans le TopBar et modales
- **Assignation automatique** de médecins aux personnes diabétiques
- **Gestion des relations** médecin-patient

### 🤖 Intelligence Artificielle & Chatbot
- **Coach IA nutritionnel** spécialisé pour les personnes diabétiques
- **Modèle Gemini 2.5 Flash** de Google
- **Analyse d'images** pour conseils nutritionnels
- **Chat intelligent** avec historique de conversation
- **Conseils personnalisés** selon le type de diabète et les besoins nutritionnels
- **Support multilingue** (français)
- **Gestion d'erreurs** robuste avec retry automatique

### 🏥 Gestion Médicale Complète
- **Dossiers diabétiques** complets avec CRUD complet
- **Paramètres médicaux** : Type de diabète, diagnostic, HbA1c, objectifs glycémiques
- **Suivi glycémique** : Enregistrement et historique des mesures
- **Gestion des médicaments** : CRUD complet avec horaires et posologie
- **Contacts d'urgence** : Gestion des contacts médicaux d'urgence
- **Rendez-vous médicaux** : Planification et suivi des consultations
- **Dossiers médicaux** : Export PDF/JSON/CSV des dossiers patients
- **Prescriptions médicales** : Gestion des ordonnances et traitements
- **Notes médicales** : Journal médical personnalisé

### 🎨 Interface Utilisateur & Expérience
- **Design responsive** optimisé pour mobile
- **TopBar fixe** avec profil utilisateur et notifications
- **BottomBar fixe** avec navigation principale
- **Animations fluides** entre les pages
- **Thème moderne** avec Tailwind CSS
- **Mode sombre** (en développement)
- **Indicateur de statut réseau** en temps réel
- **Gestion d'erreurs** avec messages utilisateur

### 📱 Pages & Navigation Spécialisées
- **Page d'accueil** avec campagnes de santé et statistiques
- **Dashboard diabétique** : Suivi glycémique, médicaments, repas recommandés
- **Dashboard médecin** : Gestion des patients, dossiers médicaux, consultations
- **Dashboard administrateur** : Gestion des repas, utilisateurs, campagnes
- **Chat IA Coach** : Conseils nutritionnels personnalisés avec Gemini AI
- **Chat médecin** : Communication directe avec le Dr. Bernard Arnaud
- **Communauté** : Échanges entre utilisateurs diabétiques
- **Profil utilisateur** : Gestion complète des paramètres médicaux
- **Paramètres** : Configuration de l'application
- **Connexion/Inscription** : Authentification sécurisée multi-profils

### 🗄️ Base de Données & API Complète
- **JSON Server** pour l'API de développement avec endpoints complets
- **Utilisateurs** : Gestion multi-profils (diabétique, médecin, administrateur)
- **Dossiers diabétiques** : Paramètres médicaux, historique, objectifs
- **Repas recommandés** : 12+ plats camerounais diabétiques avec valeurs nutritionnelles
- **Médicaments** : Base de données des traitements diabétiques
- **Rendez-vous médicaux** : Planification et suivi des consultations
- **Dossiers médicaux** : Historique complet des consultations
- **Prescriptions** : Gestion des ordonnances et traitements
- **Contacts d'urgence** : Base de données des contacts médicaux
- **Lectures glycémiques** : Historique des mesures de glycémie
- **Notifications** : Système de notifications en temps réel
- **Cache intelligent** : Optimisation des performances

### 🍽️ Nutrition & Alimentation
- **Repas camerounais** : 12+ plats traditionnels adaptés aux diabétiques
- **Valeurs nutritionnelles** : Calories, protéines, glucides, index glycémique
- **Recommandations IA** : Conseils personnalisés basés sur le profil diabétique
- **Planification des repas** : Suggestions selon les objectifs glycémiques
- **Ingrédients détaillés** : Liste complète avec quantités et types
- **Instructions de préparation** : Étapes détaillées pour chaque recette
- **Conseils nutritionnels** : Tips spécialisés pour le contrôle glycémique

### 💊 Gestion des Médicaments
- **CRUD complet** : Création, modification, suppression des médicaments
- **Horaires de prise** : Planification des prises avec rappels
- **Posologie** : Dosage et fréquence personnalisés
- **Suivi de l'observance** : Marquage des prises effectuées
- **Historique** : Journal des prises de médicaments
- **Alertes** : Notifications pour les prises oubliées

### 📊 Suivi Glycémique Avancé
- **Enregistrement** : Mesures de glycémie à jeun, avant/après repas
- **Historique complet** : Graphiques et tendances
- **Objectifs personnalisés** : Plages cibles selon le type de diabète
- **Analyse des tendances** : Évolution sur différentes périodes
- **Notes contextuelles** : Commentaires sur les mesures
- **Export des données** : Sauvegarde des historiques

### 🏥 Interface Médecin
- **Dashboard spécialisé** : Vue d'ensemble des patients diabétiques
- **Dossiers patients** : Accès complet aux dossiers médicaux
- **Consultations** : Planification et suivi des rendez-vous
- **Prescriptions** : Création et gestion des ordonnances
- **Export de dossiers** : Génération PDF/JSON des dossiers patients
- **Communication** : Chat direct avec les patients
- **Spécialités médicales** : Endocrinologie, diabétologie, médecine interne

### 👨‍💼 Interface Administrateur
- **Gestion des repas** : CRUD complet des recettes diabétiques
- **Gestion des utilisateurs** : Administration des comptes
- **Campagnes de santé** : Création et gestion des campagnes
- **Statistiques** : Tableaux de bord et métriques
- **Notifications** : Système de notifications administrateur
- **Toasts** : Feedback utilisateur pour toutes les opérations

## 🛠️ Installation Rapide

### Prérequis
- **Node.js** 18+ (télécharger depuis [nodejs.org](https://nodejs.org/))
- **npm** 8+ (inclus avec Node.js)
- **Git** (télécharger depuis [git-scm.com](https://git-scm.com/))

### Installation en 3 étapes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/mealmate-web.git
cd mealmate-web

# 2. Installer les dépendances
npm install

# 3. Démarrer l'application
npm run dev:full
```

### Accès à l'application
- **Application** : http://localhost:5173
- **API Base de données** : http://localhost:3001
- **Documentation API** : http://localhost:3001

### 🧪 Comptes de Test Préconfigurés

#### Personne Diabétique (Marie Hélène)
- **Email** : marie.helene@example.com
- **Mot de passe** : password123
- **Type** : diabetic_person
- **Données** : Dossier diabétique complet, historique glycémique, médicaments

#### Médecin (Dr. Bernard Arnaud)
- **Email** : bernard.arnaud@example.com
- **Mot de passe** : password123
- **Type** : doctor
- **Spécialité** : Diabétologie
- **Données** : Patients assignés, dossiers médicaux, prescriptions

#### Administrateur
- **Email** : admin@mealmate.com
- **Mot de passe** : admin123
- **Type** : administrator
- **Accès** : Gestion complète des repas, utilisateurs, campagnes

> 📖 **Guide d'installation détaillé** : Voir [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md) pour une installation complète avec résolution des problèmes.

## 🔧 Configuration

### Variables d'environnement
```bash
# Créer un fichier .env (optionnel)
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=MEALMATE Web
GEMINI_API_KEY=AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw
```

### Configuration Vite
Le fichier `vite.config.ts` est configuré pour :
- **Support ngrok** pour le partage local
- **Hot Module Replacement** (HMR) pour le développement
- **Build optimisé** pour la production
- **Proxy API** pour éviter les problèmes CORS
- **Support multi-plateforme** (Windows, macOS, Linux)

### Configuration Gemini AI
```typescript
// src/config/gemini.ts
export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw',
  modelName: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1500,
    topP: 0.8,
    topK: 40
  }
};
```

### Configuration Tailwind
Le fichier `tailwind.config.js` inclut :
- **Configuration responsive** mobile-first
- **Classes personnalisées** pour l'application
- **Support des animations** fluides
- **Thème cohérent** avec Material Design

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── TopBar.tsx      # Barre de navigation supérieure
│   ├── BottomBar.tsx   # Barre de navigation inférieure
│   └── SlideTransition.tsx # Animation de transition
├── contexts/           # Contextes React
│   └── NavigationContext.tsx # Gestion de la navigation
├── hooks/              # Hooks personnalisés
│   └── useAuth.tsx     # Gestion de l'authentification
├── layouts/            # Layouts de pages
│   └── MainLayout.tsx  # Layout principal
├── pages/              # Pages de l'application
│   ├── HomePage.tsx    # Page d'accueil
│   ├── DashboardPage.tsx # Tableau de bord
│   ├── CommunityPage.tsx # Communauté
│   ├── ProfilePage.tsx # Profil utilisateur
│   ├── SettingsPage.tsx # Paramètres
│   ├── SignInPage.tsx  # Connexion
│   └── SignUpPage.tsx  # Inscription
├── services/           # Services API
│   └── api.ts          # Configuration API
└── utils/              # Utilitaires
```

## 🚀 Scripts Disponibles

- `npm run dev` - Démarre l'application de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Exécute le linter ESLint
- `npm run db` - Démarre le serveur JSON Server
- `npm run dev:full` - Démarre l'application et la base de données

## 🔒 Sécurité

- **Authentification obligatoire** : Accès restreint aux utilisateurs connectés
- **Validation des données** : Vérification des formulaires côté client
- **Gestion des sessions** : Stockage sécurisé des données utilisateur
- **Types de profils limités** : Seuls "Personne diabétique" et "Médecin" peuvent s'inscrire

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- **Mobile** (priorité)
- **Tablette**
- **Desktop** (compatible)

## 🆕 Fonctionnalités Récentes & Corrections

### ✅ Corrections Majeures (Décembre 2024)
- **Chat IA** : Correction des problèmes de chargement infini et redirection
- **Authentification** : Vérification d'authentification ajoutée au chat IA
- **Nom du médecin** : Correction "Dr. Djeff" → "Dr. Bernard Arnaud"
- **API Endpoints** : Correction des endpoints `/meals` → `/meal-templates`
- **Dashboard médecin** : Adaptation complète pour les patients diabétiques
- **Export de dossiers** : Génération PDF/JSON avec données diabétiques
- **Spécialités médicales** : Mise à jour des options pour diabétologues

### 🆕 Nouvelles Fonctionnalités
- **Modales interactives** : CRUD complet pour paramètres médicaux, médicaments, contacts d'urgence
- **Repas camerounais** : 12+ recettes traditionnelles adaptées aux diabétiques
- **Suivi glycémique** : Interface complète d'enregistrement et d'historique
- **Gestion des médicaments** : CRUD complet avec horaires et posologie
- **Export de données** : PDF, JSON, CSV pour tous les dossiers médicaux
- **Toasts de feedback** : Notifications pour toutes les opérations CRUD
- **Interface responsive** : Optimisation mobile et tablette

### 🔧 Améliorations Techniques
- **Gestion d'erreurs** : Amélioration de la robustesse des API calls
- **Types TypeScript** : Correction de tous les types et interfaces
- **Performance** : Optimisation des re-renders et des requêtes
- **Sécurité** : Vérification d'authentification sur toutes les pages sensibles
- **Code quality** : Nettoyage des imports et variables non utilisées

## 🎯 Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Material-UI Icons** pour les icônes
- **JSON Server** pour l'API de développement
- **React Context API** pour la gestion d'état
- **React Hooks** pour la logique des composants
- **Google Gemini AI** pour l'assistance nutritionnelle
- **jsPDF** pour la génération de PDF
- **React Router** pour la navigation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

---

**Développé avec ❤️ pour la gestion du diabète**