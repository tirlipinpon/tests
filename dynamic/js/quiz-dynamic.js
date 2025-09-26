// quiz-dynamic.js - Gestion du quiz dynamique
let currentCategory = null;
let categoryInfo = null;

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Récupérer la catégorie depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        currentCategory = urlParams.get('category');
        
        if (!currentCategory) {
            showError('Aucune catégorie spécifiée dans l\'URL');
            return;
        }
        
        // Charger les informations de la catégorie
        await loadCategoryInfo();
        
        // Initialiser le quiz
        await initializeDynamicQuiz();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Erreur lors du chargement du quiz: ' + error.message);
    }
});

// Charger les informations de la catégorie
async function loadCategoryInfo() {
    try {
        if (!supabase) {
            throw new Error('Supabase non initialisé');
        }
        
        const { data, error } = await supabase
            .from('quiz_categories')
            .select('*')
            .eq('name', currentCategory)
            .eq('is_active', true)
            .single();
        
        if (error) {
            throw new Error('Catégorie non trouvée: ' + error.message);
        }
        
        categoryInfo = data;
        updateCategoryHeader();
        
    } catch (error) {
        console.error('Erreur lors du chargement de la catégorie:', error);
        // Utiliser des informations par défaut
        categoryInfo = {
            name: currentCategory,
            display_name: currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1),
            description: `Quiz ${currentCategory}`,
            level: 'Expert',
            color: '#667eea',
            icon: '🎯'
        };
        updateCategoryHeader();
    }
}

// Mettre à jour l'en-tête de la catégorie
function updateCategoryHeader() {
    if (!categoryInfo) return;
    
    // Mettre à jour le titre de la page
    document.title = `Quiz - ${categoryInfo.display_name}`;
    
    // Mettre à jour l'icône
    const iconEl = document.getElementById('categoryIcon');
    if (iconEl) iconEl.textContent = categoryInfo.icon || '🎯';
    
    // Mettre à jour le titre
    const titleEl = document.getElementById('categoryTitle');
    if (titleEl) titleEl.textContent = categoryInfo.display_name;
    
    // Mettre à jour la description
    const descEl = document.getElementById('categoryDescription');
    if (descEl) descEl.textContent = categoryInfo.description;
    
    // Mettre à jour le niveau
    const levelEl = document.getElementById('categoryLevel');
    if (levelEl) levelEl.textContent = categoryInfo.level || 'Expert';
    
    // Mettre à jour les couleurs
    const headerEl = document.getElementById('categoryHeader');
    if (headerEl && categoryInfo.color) {
        headerEl.style.setProperty('--category-color', categoryInfo.color);
        headerEl.style.setProperty('--category-color-dark', darkenColor(categoryInfo.color, 20));
    }
}

// Initialiser le quiz dynamique
async function initializeDynamicQuiz() {
    try {
        // Masquer la zone de chargement
        const loadingZone = document.getElementById('loadingZone');
        if (loadingZone) loadingZone.style.display = 'none';
        
        // Charger les questions depuis Supabase
        const quizData = await loadQuizDataFromSupabase(currentCategory);
        
        if (!quizData || quizData.length === 0) {
            showError('Aucune question trouvée pour cette catégorie');
            return;
        }
        
        // Afficher le container du quiz
        const quizContainer = document.getElementById('quizContainer');
        if (quizContainer) quizContainer.style.display = 'block';
        
        // Initialiser le quiz avec QuizManager
        if (window.QuizManager) {
            window.quizManager = new window.QuizManager('quizContainer', quizData, {
                pageId: currentCategory,
                shuffleQuestions: true,
                shuffleOptions: true,
                showExplanations: true
            });
            
            console.log(`✅ Quiz ${currentCategory} initialisé avec ${quizData.length} questions`);
            
            // Initialiser les statistiques
            if (window.initializeQuizStats) {
                window.initializeQuizStats(currentCategory, quizData);
                const statsEl = document.getElementById('quizStats');
                if (statsEl) statsEl.style.display = 'block';
            }
            
        } else {
            throw new Error('QuizManager non disponible');
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du quiz:', error);
        showError('Erreur lors de l\'initialisation du quiz: ' + error.message);
    }
}

// Afficher une erreur
function showError(message) {
    const errorZone = document.getElementById('errorZone');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorZone) errorZone.style.display = 'block';
    if (errorMessage) errorMessage.textContent = message;
    
    // Masquer les autres zones
    const loadingZone = document.getElementById('loadingZone');
    const quizContainer = document.getElementById('quizContainer');
    
    if (loadingZone) loadingZone.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'none';
}

// Fonction utilitaire pour assombrir une couleur
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Exposer les fonctions globalement
window.loadCategoryInfo = loadCategoryInfo;
window.initializeDynamicQuiz = initializeDynamicQuiz;
