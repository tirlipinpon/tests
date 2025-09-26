# 📁 Dossier Dynamic - Système de Quiz Dynamique

Ce dossier contient tous les fichiers du système de quiz dynamique organisés par type.

## 📂 Structure des Dossiers

```
dynamic/
├── pages/           # Pages HTML
│   ├── quiz.html    # Page quiz dynamique universelle
│   └── admin.html   # Interface d'administration
├── js/              # Scripts JavaScript
│   ├── quiz-dynamic.js    # Gestion du quiz dynamique
│   ├── admin.js           # Script d'administration
│   └── index-dynamic.js   # Chargement dynamique des quiz
├── css/             # Styles CSS
│   └── styles.css   # Styles communs (copie)
└── README.md        # Ce fichier
```

## 🚀 Utilisation

### Pages Principales

- **`pages/quiz.html`** : Page quiz dynamique

  - URL : `dynamic/pages/quiz.html?category=angular`
  - Fonctionne avec toutes les catégories

- **`pages/admin.html`** : Interface d'administration
  - URL : `dynamic/pages/admin.html`
  - Gestion des catégories et import de questions

### Scripts

- **`js/quiz-dynamic.js`** : Gestion du quiz dynamique
- **`js/admin.js`** : Fonctions d'administration
- **`js/index-dynamic.js`** : Chargement dynamique sur la page d'accueil

## 🔗 Intégration

Les fichiers sont intégrés dans :

- **`index.html`** (racine) : Utilise `dynamic/js/index-dynamic.js`
- **`pages/quiz.html`** : Utilise tous les scripts dynamiques
- **`pages/admin.html`** : Utilise les scripts d'administration

## 📝 Notes

- Tous les chemins sont relatifs depuis la racine du projet
- Les styles CSS sont partagés avec le système existant
- Compatible avec la structure Supabase existante
