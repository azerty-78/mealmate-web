# Guide de Contribution - MEALMATE Web

Merci de votre intérêt à contribuer à MEALMATE Web ! Ce guide vous aidera à comprendre comment contribuer efficacement au projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Processus de Développement](#processus-de-développement)
- [Standards de Code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Rapport de Bugs](#rapport-de-bugs)
- [Demandes de Fonctionnalités](#demandes-de-fonctionnalités)

## 🤝 Code de Conduite

### Nos Engagements

Nous nous engageons à créer un environnement ouvert et accueillant pour tous, indépendamment de :
- L'âge, la taille, le handicap, l'ethnicité
- L'identité et l'expression de genre
- Le niveau d'expérience, la nationalité
- L'apparence personnelle, la race, la religion
- L'identité et l'orientation sexuelles

### Comportements Acceptables

- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres

### Comportements Inacceptables

- L'utilisation de langage ou d'images sexualisés
- Le trolling, les commentaires insultants ou désobligeants
- Le harcèlement public ou privé
- La publication d'informations privées sans permission
- Toute conduite inappropriée dans un contexte professionnel

## 🚀 Comment Contribuer

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis cloner votre fork
git clone https://github.com/votre-username/mealmate-web.git
cd mealmate-web

# Ajouter le repository original comme remote
git remote add upstream https://github.com/original-username/mealmate-web.git
```

### 2. Configuration de l'Environnement

```bash
# Installer les dépendances
npm install

# Démarrer l'application
npm run dev:full

# Vérifier que tout fonctionne
npm run lint
```

### 3. Créer une Branche

```bash
# Créer une nouvelle branche pour votre fonctionnalité
git checkout -b feature/nom-de-votre-fonctionnalite

# Ou pour un bug fix
git checkout -b fix/description-du-bug
```

### 4. Développement

- Faire vos modifications
- Tester vos changements
- Suivre les standards de code
- Documenter vos changements

### 5. Commit et Push

```bash
# Ajouter vos modifications
git add .

# Commit avec un message descriptif
git commit -m "feat: ajouter nouvelle fonctionnalité de suivi glycémique"

# Push vers votre fork
git push origin feature/nom-de-votre-fonctionnalite
```

### 6. Pull Request

- Créer une Pull Request sur GitHub
- Décrire clairement vos changements
- Référencer les issues liées
- Attendre la review

## 🔄 Processus de Développement

### Workflow Git

1. **Main** : Branche principale stable
2. **Develop** : Branche de développement
3. **Feature/** : Nouvelles fonctionnalités
4. **Fix/** : Corrections de bugs
5. **Hotfix/** : Corrections urgentes

### Convention de Branches

```bash
# Nouvelles fonctionnalités
feature/suivi-glycemique
feature/chat-ia-ameliorations
feature/export-pdf

# Corrections de bugs
fix/authentification-chat
fix/performance-dashboard
fix/responsive-mobile

# Corrections urgentes
hotfix/security-vulnerability
hotfix/critical-bug
```

### Convention de Commits

Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Types de commits
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, point-virgules manquants
refactor: refactoring du code
test: ajout de tests
chore: tâches de maintenance

# Exemples
git commit -m "feat: ajouter modal de gestion des médicaments"
git commit -m "fix: corriger problème de chargement du chat IA"
git commit -m "docs: mettre à jour README avec nouvelles fonctionnalités"
```

## 📝 Standards de Code

### TypeScript

```typescript
// ✅ Bon
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileType: 'diabetic_person' | 'doctor' | 'administrator';
}

// ❌ Éviter
interface User {
  id: any;
  email: string;
  firstName: string;
  lastName: string;
  profileType: string;
}
```

### React Components

```typescript
// ✅ Bon
interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  data: SomeType[];
}

const MyComponent: React.FC<ComponentProps> = ({ 
  isOpen, 
  onClose, 
  data 
}) => {
  const [state, setState] = useState<SomeType[]>([]);

  useEffect(() => {
    // Logique d'effet
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### CSS/Tailwind

```tsx
// ✅ Bon - Classes Tailwind
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Titre</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
    Action
  </button>
</div>

// ❌ Éviter - CSS inline
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Titre</h2>
</div>
```

### Naming Conventions

```typescript
// ✅ Bon
const DiabeticDashboardPage: React.FC = () => { ... };
const handleSaveMedicalParams = () => { ... };
const isModalOpen = useState(false);
const MEDICAL_PARAMS_DEFAULT = { ... };

// ❌ Éviter
const diabeticDashboardPage = () => { ... };
const saveMedicalParams = () => { ... };
const modalOpen = useState(false);
const medicalParamsDefault = { ... };
```

## 🧪 Tests

### Tests Unitaires

```typescript
// Exemple de test
import { render, screen } from '@testing-library/react';
import { DiabeticDashboardPage } from '../DiabeticDashboardPage';

describe('DiabeticDashboardPage', () => {
  it('affiche le titre du dashboard', () => {
    render(<DiabeticDashboardPage />);
    expect(screen.getByText('Dashboard Diabétique')).toBeInTheDocument();
  });
});
```

### Tests d'Intégration

```typescript
// Test d'intégration API
import { userApi } from '../services/api';

describe('User API', () => {
  it('récupère les utilisateurs avec succès', async () => {
    const users = await userApi.getAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
  });
});
```

### Tests E2E

```typescript
// Test end-to-end
describe('Authentification', () => {
  it('permet à un utilisateur de se connecter', () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## 📚 Documentation

### Documentation du Code

```typescript
/**
 * Gère les paramètres médicaux d'un patient diabétique
 * @param diabeticRecord - Dossier diabétique du patient
 * @param onSave - Callback appelé lors de la sauvegarde
 * @returns JSX.Element
 */
const MedicalParamsModal: React.FC<MedicalParamsModalProps> = ({
  diabeticRecord,
  onSave
}) => {
  // Implémentation
};
```

### Documentation des API

```typescript
/**
 * API pour la gestion des dossiers diabétiques
 */
export const diabeticApi = {
  /**
   * Récupère le dossier diabétique d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Promise<DiabeticRecord>
   */
  getByUserId: (userId: number): Promise<DiabeticRecord> => {
    return request<DiabeticRecord>(`/diabetic-records?userId=${userId}`);
  }
};
```

### README des Composants

```markdown
# MedicalParamsModal

Modal pour la gestion des paramètres médicaux des patients diabétiques.

## Props

- `isOpen: boolean` - État d'ouverture du modal
- `onClose: () => void` - Callback de fermeture
- `diabeticRecord: DiabeticRecord | null` - Dossier diabétique
- `onSave: (data: Partial<DiabeticRecord>) => void` - Callback de sauvegarde

## Utilisation

```tsx
<MedicalParamsModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  diabeticRecord={currentRecord}
  onSave={handleSave}
/>
```
```

## 🐛 Rapport de Bugs

### Template de Bug Report

```markdown
## Description du Bug
Description claire et concise du problème.

## Étapes pour Reproduire
1. Aller à la page '...'
2. Cliquer sur '...'
3. Faire défiler vers '...'
4. Voir l'erreur

## Comportement Attendu
Description de ce qui devrait se passer.

## Comportement Actuel
Description de ce qui se passe actuellement.

## Captures d'Écran
Si applicable, ajouter des captures d'écran.

## Environnement
- OS: [ex. Windows 10, macOS 12.0, Ubuntu 20.04]
- Navigateur: [ex. Chrome 96, Firefox 94, Safari 15]
- Version de l'app: [ex. 2.0.0]

## Logs
```
Coller les logs d'erreur ici
```

## Informations Supplémentaires
Toute autre information pertinente.
```

## 💡 Demandes de Fonctionnalités

### Template de Feature Request

```markdown
## Résumé de la Fonctionnalité
Description claire et concise de la fonctionnalité souhaitée.

## Problème à Résoudre
Description du problème que cette fonctionnalité résoudrait.

## Solution Proposée
Description de la solution que vous aimeriez voir.

## Alternatives Considérées
Description des solutions alternatives que vous avez considérées.

## Contexte Additionnel
Toute autre information ou contexte sur la fonctionnalité.
```

## 🔍 Review Process

### Checklist pour les Pull Requests

#### Code
- [ ] Le code suit les standards du projet
- [ ] Les types TypeScript sont corrects
- [ ] Les composants sont réutilisables
- [ ] Les performances sont optimisées
- [ ] Les erreurs sont gérées correctement

#### Tests
- [ ] Les tests unitaires passent
- [ ] Les tests d'intégration passent
- [ ] Les tests E2E passent
- [ ] La couverture de code est maintenue

#### Documentation
- [ ] Le code est documenté
- [ ] Le README est mis à jour si nécessaire
- [ ] Le CHANGELOG est mis à jour
- [ ] Les types sont exportés correctement

#### UI/UX
- [ ] L'interface est responsive
- [ ] Les animations sont fluides
- [ ] L'accessibilité est respectée
- [ ] Les couleurs et typographies sont cohérentes

### Processus de Review

1. **Auto-review** : Vérifier votre propre code
2. **Tests** : S'assurer que tous les tests passent
3. **Documentation** : Mettre à jour la documentation
4. **Pull Request** : Créer la PR avec description détaillée
5. **Review** : Attendre la review des maintainers
6. **Modifications** : Apporter les corrections demandées
7. **Merge** : Une fois approuvé, la PR est mergée

## 📞 Support

### Questions Générales
- **GitHub Issues** : Pour les questions et discussions
- **Discussions** : Pour les questions générales
- **Email** : [votre-email@example.com]

### Questions Techniques
- **Documentation** : Consulter la documentation du projet
- **Code Examples** : Regarder les exemples dans le code
- **Issues** : Rechercher dans les issues existantes

## 🎯 Projets de Contribution

### Pour les Débutants
- [ ] Correction de typos dans la documentation
- [ ] Amélioration des messages d'erreur
- [ ] Ajout de tests unitaires
- [ ] Amélioration de l'accessibilité

### Pour les Intermédiaires
- [ ] Nouvelles fonctionnalités UI
- [ ] Optimisation des performances
- [ ] Amélioration des tests
- [ ] Refactoring de composants

### Pour les Avancés
- [ ] Architecture et design patterns
- [ ] Intégration d'APIs externes
- [ ] Optimisation de la base de données
- [ ] Sécurité et authentification

---

**Merci de contribuer à MEALMATE Web ! Votre contribution aide à améliorer la gestion du diabète pour tous. 🎉**
