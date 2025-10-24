# Structure des Questions de Quiz

Ce dossier contient les fichiers JSON pour les questions de quiz du système dynamique.

## Fichier d'exemple

Le fichier `questions-exemple.json` contient un exemple complet de la structure attendue pour les questions de quiz.

## Structure d'une question

Chaque question doit contenir les champs suivants :

### Champs obligatoires

- **`question_id`** (string) : Identifiant unique de la question (ex: "javascript-001")
- **`title`** (string) : Le titre de la question
- **`question_type`** (string) : Type de question ("qcm" ou "input")
- **`correct_answer`** (string) : La réponse correcte
- **`category`** (string) : Catégorie de la question (ex: "javascript")
- **`level`** (string) : Niveau de difficulté ("Intermédiaire", "Avancé", "Expert")

### Champs optionnels

- **`code`** (string) : Code d'exemple à afficher avec la question
- **`options`** (array) : Options pour les questions QCM (obligatoire si type = "qcm")
- **`explanation`** (string) : Explication de la réponse
- **`exemple`** (string) : Exemple de code supplémentaire
- **`deleted`** (boolean) : Si la question est supprimée (défaut: false)

## Types de questions

### QCM (Question à Choix Multiple)

```json
{
  "question_type": "qcm",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer": "Option 1"
}
```

### Input (Saisie libre)

```json
{
  "question_type": "input",
  "correct_answer": "Réponse attendue"
}
```

## Niveaux de difficulté

- **Intermédiaire** : Questions de base
- **Avancé** : Questions nécessitant une bonne compréhension
- **Expert** : Questions complexes et spécialisées

## Intégration avec Supabase

Ce système est conçu pour fonctionner avec une base de données Supabase. Les champs JSON correspondent aux colonnes de la table `quiz_questions` :

- `question_id` → `question_id`
- `title` → `title`
- `code` → `code`
- `question_type` → `question_type`
- `options` → `options` (JSON array)
- `correct_answer` → `correct_answer`
- `explanation` → `explanation`
- `exemple` → `exemple`
- `category` → `category`
- `level` → `level`
- `deleted` → `deleted`

## Utilisation

1. Créez vos questions en suivant la structure du fichier d'exemple
2. Importez les données dans votre base Supabase
3. Le système chargera automatiquement les questions selon la catégorie sélectionnée

## Conseils pour créer de bonnes questions

- **Titre clair** : Formulez des questions précises et compréhensibles
- **Code d'exemple** : Utilisez des exemples de code pertinents
- **Explications détaillées** : Aidez l'utilisateur à comprendre pourquoi la réponse est correcte
- **Exemples pratiques** : Ajoutez des exemples concrets d'utilisation
- **Niveau approprié** : Choisissez le bon niveau de difficulté
- **Options réalistes** : Pour les QCM, proposez des options plausibles mais fausses
