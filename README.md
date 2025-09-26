# Quiz Supabase Project

Projet de quiz interactif avec intégration Supabase pour la gestion des questions.

## 🎯 Fonctionnalités

- **10 catégories de quiz** : Base de données, TypeScript, Angular, CSS, HTML, RxJS, Scope, Side Effects, Promises, Accessibilité WCAG
- **198 questions** au total dans la base de données
- **Chargement dynamique** depuis Supabase
- **Boutons de suppression** sur chaque question
- **Gestion des erreurs** avec fallback vers les données locales
- **Suppression douce** (marquage `deleted: true`)
- **Types de questions** : QCM et Input

## 📁 Structure du projet

```
quiz-expert/
├── 📄 Fichiers HTML (Quiz) - À la racine
│   ├── index.html                # Page d'accueil
│   ├── db.html                   # Quiz Base de données
│   ├── typescript.html           # Quiz TypeScript
│   ├── angular.html              # Quiz Angular
│   ├── angular2.html             # Quiz Angular 2
│   ├── angular3.html             # Quiz Angular 3
│   ├── css.html                  # Quiz CSS
│   ├── html.html                 # Quiz HTML
│   ├── rxjs.html                 # Quiz RxJS
│   ├── scope.html                # Quiz Scope
│   ├── side.html                 # Quiz Side
│   ├── this.html                 # Quiz This
│   ├── promise.html              # Quiz Promise
│   └── wcag.html                 # Quiz WCAG
├── 📁 js/                        # Scripts JavaScript
│   ├── quiz-supabase.js          # Fonctions communes Supabase
│   ├── quiz-common.js            # Logique commune des quiz
│   ├── navigation.js             # Navigation entre les pages
│   ├── cookie-manager.js         # Gestion des cookies
│   └── config.js                 # Configuration Supabase
├── 📁 css/                       # Fichiers CSS
│   └── styles.css                # Styles principaux
├── 📁 data/                      # Données de fallback
│   ├── db-fallback-data.js
│   ├── typescript-fallback-data.js
│   ├── angular-fallback-data.js
│   └── ... (autres catégories)
├── 📁 scripts/                   # Scripts Node.js utilitaires
│   ├── get-quiz-data.js          # Récupération des données
│   └── manage-questions.js       # Gestion des questions (CLI)
├── 📁 backup/                    # Fichiers de sauvegarde
│   └── *.backup, *.old          # Sauvegardes des fichiers
├── 📁 node_modules/              # Dépendances Node.js
├── package.json                  # Dépendances et scripts
└── README.md                     # Documentation
```

### 🏗️ Architecture modulaire

- **`js/quiz-supabase.js`** : Fonctions communes pour l'intégration Supabase

  - `loadQuizDataFromSupabase(category)`
  - `deleteQuestion(questionId)`
  - `restoreQuestion(questionId)`
  - `addDeleteButtons(category)`
  - `initializeQuiz(category)`

- **`data/*-fallback-data.js`** : Sauvegarde des données pour chaque catégorie (non utilisées en production)

  - `getFallbackQuizData()` : Fonction qui retourne les données locales (sauvegarde uniquement)

- **`*.html`** : Pages de quiz simplifiées
  - Chargement des scripts communs depuis `js/`
  - Appel simple à `initializeQuiz(category)`
  - Chargement direct depuis Supabase

## 🚀 Installation

```bash
npm install
```

## 📊 Gestion des questions

### Scripts disponibles

```bash
# Récupérer les données de quiz
npm run get

# Gérer les questions (CLI)
npm run manage
```

### Commandes de gestion

```bash
# Lister toutes les questions
npm run manage list

# Afficher les statistiques
npm run manage stats

# Supprimer une question (soft delete)
npm run manage delete <question_id>

# Restaurer une question
npm run manage restore <question_id>

# Supprimer définitivement une question
npm run manage permanent-delete <question_id>
```

## 🎮 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Naviguez vers la catégorie de quiz souhaitée
3. Les questions se chargent automatiquement depuis Supabase
4. Utilisez les boutons "🗑️ Supprimer" pour supprimer des questions
5. Les explications s'affichent après validation

## 🗄️ Base de données

### Table `quiz_questions`

| Champ            | Type    | Description                |
| ---------------- | ------- | -------------------------- |
| `id`             | SERIAL  | ID unique                  |
| `question_id`    | VARCHAR | Identifiant de la question |
| `title`          | TEXT    | Titre de la question       |
| `code`           | TEXT    | Code d'exemple             |
| `options`        | JSON    | Options pour QCM           |
| `correct_answer` | JSON    | Réponse(s) correcte(s)     |
| `question_type`  | VARCHAR | Type (qcm/input)           |
| `explanation`    | TEXT    | Explication                |
| `category`       | VARCHAR | Catégorie                  |
| `deleted`        | BOOLEAN | Statut de suppression      |

### Catégories disponibles

- **db** : Base de données (50 questions)
- **typescript** : TypeScript (32 questions)
- **angular** : Angular (47 questions)
- **css** : CSS (5 questions)
- **html** : HTML (4 questions)
- **rxjs** : RxJS (2 questions)
- **scope** : JavaScript Scope (13 questions)
- **side** : Side Effects (4 questions)
- **promise** : Promises (21 questions)
- **wcag** : Accessibilité (20 questions)

## 🔧 Configuration

Les informations de connexion Supabase sont dans `js/config.js` :

```javascript
const SUPABASE_URL = "https://zmgfaiprgbawcernymqa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

## 📝 Notes

- Toutes les questions sont chargées depuis Supabase
- En cas d'erreur de connexion, les données de fallback sont utilisées
- Les suppressions sont des "soft delete" (marquage `deleted: true`)
- Les boutons de suppression apparaissent automatiquement sur chaque question
- **Structure organisée** : fichiers HTML à la racine, autres fichiers dans des dossiers spécialisés
- **Chemins mis à jour** : tous les fichiers HTML pointent vers les nouveaux emplacements
