// angular-fallback-data.js - Données de fallback pour angular.html
function getFallbackQuizData() {
  console.log('⚠️ Utilisation des données de fallback pour angular');
  return [
  {
    id: "angular-1",
    titre: "1️⃣ Rôle de l'App Initializer",
    code: "Dans quel cas doit-on utiliser l'App Initializer, et à quel moment du cycle de vie de l'application s'exécute-t-il ?",
    options: [
      "Pour récupérer des configurations avant le démarrage de l'application.",
      "Pour gérer le routing après le chargement.",
      "Pour exécuter la détection de changement OnPush."
    ],
    reponse: "Pour récupérer des configurations avant le démarrage de l'application.",
    type: "qcm",
    explication: "L'App Initializer est utilisé lorsque vous devez récupérer des **configurations** ou effectuer des **setups** avant que l'application ne commence à s'exécuter. Il est exécuté avant le chargement de l'App Module ou de l'App Component [1]."
  },
  {
    id: "angular-2",
    titre: "2️⃣ Restriction d'accès (Flag)",
    code: "Quel flag doit-on ajouter à la configuration du routing pour restreindre l'accès à une route si l'utilisateur n'est pas authentifié ?",
    options: [],
    reponse: "canActivate",
    type: "input",
    explication: "Le flag **`canActivate`** est utilisé dans le routing pour mapper un service Router Guard qui vérifie si l'utilisateur est connecté et retourne `true` ou `false`, restreignant ainsi l'accès [2], [3]."
  },
  {
    id: "angular-3",
    titre: "3️⃣ Guard pour l'Autorisation",
    code: "Quel type de Guard est spécifiquement utilisé pour l'implémentation de la gestion des rôles (Autorisation) ?",
    options: [
      "CanDeactivate Guard",
      "Resolver Guard",
      "Role-based Guard",
      "CanLoad Guard"
    ],
    reponse: "Role-based Guard",
    type: "qcm",
    explication: "L'autorisation (Role Management) implique de restreindre les pages ou les contrôles en fonction du rôle spécifique de l'utilisateur. Pour la gestion au niveau des routes, on utilise un **Role-based Guard** [4], [3]."
  },
  {
    id: "angular-4",
    titre: "4️⃣ Rôle de package-lock.json",
    code: "Quel est le principal objectif du fichier `package-lock.json` ?",
    options: [
      "Définir les dépendances de production uniquement",
      "Stocker les versions compatibles exactes des dépendances",
      "Déclarer les scripts npm"
    ],
    reponse: "Stocker les versions compatibles exactes des dépendances",
    type: "qcm",
    explication: "Le `package-lock.json` stocke les **versions compatibles** exactes des librairies et maintient la structure exacte de l'arbre de dépendances pour assurer un environnement de travail stable [4], [5]."
  },
  {
    id: "angular-5",
    titre: "5️⃣ Suppression de package-lock.json",
    code: "Si le fichier `package-lock.json` est supprimé, quelle est la conséquence lors de la prochaine exécution de `npm install` ?",
    options: [
      "L'installation échoue avec une erreur de dépendance",
      "Il crée un nouveau fichier package-lock basé sur les versions installées",
      "Il utilise uniquement les versions spécifiées dans package.json"
    ],
    reponse: "Il crée un nouveau fichier package-lock basé sur les versions installées",
    type: "qcm",
    explication: "Si ce fichier est manquant, `npm install` s'exécutera et **créera un nouveau fichier** `package-lock.json` basé sur les versions qu'il installe au moment présent [5]."
  },
  {
    id: "angular-6",
    titre: "6️⃣ Input obligatoire",
    code: "Quelle propriété a été introduite dans Angular 17 pour rendre un `@Input` obligatoire ?",
    options: [],
    reponse: "required",
    type: "input",
    explication: "Angular 17 a introduit le paramètre **`required`** sur l'input. Si ce paramètre n'est pas fourni lors de l'utilisation du composant, cela déclenche une erreur [6], [7]."
  },
  {
    id: "angular-7",
    titre: "7️⃣ Installation forcée (npm)",
    code: "Quel flag est utilisé avec `npm install` pour résoudre les problèmes de compatibilité et forcer l'installation des versions compatibles ?",
    options: [],
    reponse: "--force",
    type: "input",
    explication: "Le flag **`--force`** (ou `hyphen Force`) est utilisé pour forcer l'installation des versions compatibles d'une librairie, évitant ainsi les erreurs de dépendance [6]."
  },
  {
    id: "angular-8",
    titre: "8️⃣ Outil pour le flux de données asynchrones",
    code: "Pour la communication de résultats de recherche (Header -> Homepage), BehaviorSubject est préféré à Subject. Quelle est la principale raison ?",
    options: [
      "Il est plus performant avec les requêtes HTTP",
      "Il permet l'initialisation des valeurs pour les vérifications de longueur",
      "Il annule automatiquement les requêtes précédentes"
    ],
    reponse: "Il permet l'initialisation des valeurs pour les vérifications de longueur",
    type: "qcm",
    explication: "Le **BehaviorSubject** est préféré car il peut être initialisé avec une valeur. Cette initialisation permet d'éviter les erreurs liées à l'indéfini (*undefined*) et d'effectuer des vérifications initiales (comme la vérification de la longueur du tableau) [8]."
  },
  {
    id: "angular-9",
    titre: "9️⃣ Cause des fuites de mémoire",
    code: "Quelle action sur les Observables provoque des fuites de mémoire (Memory Leaks) en Angular ?",
    options: [
      "L'utilisation excessive du pipe `async`",
      "L'oubli de se désabonner des souscriptions",
      "L'appel de fonctions asynchrones sans `zone.js`"
    ],
    reponse: "L'oubli de se désabonner des souscriptions",
    type: "qcm",
    explication: "Les fuites de mémoire surviennent lorsque les **souscriptions aux Observables** (subscriptions) restent actives dans la mémoire après la destruction du composant. Il est crucial d'utiliser `ngOnDestroy` (ou `DestroyRef`) pour s'en désabonner [9], [10], [11]."
  },
  {
    id: "angular-10",
    titre: "🔟 Optimisation de la Détection de Changements",
    code: "Quelle stratégie de détection de changements réduit les cycles de vérification aux changements des `@Input` ?",
    options: [],
    reponse: "OnPush",
    type: "input",
    explication: "L'implémentation de la stratégie **`OnPush`** (ChangeDetectionStrategy.OnPush) permet de minimiser les cycles de détection de changements en limitant la vérification aux seules entrées modifiées, optimisant ainsi la performance [12], [13], [11]."
  },
  {
    id: "angular-11",
    titre: "1️⃣1️⃣ Utilisations des Interceptors",
    code: "Outre l'envoi de jetons d'authentification, à quelles fins les Interceptors HTTP sont-ils utilisés ? (Choisir toutes les options valides)",
    options: [
      "Gestion centralisée des erreurs API",
      "Simulation de données (Mocking)",
      "Ajout d'en-têtes personnalisés",
      "Gestion du Lazy Loading"
    ],
    reponse: [
      "Gestion centralisée des erreurs API",
      "Simulation de données (Mocking)",
      "Ajout d'en-têtes personnalisés"
    ],
    type: "qcm-multiple",
    explication: "Les Interceptors sont essentiels pour le traitement global des requêtes et réponses, incluant l'envoi de `Custom Headers`, la **gestion centralisée des erreurs** et la **simulation de données** (mocking) en lisant des fichiers *asset* [14]."
  },
  {
    id: "angular-12",
    titre: "1️⃣2️⃣ Problème résolu par les Signals",
    code: "Quel problème lié à la détection de changements les Signals visent-ils à résoudre ou simplifier ?",
    options: [
      "La gestion des fuites de mémoire",
      "La difficulté à refléter les changements d'objets sans appeler `detectChanges()`",
      "L'optimisation des requêtes HTTP"
    ],
    reponse: "La difficulté à refléter les changements d'objets sans appeler `detectChanges()`",
    type: "qcm",
    explication: "Les Signals ont été introduits pour simplifier la gestion de l'état réactif et réduire la nécessité d'appeler manuellement `changeDetection.detectChanges()` lorsque les objets ou les collections sont mis à jour, ce qui était une source d'erreurs [12]."
  },
  {
    id: "angular-13",
    titre: "1️⃣3️⃣ `trackBy` dans `*ngFor`",
    code: "Quel est le rôle de la fonction `trackBy` dans la directive `*ngFor` ?",
    options: [
      "Améliorer la sécurité des boucles",
      "Éviter le rechargement complet du DOM en suivant l'identité des éléments",
      "Permettre le Lazy Loading des éléments de la liste"
    ],
    reponse: "Éviter le rechargement complet du DOM en suivant l'identité des éléments",
    type: "qcm",
    explication: "`trackBy` optimise le rendu des listes en permettant à Angular de suivre l'identité des éléments (souvent via un ID unique), garantissant que seuls les éléments réellement modifiés sont re-rendus dans le DOM [15], [10]."
  },
  {
    id: "angular-14",
    titre: "1️⃣4️⃣ Rôle de @ViewChild",
    code: "Quel est l'objectif du décorateur `@ViewChild` ?",
    options: [
      "Passer des données du parent à l'enfant",
      "Détecter les changements d'un élément du DOM",
      "Accéder aux méthodes ou propriétés d'un composant enfant ou d'un élément du template"
    ],
    reponse: "Accéder aux méthodes ou propriétés d'un composant enfant ou d'un élément du template",
    type: "qcm",
    explication: "`@ViewChild` est une méthode de communication Parent-Enfant qui permet au composant parent d'obtenir une référence à un composant enfant ou à un élément du template pour interagir avec lui (appeler une fonction, accéder à une variable) [9]."
  },
  {
    id: "angular-15",
    titre: "1️⃣5️⃣ Avantage du Lazy Loading",
    code: "En termes de performance, quel est l'avantage principal du Lazy Loading ?",
    options: [
      "Réduction de la taille du bundle initial et amélioration du temps de chargement",
      "Amélioration de la sécurité des routes",
      "Meilleure gestion des événements asynchrones"
    ],
    reponse: "Réduction de la taille du bundle initial et amélioration du temps de chargement",
    type: "qcm",
    explication: "Le Lazy Loading est une stratégie d'optimisation qui charge les modules ou les composants uniquement lorsqu'ils sont nécessaires, ce qui réduit le temps de chargement initial et la taille du bundle [3], [13]."
  },
  {
    id: "angular-16",
    titre: "1️⃣6️⃣ Observable vs Promise",
    code: "Quelle est la différence fondamentale entre un Observable et une Promise concernant la livraison de valeurs ?",
    options: [
      "Les Promises gèrent les erreurs, pas les Observables",
      "Les Observables émettent plusieurs valeurs sur le temps, les Promises une seule",
      "Les Promises sont synchrones, les Observables asynchrones"
    ],
    reponse: "Les Observables émettent plusieurs valeurs sur le temps, les Promises une seule",
    type: "qcm",
    explication: "Les Observables sont des flux de données qui peuvent émettre **plusieurs valeurs** dans le temps, représentant un *stream* d'événements, tandis que les Promises ne livrent ou ne rejettent qu'une **seule valeur** [16], [13], [17]."
  },
  {
    id: "angular-17",
    titre: "1️⃣7️⃣ Optimisation de la recherche RxJS",
    code: "Quels opérateurs RxJS sont recommandés pour optimiser les appels API fréquents dans un champ de recherche (annuler les anciennes requêtes et éviter les appels trop rapides) ?",
    options: [
      "map",
      "switchMap",
      "tap",
      "debounceTime"
    ],
    reponse: [
      "switchMap",
      "debounceTime"
    ],
    type: "qcm-multiple",
    explication: "**`debounceTime`** retarde le flux pour éviter les requêtes excessives, et **`switchMap`** annule les requêtes HTTP précédentes, garantissant que seule la réponse la plus récente est traitée [10]."
  },
  {
    id: "angular-18",
    titre: "1️⃣8️⃣ Combinaison d'Observables",
    code: "Quels opérateurs RxJS sont utilisés pour exécuter plusieurs appels API indépendants et obtenir un résultat combiné ?",
    options: [
      "tap",
      "join",
      "combineLatest",
      "mergeMap"
    ],
    reponse: [
      "join",
      "combineLatest",
      "mergeMap"
    ],
    type: "qcm-multiple",
    explication: "Les opérateurs **`join`**, **`combineLatest`** et **`mergeMap`** sont utilisés pour gérer et fusionner les réponses de multiples Observables asynchrones [10]."
  },
  {
    id: "angular-19",
    titre: "1️⃣9️⃣ Usage de `::ng-deep`",
    code: "Dans quels scénarios peut-on utiliser le sélecteur `::ng-deep` ?",
    options: [
      "Styliser des composants de librairies tierces",
      "Modifier les styles globaux de l'application",
      "Styliser des éléments résultant d'une projection de contenu"
    ],
    reponse: [
      "Styliser des composants de librairies tierces",
      "Styliser des éléments résultant d'une projection de contenu"
    ],
    type: "qcm-multiple",
    explication: "Le sélecteur `::ng-deep` permet de pénétrer l'encapsulation de vue d'un composant. Il est principalement utilisé pour modifier le style des composants de **librairies tierces** (third party library) ou du **contenu projeté** (`content projection`) [18]."
  },
  {
    id: "angular-20",
    titre: "2️⃣0️⃣ Refactoring d'un composant volumineux",
    code: "Quelle est la stratégie principale pour refactorer un composant Angular jugé trop volumineux (\"bloated\") ?",
    options: [
      "Supprimer tous les `@Input` et `@Output`",
      "Diviser le composant en parties réutilisables et extraire la logique métier vers un Service",
      "Convertir tous les Observables en Promises"
    ],
    reponse: "Diviser le composant en parties réutilisables et extraire la logique métier vers un Service",
    type: "qcm",
    explication: "La stratégie principale est de **diviser le composant** en composants enfants réutilisables et d'**extraire la logique métier vers un Service**. Cela améliore la testabilité et maintient la séparation des préoccupations (UI vs. Logique métier) [19]."
  },
  {
    id: "angular-21",
    titre: "2️⃣1️⃣ Débogage de l'état UI",
    code: "Quelle méthode simple permet de vérifier l'état d'une variable ou d'un Signal dans le template et de confirmer que la Détection de Changements s'exécute ?",
    options: [
      "Utiliser un `console.log` dans le constructeur",
      "Afficher l'état dans le template avec le pipe JSON",
      "Utiliser l'outil Angular DevTools uniquement"
    ],
    reponse: "Afficher l'état dans le template avec le pipe JSON",
    type: "qcm",
    explication: "Afficher l'état d'une variable ou d'un Signal dans le template avec le **pipe JSON** (`| json`) est une technique simple pour voir si la valeur est mise à jour, confirmant ainsi l'exécution de la Détection de Changements [20]."
  },
  {
    id: "angular-22",
    titre: "2️⃣2️⃣ Rôle de TypeScript",
    code: "Quelle est la principale contribution de TypeScript au développement Angular ?",
    options: [
      "Fournir le typage statique",
      "Permettre la compilation AOT",
      "Gérer le DOM de manière réactive"
    ],
    reponse: "Fournir le typage statique",
    type: "qcm",
    explication: "TypeScript apporte le **typage statique** (static typing) ainsi que des fonctionnalités de programmation orientée objet comme les classes et les interfaces, améliorant la robustesse du code [21]."
  },
  {
    id: "angular-23",
    titre: "2️⃣3️⃣ Types de Directives",
    code: "Quels sont les deux principaux types de Directives en Angular ?",
    options: [
      "Directives de Module",
      "Directives Structurelles",
      "Directives d'Attribut",
      "Directives de Formulaire"
    ],
    reponse: [
      "Directives Structurelles",
      "Directives d'Attribut"
    ],
    type: "qcm-multiple",
    explication: "Les directives modifient le comportement des éléments. Elles sont classées en deux grandes familles : **Structurelles** (comme `*ngIf`, `*ngFor`) et **d'Attribut** (comme `[ngStyle]`, `[ngClass]`) [22]."
  },
  {
    id: "angular-24",
    titre: "2️⃣4️⃣ Injection de dépendance",
    code: "Comment Angular identifie-t-il l'instance correcte à injecter lors de l'injection de dépendance ?",
    options: [
      "Grâce au nom de la classe",
      "Grâce au type fourni dans le constructeur",
      "Grâce au fichier module.ts"
    ],
    reponse: "Grâce au type fourni dans le constructeur",
    type: "qcm",
    explication: "Angular utilise le **type fourni dans le constructeur** (par exemple : `constructor(service: ServiceName)`) pour identifier et injecter l'instance correcte [23]."
  },
  {
    id: "angular-25",
    titre: "2️⃣5️⃣ Cycle de vie `ngOnInit`",
    code: "À quel moment du cycle de vie Angular le hook `ngOnInit` est-il appelé ?",
    options: [
      "Avant la création du composant",
      "Après la construction du composant et l'initialisation de ses `@Input`",
      "Juste avant la destruction du composant"
    ],
    reponse: "Après la construction du composant et l'initialisation de ses `@Input`",
    type: "qcm",
    explication: "Le hook `ngOnInit` est déclenché **après l'initialisation des propriétés `@Input`** et est généralement utilisé pour initialiser les données du composant [24]."
  },
  {
    id: "angular-26",
    titre: "2️⃣6️⃣ Gestion des formulaires",
    code: "Quels sont les deux types principaux de gestion des formulaires en Angular ?",
    options: [
      "Formulaires dynamiques",
      "Formulaires réactifs",
      "Formulaires basés sur les templates",
      "Formulaires observables"
    ],
    reponse: [
      "Formulaires réactifs",
      "Formulaires basés sur les templates"
    ],
    type: "qcm-multiple",
    explication: "Angular fournit deux approches : les **formulaires basés sur les templates** (utilisant des directives comme `ngModel`) et les **formulaires réactifs** (utilisant `FormControl` et `FormGroup` pour plus de contrôle) [25]."
  },
  {
    id: "angular-27",
    titre: "2️⃣7️⃣ Avantage des Modules",
    code: "Quel est l'avantage principal de l'utilisation des Modules (`NgModule`) en Angular ?",
    options: [
      "Améliorer la vitesse des Observables",
      "Organiser et regrouper les composants, directives et services",
      "Gérer l'encapsulation CSS"
    ],
    reponse: "Organiser et regrouper les composants, directives et services",
    type: "qcm",
    explication: "Les **Modules** permettent d'organiser et regrouper logiquement des composants, directives, pipes et services, rendant l'application plus modulaire et maintenable [26]."
  },
  {
    id: "angular-28",
    titre: "2️⃣8️⃣ Compilation AOT",
    code: "Quel est l'objectif principal de la compilation AOT (Ahead-Of-Time) en Angular ?",
    options: [
      "Améliorer la performance en compilant le code HTML et TypeScript avant l'exécution",
      "Faciliter le Lazy Loading",
      "Éviter les erreurs de CSS"
    ],
    reponse: "Améliorer la performance en compilant le code HTML et TypeScript avant l'exécution",
    type: "qcm",
    explication: "La compilation **AOT** compile le HTML et TypeScript en JavaScript lors du build, ce qui réduit le temps de rendu et détecte les erreurs au moment de la compilation [27]."
  },
  {
    id: "angular-29",
    titre: "2️⃣9️⃣ Directive vs Composant",
    code: "Quelle est la principale différence entre une Directive et un Composant en Angular ?",
    options: [
      "Les composants possèdent un template, les directives non",
      "Les directives gèrent uniquement le DOM, les composants non",
      "Les composants ne peuvent pas utiliser d'inputs"
    ],
    reponse: "Les composants possèdent un template, les directives non",
    type: "qcm",
    explication: "La principale différence est que les **composants possèdent un template** associé, tandis que les **directives** modifient ou étendent le comportement d'éléments existants sans template [28]."
  },
  {
    id: "angular-30",
    titre: "3️⃣0️⃣ Lazy Loading et Guards",
    code: "Quel Guard est utilisé pour empêcher un module chargé en Lazy Loading d'être téléchargé si la condition n'est pas remplie ?",
    options: [],
    reponse: "canLoad",
    type: "input",
    explication: "Le Guard **`canLoad`** empêche le téléchargement d'un module en Lazy Loading si la condition définie dans le Guard n'est pas remplie [29]."
  },
  {
    id: "angular-31",
    titre: "3️⃣1️⃣ Configuration initiale de l'application",
    code: "Avant le démarrage de l'App Module, quel concept utilise-t-on pour récupérer des configurations initiales ou effectuer des setups ?",
    options: [],
    reponse: "AppInitializer",
    type: "input",
    explication: "L'**App Initializer** permet d'exécuter un service ou une logique spécifique (comme la récupération de configurations) avant que l'application ne commence à s'exécuter ou que l'App Module ne se charge."
  },
  {
    id: "angular-32",
    titre: "3️⃣2️⃣ Flag de forçage d'installation",
    code: "Quel flag est utilisé avec la commande `npm install` pour résoudre les problèmes de compatibilité de dépendance en forçant l'installation des versions compatibles ?",
    options: [],
    reponse: "--force",
    type: "input",
    explication: "Le flag `--force` est utilisé pour ignorer les problèmes de compatibilité (dependency issues) et installer de force les versions compatibles d'une librairie."
  },
  {
    id: "angular-33",
    titre: "3️⃣3️⃣ Fichier de Détection de Changements par défaut",
    code: "Quel fichier JavaScript est intégré par défaut dans Angular pour gérer le mécanisme automatique de la Détection de Changements ?",
    options: [],
    reponse: "zone.js",
    type: "input",
    explication: "Le mécanisme de Détection de Changements par défaut s'appuie sur le fichier intégré **`zone.js`** pour savoir quand un changement est survenu dans le TS et le refléter dans le template."
  },
  {
    id: "angular-34",
    titre: "3️⃣4️⃣ Opérateur RxJS pour l'annulation de requêtes",
    code: "Pour optimiser la recherche API, quel opérateur RxJS est utilisé pour annuler une requête sortante précédente et ne traiter que la réponse la plus récente ?",
    options: [],
    reponse: "switchMap",
    type: "input",
    explication: "L'opérateur **`switchMap`** est essentiel pour les scénarios de recherche car il gère les requêtes concurrentes en annulant l'Observable intérieur précédent lorsque l'Observable source émet une nouvelle valeur."
  },
  {
    id: "angular-35",
    titre: "3️⃣5️⃣ Pause de fonction JavaScript",
    code: "Dans une fonction génératrice (generator function) en JavaScript, quel mot-clé est utilisé pour mettre en pause l'exécution et retourner une valeur ?",
    options: [],
    reponse: "yield",
    type: "input",
    explication: "Le mot-clé `yield` est utilisé dans les fonctions génératrices pour suspendre l'exécution de la fonction et retourner une valeur. L'exécution peut être reprise ultérieurement."
  },
  {
    id: "angular-36",
    titre: "3️⃣6️⃣ Débogage de l'état dans le Template",
    code: "Quel pipe Angular est souvent utilisé pour déboguer l'état d'un objet complexe ou d'un Signal en affichant sa structure directement dans le template ?",
    options: [],
    reponse: "json",
    type: "input",
    explication: "Le pipe **`json`** (`| json`) est utilisé dans l'interpolation de chaîne pour sérialiser un objet en chaîne JSON, permettant de visualiser son état et de vérifier si la Détection de Changements s'est bien exécutée."
  },
  {
    id: "angular-37",
    titre: "3️⃣7️⃣ Sélecteur de style encapsulé",
    code: "Quel sélecteur est historiquement utilisé (et toujours fonctionnel) pour ignorer l'encapsulation de vue et styliser des composants de librairies tierces ?",
    options: [],
    reponse: "::ng-deep",
    type: "input",
    explication: "Le sélecteur **`::ng-deep`** permet aux styles de pénétrer l'encapsulation de vue d'un composant. Il est couramment utilisé pour styliser le contenu projeté ou les composants de librairies tierces."
  },
  {
    id: "angular-38",
    titre: "3️⃣8️⃣ Libération de la mémoire de Closure",
    code: "Afin de libérer la mémoire retenue par une closure, quelle valeur doit-on assigner à la référence retenue pour qu'elle soit enlevée par le garbage collector ?",
    options: [],
    reponse: "null",
    type: "input",
    explication: "Dans le cas d'une closure, pour libérer la mémoire qu'elle retient (car elle maintient une référence), il suffit de mettre la référence à `null` (ou `undefined`) pour que le garbage collector puisse la nettoyer."
  },
  {
    id: "angular-39",
    titre: "3️⃣9️⃣ Outil de manipulation du DOM dans une Directive",
    code: "Quel objet doit être injecté dans le constructeur d'une directive d'attribut pour obtenir une référence à l'élément hôte (Host element) ?",
    options: [],
    reponse: "ElementRef",
    type: "input",
    explication: "**`ElementRef`** est utilisé pour obtenir une référence native à l'élément DOM sur lequel la directive est appliquée, permettant sa manipulation (souvent en conjonction avec `Renderer2`)."
  },
  {
    id: "angular-40",
    titre: "4️⃣0️⃣ Réutilisation de Code (SASS)",
    code: "Quel concept SASS est largement recommandé dans les grands projets pour assurer une réutilisation facile des styles, au-delà des mixins et des fonctions ?",
    options: [
      "CSS Variables",
      "SCSS Components",
      "Inline Styles"
    ],
    reponse: "CSS Variables",
    type: "qcm",
    explication: "L'utilisation des **CSS Variables** est cruciale dans les grands projets pour centraliser et réutiliser les styles de manière dynamique et générer facilement des thèmes personnalisés."
  },
  {
    id: "angular-41",
    titre: "4️⃣1️⃣ Stratégie de Refactoring",
    code: "Un composant devient trop volumineux ('bloated'). Quelle est la double stratégie recommandée pour le refactorer ?",
    options: [
      "Extraire la logique métier vers un Service et diviser le composant en parties réutilisables.",
      "Convertir le composant en Module et utiliser des `HostListener`.",
      "Utiliser `OnPush` et injecter `ChangeDetectorRef`."
    ],
    reponse: "Extraire la logique métier vers un Service et diviser le composant en parties réutilisables.",
    type: "qcm",
    explication: "Lorsqu'un composant est trop volumineux, il faut le **diviser** en composants enfants réutilisables, et surtout **extraire la logique métier** (business logic) dans un Service pour améliorer la testabilité et la séparation des préoccupations."
  },
  {
    id: "angular-42",
    titre: "4️⃣2️⃣ Mémoire et Fuites d'Observable",
    code: "Si une souscription (Subscription) n'est pas annulée (`unsubscribe`), où l'objet de la souscription résidera-t-il dans l'environnement d'exécution de l'application ?",
    options: [
      "Dans le DOM",
      "Dans le `localStorage`",
      "Dans la mémoire de l'application (Application memory)"
    ],
    reponse: "Dans la mémoire de l'application (Application memory)",
    type: "qcm",
    explication: "L'objet de la souscription restera actif et résidera dans la **mémoire de l'application** après la destruction du composant, augmentant la consommation de mémoire et provoquant des fuites."
  },
  {
    id: "angular-43",
    titre: "4️⃣3️⃣ Utilisation de trackBy",
    code: "Quelle est la principale fonction de `trackBy` dans `*ngFor` ?",
    options: [
      "Détecter les erreurs de clé de tableau",
      "Suivre l'identité des éléments pour éviter le rechargement redondant du DOM",
      "Forcer la détection de changements sur chaque élément"
    ],
    reponse: "Suivre l'identité des éléments pour éviter le rechargement redondant du DOM",
    type: "qcm",
    explication: "`trackBy` est utilisé pour améliorer les performances des listes `*ngFor` en permettant à Angular d'identifier les éléments qui ont changé, ajoutés ou supprimés, re-rendant uniquement les parties nécessaires."
  },
  {
    id: "angular-44",
    titre: "4️⃣4️⃣ Dépendances Senior Recommandées",
    code: "Parmi les options suivantes, quelles sont les dépendances externes que les développeurs expérimentés considèrent comme des 'must' absolus pour la qualité du code dans de grands projets ?",
    options: [
      "Husky ou lint-staged",
      "Prettier",
      "Karma",
      "Angular Material ou Tailwind"
    ],
    reponse: [
      "Husky ou lint-staged",
      "Prettier",
      "Angular Material ou Tailwind"
    ],
    type: "qcm-multiple",
    explication: "Prettier est mentionné comme un 'must' pour le formatage du code. Husky/lint-staged sont nécessaires pour exécuter Prettier sur les commits, et Tailwind/Material sont des choix courants pour les bibliothèques UI."
  },
  {
    id: "angular-45",
    titre: "4️⃣5️⃣ Conception de page e-commerce",
    code: "Lors de la décomposition d'une page e-commerce complète, quels types de composants représentent généralement l'en-tête, le pied de page et le menu de navigation ?",
    options: [
      "Feature Components",
      "Layout Components",
      "Core Components"
    ],
    reponse: "Layout Components",
    type: "qcm",
    explication: "L'en-tête, le pied de page et le menu sont souvent considérés comme des **Layout Components** (composants de mise en page) car ils définissent la structure globale, par opposition aux 'Feature Components' qui contiennent la logique métier principale (comme le conteneur d'images dans un e-commerce)."
  },
  {
    id: "angular-46",
    titre: "4️⃣6️⃣ Outil de création de Tooltip Dynamique",
    code: "En utilisant une Directive personnalisée, quels outils Angular peuvent être utilisés pour créer dynamiquement des éléments DOM (comme un tooltip) et ajouter des classes ?",
    options: [
      "NgZone et ChangeDetectorRef",
      "ElementRef et Renderer2",
      "HostListener et ViewChild"
    ],
    reponse: "ElementRef et Renderer2",
    type: "qcm",
    explication: "Pour créer des éléments dynamiques et modifier des styles dans une directive, on utilise **`ElementRef`** (pour la référence) et **`Renderer2`** (pour la manipulation du DOM de manière abstraite et sécurisée)."
  },
  {
    id: "angular-47",
    titre: "4️⃣7️⃣ Débogage de Dépendances",
    code: "Pour déboguer des problèmes liés à la manière dont les services sont fournis ou injectés, quel outil et quelle fonctionnalité sont recommandés ?",
    options: [
      "Console du navigateur avec `console.log(this.service)`",
      "Angular Dev Tools pour analyser la hiérarchie de l'injecteur",
      "Utiliser `debugger` dans le constructeur"
    ],
    reponse: "Angular Dev Tools pour analyser la hiérarchie de l'injecteur",
    type: "qcm",
    explication: "Pour résoudre des problèmes liés à l'injection de dépendances, il est recommandé d'utiliser les **Angular Dev Tools** pour examiner et analyser la **hiérarchie de l'injecteur**."
  },
  {
    id: "angular-48",
    titre: "4️⃣8️⃣ Gestion des Formulaires Dynamiques",
    code: "Lors de la création de formulaires complexes et hautement dynamiques (où le nombre de champs varie), quelle classe est utilisée pour gérer l'ajout et la suppression de contrôles de formulaire à la volée ?",
    options: [
      "FormGroup",
      "FormArray",
      "FormControl"
    ],
    reponse: "FormArray",
    type: "qcm",
    explication: "Pour les formulaires où les développeurs peuvent ajouter des lignes ou des colonnes de champs ('extra rows', 'extra columns'), la classe **`FormArray`** est utilisée pour gérer un ensemble dynamique de `FormGroup` ou `FormControl`."
  },
  {
    id: "angular-49",
    titre: "4️⃣9️⃣ Gestion des API de Back-end (Type Safety)",
    code: "Pour assurer la cohérence des types entre le front-end Angular et le back-end, quelles stratégies sont recommandées ?",
    options: [
      "Utiliser le fichier `package-lock.json`",
      "Utiliser un outil comme Swagger pour générer des types TypeScript",
      "Utiliser un monorepo avec une interface TypeScript partagée",
      "Implémenter une stratégie de contrat (Contract Testing)"
    ],
    reponse: [
      "Utiliser un outil comme Swagger pour générer des types TypeScript",
      "Utiliser un monorepo avec une interface TypeScript partagée",
      "Implémenter une stratégie de contrat (Contract Testing)"
    ],
    type: "qcm-multiple",
    explication: "Plusieurs stratégies assurent la sécurité des types : utiliser Swagger pour la génération automatique de types, implémenter un **Contract Testing** (tests automatisés contre une interface REST), ou utiliser un **monorepo** pour partager directement les interfaces TypeScript entre le NestJS back-end et l'Angular front-end."
  },
  {
    id: "angular-50",
    titre: "5️⃣0️⃣ Stratégie de Caching Hors Ligne",
    code: "Un utilisateur rapporte des échecs d'appels API en mode hors ligne. Quelle solution de caching est recommandée pour gérer ces scénarios d'application hors ligne ?",
    options: [
      "Stocker les données dans `sessionStorage`",
      "Utiliser `Indexed DB` ou `Local Storage`",
      "Implémenter un Service Worker"
    ],
    reponse: [
      "Utiliser `Indexed DB` ou `Local Storage`",
      "Implémenter un Service Worker"
    ],
    type: "qcm-multiple",
    explication: "Pour gérer les scénarios hors ligne, il faut implémenter un mécanisme de mise en cache (caching mechanism) en utilisant **Indexed DB** ou **Local Storage**, souvent en coordination avec un **Service Worker**."
  }
];
}