// index-dynamic.js - Chargement dynamique des quiz sur la page d'accueil
let categories = [];

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Attendre que Supabase soit initialisé
        await waitForSupabase();
        
        // Charger les catégories
        await loadAllCategories();
        
        // Afficher les quiz
        await renderAllQuizzes();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Erreur lors du chargement des quiz: ' + error.message);
    }
});

// Attendre que Supabase soit initialisé
async function waitForSupabase() {
    let attempts = 0;
    const maxAttempts = 50; // 5 secondes max
    
    while (!window.supabase && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.supabase) {
        throw new Error('Supabase non initialisé après 5 secondes d\'attente');
    }
}

// Charger toutes les catégories
async function loadAllCategories() {
    try {
        categories = await window.loadCategories();
        console.log(`✅ ${categories.length} catégories chargées`);
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        throw error;
    }
}

// Afficher tous les quiz
async function renderAllQuizzes() {
    const grid = document.getElementById('quizGrid');
    const loading = document.getElementById('loadingQuizzes');
    
    if (categories.length === 0) {
        grid.innerHTML = '<p>Aucun quiz disponible.</p>';
        return;
    }
    
    // Masquer le loading
    if (loading) loading.style.display = 'none';
    
    // Créer les cartes de quiz
    const quizCards = await Promise.all(
        categories.map(async (category) => {
            const questionCount = await window.getCategoryStats(category.name);
            return createQuizCard(category, questionCount);
        })
    );
    
    // Afficher les cartes
    grid.innerHTML = quizCards.join('');
    
    console.log(`✅ ${quizCards.length} quiz affichés`);
}

// Créer une carte de quiz
async function createQuizCard(category, questionCount) {
    const features = generateFeatures(category, questionCount);
    
    return `
        <div class="quiz-card">
            <h2 class="quiz-title">${category.icon || '🎯'} ${category.display_name}</h2>
            <p class="quiz-description">${category.description || `Quiz ${category.display_name}`}</p>
            <ul class="quiz-features">
                ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="dynamic/pages/quiz.html?category=${category.name}" class="quiz-link">Commencer le quiz</a>
        </div>
    `;
}

// Générer les caractéristiques du quiz
function generateFeatures(category, questionCount) {
    const features = [];
    
    // Nombre de questions
    if (questionCount > 0) {
        features.push(`${questionCount} questions`);
    } else {
        features.push('Questions en cours de chargement...');
    }
    
    // Niveau
    features.push(`Niveau : ${category.level || 'Expert'}`);
    
    // Caractéristiques spécifiques selon la catégorie
    const specificFeatures = getCategorySpecificFeatures(category.name);
    features.push(...specificFeatures);
    
    return features;
}

// Obtenir les caractéristiques spécifiques à une catégorie
function getCategorySpecificFeatures(categoryName) {
    const featuresMap = {
        'angular': [
            'Composants et directives',
            'Services et injection de dépendance',
            'Routing et guards',
            'RxJS et programmation réactive',
            'Performance et optimisation'
        ],
        'css': [
            'Sélecteurs et spécificité',
            'Flexbox et Grid Layout',
            'Animations et transitions',
            'Responsive design',
            'Techniques avancées'
        ],
        'db': [
            'Architecture ANSI/SPARC',
            'Modèle relationnel',
            'SQL avancé',
            'Transactions ACID',
            'SGBD relationnels et NoSQL'
        ],
        'html': [
            'Balises auto-fermantes',
            'Éléments sémantiques HTML5',
            'Différences HTML5 vs XHTML',
            'Attributs et validation',
            'Bonnes pratiques d\'accessibilité'
        ],
        'promise': [
            'Promises simples et chaînage',
            'Async/await et gestion d\'erreurs',
            'Exécution séquentielle vs parallèle',
            'Promise.all, Promise.race',
            'Interactions avec setTimeout'
        ],
        'rxjs': [
            'Concepts de programmation réactive',
            'Observables et observateurs',
            'Opérateurs de transformation',
            'Gestion des erreurs',
            'Patterns avancés'
        ],
        'scope': [
            'Scope global, fonction et bloc',
            'Différences entre var, let et const',
            'Hoisting des variables et fonctions',
            'Shadowing et scope imbriqué',
            'Closures et IIFE'
        ],
        'side': [
            'Fonctions pures et effets de bord',
            'Destructuring avancé',
            'Immutabilité et mutation',
            'Patterns fonctionnels',
            'Performance et optimisation'
        ],
        'this': [
            'Comportement de \'this\' dans différents contextes',
            'Fonctions normales vs fléchées',
            'setTimeout et perte de contexte',
            'Closures et variables privées',
            'Techniques de binding'
        ],
        'typescript': [
            'Types conditionnels et mappés',
            'Patterns architecturaux',
            'Optimisation V8 et gestion mémoire',
            'Monorepos et partage de types',
            'Type Guards et Unions discriminées'
        ],
        'wcag': [
            'Attributs ARIA essentiels',
            'Guidelines WCAG 2.1',
            'Navigation au clavier',
            'Lecteurs d\'écran',
            'Bonnes pratiques d\'accessibilité'
        ]
    };
    
    return featuresMap[categoryName] || [
        'Questions progressives',
        'Explications détaillées',
        'Interface intuitive',
        'Feedback immédiat'
    ];
}

// Afficher une erreur
function showError(message) {
    const grid = document.getElementById('quizGrid');
    const loading = document.getElementById('loadingQuizzes');
    
    if (loading) loading.style.display = 'none';
    
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: #ff4757; color: white; border-radius: 10px;">
            <h3>❌ Erreur</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="background: white; color: #ff4757; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; margin-top: 1rem;">
                Recharger la page
            </button>
        </div>
    `;
}

// Exposer les fonctions globalement
window.loadAllCategories = loadAllCategories;
window.renderAllQuizzes = renderAllQuizzes;
