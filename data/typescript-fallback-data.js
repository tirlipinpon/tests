// typescript-fallback-data.js - Données de fallback pour typescript.html
function getFallbackQuizData() {
  console.log('⚠️ Utilisation des données de fallback pour typescript');
  return [
  {
    id: "typescript-1",
    titre: "1️⃣ Rôle des Types Conditionnels",
    code: "Quel est le rôle principal des Types Conditionnels en TypeScript ?",
    options: [
      "Ils permettent de définir des types récursifs uniquement.",
      "Ils permettent de créer des transformations de types basées sur une logique conditionnelle (si/alors/sinon).",
      "Ils servent uniquement à garantir l'immutabilité des propriétés d'un objet."
    ],
    reponse: "Ils permettent de créer des transformations de types basées sur une logique conditionnelle (si/alors/sinon).",
    type: "qcm",
    explication: "Les Types Conditionnels (Conditional Types) permettent aux développeurs de créer des transformations de types basées sur une logique conditionnelle [1, 2]. Ils définissent des types qui dépendent de la structure d'autres types, offrant ainsi flexibilité et adaptabilité [1]. La syntaxe utilisée est similaire à celle des expressions ternaires (`T extends U ? X : Y`) [1, 3]."
  },
  {
    id: "typescript-2",
    titre: "2️⃣ Mot-clé d'inférence de Type",
    code: "Quel mot-clé est utilisé dans un Type Conditionnel pour extraire un type (par exemple, le type du premier argument d'une fonction) dans la branche 'true' de la condition ?",
    options: [],
    reponse: "infer",
    type: "input",
    explication: "Le mot-clé `infer` est utilisé au sein des Types Conditionnels pour inférer le type d'une variable ou d'un composant de type, comme dans l'exemple `FirstArgument<T>` qui extrait le type du premier argument d'une fonction fournie `T` [4]."
  },
  {
    id: "typescript-3",
    titre: "3️⃣ Itération des propriétés avec Types Mappés",
    code: "Dans la syntaxe d'un Type Mappé en TypeScript : \n`type MappedType<T> = { [K in keyof T]: /* transformation logic */; };`\n Quel est le rôle de `[K in keyof T]` ?",
    options: [
      "Déclarer que le nouveau type est récursif.",
      "Transformer les types de propriétés pour qu'ils deviennent des types littéraux de modèle.",
      "Itérer sur chaque propriété de l'original type `T`, où `K` représente les clés (propriétés) du type original."
    ],
    reponse: "Itérer sur chaque propriété de l'original type `T`, où `K` représente les clés (propriétés) du type original.",
    type: "qcm",
    explication: "Les Types Mappés (Mapped Types) fournissent un moyen concis de transformer les propriétés des types existants [3, 5]. La syntaxe `[K in keyof T]` itère sur chaque propriété du type original `T`, où `keyof T` représente l'union de tous les noms de propriétés de `T` [6, 7]."
  },
  {
    id: "typescript-4",
    titre: "4️⃣ Compilation V8 JIT",
    code: "Quel composant du moteur V8 est spécifiquement responsable de l'optimisation des chemins de code fréquemment exécutés (code 'hot') en compilant le bytecode en code machine hautement optimisé ?",
    options: [
      "Ignition",
      "Turbofan",
      "Abstract Syntax Tree (AST)"
    ],
    reponse: "Turbofan",
    type: "qcm",
    explication: "Le moteur V8 utilise l'interpréteur **Ignition** pour générer du bytecode à partir de l'AST. Cependant, les chemins de code fréquemment exécutés sont identifiés et optimisés par le compilateur JIT **Turbofan**, qui compile le bytecode en code machine hautement optimisé [8]."
  },
  {
    id: "typescript-5",
    titre: "5️⃣ Patron d'Événement Asynchrone",
    code: "Quel patron d'architecture permet aux composants de s'abonner et de recevoir des mises à jour de 'publishers', améliorant ainsi la modularité et réduisant les dépendances entre eux ?",
    options: [
      "Le Patron Modèle-Vue-Contrôleur (MVC)",
      "Le Patron Client-Serveur",
      "Le Patron Publisher-Subscriber (Éditeur-Abonné)"
    ],
    reponse: "Le Patron Publisher-Subscriber (Éditeur-Abonné)",
    type: "qcm",
    explication: "Le Patron Publisher-Subscriber permet aux composants de souscrire aux mises à jour et de les recevoir des éditeurs (publishers), ce qui améliore la modularité et réduit les dépendances en découplant les composants [9]."
  },
  {
    id: "typescript-6",
    titre: "6️⃣ Logique Métier MVC",
    code: "Dans le patron Modèle-Vue-Contrôleur (MVC), quel composant est responsable de l'encapsulation de la logique métier (business logic) et de la gestion des entrées utilisateur ?",
    options: [],
    reponse: "Controller",
    type: "input",
    explication: "Le patron MVC sépare l'application en trois composants interconnectés : le Modèle (données), la Vue (interface utilisateur) et le **Contrôleur** (logique métier). Cette séparation améliore la maintenabilité et la testabilité [10]."
  },
  {
    id: "typescript-7",
    titre: "7️⃣ Rendre les propriétés Optionnelles",
    code: "Quel type utilitaire intégré de TypeScript permet de rendre toutes les propriétés d'un type existant optionnelles ?",
    options: [
      "Required<T>",
      "Readonly<T>",
      "Partial<T>"
    ],
    reponse: "Partial<T>",
    type: "qcm",
    explication: "Le type utilitaire `Partial<T>` est un type mappé qui rend toutes les propriétés du type `T` optionnelles. Inversement, `Required<T>` rend toutes les propriétés requises, et `Readonly<T>` les rend immuables [11, 12]."
  },
  {
    id: "typescript-8",
    titre: "8️⃣ Cause de Fuite de Mémoire (DOM)",
    code: "Parmi les causes de fuite de mémoire en JavaScript, laquelle est directement liée au fait d'oublier de retirer des références à des éléments DOM devenus inutiles ?",
    options: [
      "L'utilisation excessive de `let`.",
      "Les Références Circulaires.",
      "Les Écouteurs d'Événements (Event Listeners) non fermés."
    ],
    reponse: "Les Écouteurs d'Événements (Event Listeners) non fermés.",
    type: "qcm",
    explication: "Oublier de supprimer les écouteurs d'événements peut entraîner des fuites de mémoire, car ces écouteurs conservent des références aux éléments DOM, empêchant la collecte des objets inutilisés par le ramasse-miettes [13]. Il est recommandé d'utiliser `removeEventListener` lorsque l'écouteur n'est plus nécessaire [14]."
  },
  {
    id: "typescript-9",
    titre: "9️⃣ Rôle du Patron Pipe-Filter",
    code: "Décrivez le rôle du patron Pipe-Filter dans une application.",
    options: [
      "Il gère la réplication des données pour la tolérance aux pannes.",
      "Il sépare les opérations de lecture et d'écriture des données (Query et Command).",
      "Il assemble un pipeline de filtres pour traiter et transformer des données par étapes consécutives."
    ],
    reponse: "Il assemble un pipeline de filtres pour traiter et transformer des données par étapes consécutives.",
    type: "qcm",
    explication: "Le patron Pipe-Filter (ou Pipeline) est conçu pour traiter et transformer des données en les faisant passer par une série de composants de filtre, chacun effectuant une tâche spécifique sur les données [15]."
  },
  {
    id: "typescript-10",
    titre: "10️⃣ Composant fondamental du DDD",
    code: "Dans le Domain-Driven Design (DDD), quel terme désigne les objets qui possèdent une signification importante dans le domaine d'intérêt et servent de principaux blocs de construction pour les modèles d'entreprise ?",
    options: [],
    reponse: "Entités",
    type: "input",
    explication: "Les **entités** (entities) sont les principaux blocs de construction pour les modèles d'entreprise en DDD. Ce sont des objets qui ont une signification importante dans le domaine d'intérêt [16]."
  },
  {
    id: "typescript-11",
    titre: "11️⃣ Objectif des Type Guards",
    code: "Quel est l'objectif des Type Guards (ou gardes de type) en TypeScript ?",
    options: [
      "Permettre l'utilisation de types récursifs dans les interfaces.",
      "Restreindre (narrow down) le type d'une variable au sein d'un bloc de code, améliorant ainsi la sécurité des types.",
      "Créer une nouvelle instance d'une classe de manière sécurisée."
    ],
    reponse: "Restreindre (narrow down) le type d'une variable au sein d'un bloc de code, améliorant ainsi la sécurité des types.",
    type: "qcm",
    explication: "Les Type Guards facilitent la protection des types pour restreindre les types basés sur des vérifications au moment de l'exécution, améliorant la sécurité des types dans des blocs de code spécifiques (par exemple, dans un bloc `if` ou `switch`) [17-19]."
  },
  {
    id: "typescript-12",
    titre: "12️⃣ Technique de Garbage Collection",
    code: "Comment s'appelle l'approche de collecte de mémoire la plus courante en JavaScript, qui commence par un ensemble d'objets racine et parcourt le graphe d'objets pour identifier ceux qui sont atteignables, avant de libérer l'espace des objets non marqués ?",
    options: [],
    reponse: "Mark and Sweep",
    type: "input",
    explication: "Le moteur JavaScript utilise plusieurs techniques de collecte des déchets, la plus populaire étant l'approche **Mark and Sweep** (Marquage et Balayage) [20]. Le processus de Marquage identifie tous les objets atteignables à partir des racines, tandis que le Balayage libère la mémoire utilisée par les objets non marqués [20]."
  },
  {
    id: "typescript-13",
    titre: "13️⃣ Proxy vs Decorator",
    code: "Quelle est la différence fondamentale de responsabilité entre le Proxy Pattern et le Decorator Pattern, en ce qui concerne l'interface de l'objet enveloppé ?",
    options: [
      "Le Proxy est conçu pour retourner la même interface, tandis que le Decorator améliore l'interface.",
      "Le Decorator est utilisé pour l'accès aux données, tandis que le Proxy sert uniquement à la validation.",
      "Le Proxy ne peut pas ajouter de logique personnalisée, alors que le Decorator le peut."
    ],
    reponse: "Le Proxy est conçu pour retourner la même interface, tandis que le Decorator améliore l'interface.",
    type: "qcm",
    explication: "Le patron Proxy est généralement destiné à renvoyer la *même interface*, de sorte que le client suppose qu'il travaille avec le même objet intact. Le Decorator, en revanche, a pour responsabilité principale d'améliorer l'objet qu'il enveloppe, et peut retourner une interface améliorée dont le client peut être conscient [21, 22]."
  },
  {
    id: "typescript-14",
    titre: "14️⃣ Opération de Lecture CQRS",
    code: "Dans le patron Command Query Responsibility Segregation (CQRS), quelle partie de la ségrégation est associée à l'opération de lecture des données ?",
    options: [],
    reponse: "Query",
    type: "input",
    explication: "Le patron CQRS sépare les opérations de lecture (`Query`) et d'écriture (`Command`), optimisant ainsi le système pour la performance et l'évolutivité. `Query` est l'opération de lecture [23]."
  },
  {
    id: "typescript-15",
    titre: "15️⃣ Outil de Monorepo Populaire",
    code: "Quel outil de gestion de monorepo est décrit comme une alternative à Nx, souvent utilisé avec PNPM, et dont les exemples sont fournis par Vercel ?",
    options: [
      "Lerna",
      "Turborepo",
      "Yarn"
    ],
    reponse: "Turborepo",
    type: "qcm",
    explication: "Turborepo, développé par Vercel, est un outil de gestion de monorepo mentionné comme une alternative à Nx. Il est souvent utilisé pour faciliter le partage de code et de types TypeScript entre les projets front-end et back-end [24, 25]."
  },
  {
    id: "typescript-16",
    titre: "16️⃣ Immuabilité des propriétés",
    code: "Quel mot-clé de modification de propriété doit être utilisé dans un Type Mappé (`Mapped Type`) pour créer une version immuable d'un type en rendant toutes ses propriétés non modifiables ?",
    options: [],
    reponse: "readonly",
    type: "input",
    explication: "Pour rendre toutes les propriétés d'un type immuables, on utilise le modificateur `readonly` dans le Type Mappé, comme dans l'exemple `Immutable<T> = { readonly [K in keyof T]: T[K]; }`."
  }
  ];
}