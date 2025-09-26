// categories.js - Gestion de la page de sélection des catégories
let categories = [];
let filteredCategories = [];
let currentFilter = '';

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('🔧 Initialisation de la page des catégories');
        
        // Attendre que Supabase soit initialisé
        await waitForSupabase();
        
        // Charger les catégories
        await loadCategoriesFromSupabase();
        
        // Initialiser les filtres
        initializeFilters();
        
        // Afficher les catégories
        displayCategories();
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Erreur lors du chargement des catégories: ' + error.message);
    }
});

// Attendre que Supabase soit initialisé
async function waitForSupabase() {
    let attempts = 0;
    while (!window.supabase && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.supabase) {
        throw new Error('Supabase non initialisé');
    }
    
    console.log('✅ Supabase initialisé');
}

// Charger les catégories depuis Supabase
async function loadCategoriesFromSupabase() {
    try {
        console.log('🔧 Chargement des catégories...');
        
        if (!window.loadCategories) {
            throw new Error('Fonction loadCategories non disponible');
        }
        
        // Appeler la fonction globale loadCategories
        categories = await window.loadCategories();
        console.log('✅ Catégories chargées:', categories.length);
        
        if (categories.length === 0) {
            throw new Error('Aucune catégorie trouvée');
        }
        
        // Initialiser les catégories filtrées
        filteredCategories = [...categories];
        
        // Exposer les variables globalement
        window.categories = categories;
        window.filteredCategories = filteredCategories;
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des catégories:', error);
        throw error;
    }
}

// Afficher les catégories
async function displayCategories() {
    try {
        console.log('🔧 Affichage des catégories...');
        
        const loadingZone = document.getElementById('loadingZone');
        const errorZone = document.getElementById('errorZone');
        const categoriesGrid = document.getElementById('categoriesGrid');
        
        // Masquer le loading
        if (loadingZone) loadingZone.style.display = 'none';
        
        // Masquer les erreurs
        if (errorZone) errorZone.style.display = 'none';
        
        // Afficher la grille
        if (categoriesGrid) {
            categoriesGrid.style.display = 'grid';
            
            // Générer les cartes de catégories
            const categoriesHTML = await Promise.all(
                filteredCategories.map(async (category) => {
                    return await createCategoryCard(category);
                })
            );
            
            categoriesGrid.innerHTML = categoriesHTML.join('');
        }
        
        // Mettre à jour les statistiques de filtrage
        updateFilterStats();
        
        console.log('✅ Catégories affichées');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'affichage des catégories:', error);
        showError('Erreur lors de l\'affichage des catégories: ' + error.message);
    }
}

// Créer une carte de catégorie
async function createCategoryCard(category) {
    try {
        // Obtenir les statistiques de la catégorie
        let questionCount = 0;
        if (window.getCategoryStats) {
            questionCount = await window.getCategoryStats(category.name);
        }
        
        // Définir les couleurs par défaut
        const colors = {
            angular: { primary: '#dd0031', dark: '#c3002f' },
            css: { primary: '#1572b6', dark: '#0f5a8a' },
            html: { primary: '#e34f26', dark: '#d73a1a' },
            javascript: { primary: '#f7df1e', dark: '#e6c91a' },
            typescript: { primary: '#3178c6', dark: '#2563eb' },
            react: { primary: '#61dafb', dark: '#4fc3f7' },
            vue: { primary: '#4fc08d', dark: '#3ba374' },
            node: { primary: '#339933', dark: '#2d7a2d' },
            python: { primary: '#3776ab', dark: '#2c5aa0' },
            java: { primary: '#007396', dark: '#005f7a' },
            default: { primary: '#667eea', dark: '#5a6fd8' }
        };
        
        const categoryColors = colors[category.name] || colors.default;
        
        // Obtenir le terme de recherche pour la surbrillance
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        // Créer les fonctionnalités
        const features = [
            `${questionCount} questions`,
            `Niveau : ${category.level || 'Expert'}`,
            category.description ? 'Avec descriptions' : 'Quiz standard'
        ];
        
        // Surligner le terme de recherche dans le nom de la catégorie
        const displayName = category.display_name || category.name;
        const highlightedName = searchTerm && searchTerm.length >= 2 ? 
            highlightSearchTerm(displayName, searchTerm) : displayName;
        
        return `
            <div class="category-card" style="--category-color: ${category.color || categoryColors.primary}; --category-color-dark: ${categoryColors.dark};">
                <div class="category-icon">${category.icon || '🎯'}</div>
                <div class="category-title">${highlightedName}</div>
                <div class="category-description">${category.description || `Quiz ${category.display_name || category.name}`}</div>
                <div class="category-level">${category.level || 'Expert'}</div>
                <ul class="category-features">
                    ${features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="quiz.html?category=${category.name}" class="category-link">
                    Commencer le quiz
                </a>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Erreur lors de la création de la carte:', error);
        return `
            <div class="category-card">
                <div class="category-title">${category.name}</div>
                <div class="category-description">Erreur lors du chargement</div>
                <a href="quiz.html?category=${category.name}" class="category-link">
                    Essayer quand même
                </a>
            </div>
        `;
    }
}

// Fonction utilitaire pour surligner le terme de recherche
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return text;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Échapper les caractères spéciaux pour regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Afficher une erreur
function showError(message) {
    const errorZone = document.getElementById('errorZone');
    const errorMessage = document.getElementById('errorMessage');
    const loadingZone = document.getElementById('loadingZone');
    
    if (loadingZone) loadingZone.style.display = 'none';
    
    if (errorZone && errorMessage) {
        errorMessage.textContent = message;
        errorZone.style.display = 'block';
    }
    
    console.error('❌ Erreur affichée:', message);
}

// Initialiser les filtres
function initializeFilters() {
    const levelFilter = document.getElementById('levelFilter');
    const applyFilter = document.getElementById('applyFilter');
    
    if (levelFilter) {
        levelFilter.addEventListener('change', function() {
            currentFilter = this.value;
            console.log('🔧 Filtre de niveau changé:', currentFilter);
        });
    }
    
    if (applyFilter) {
        applyFilter.addEventListener('click', function() {
            applyLevelFilter();
        });
    }
    
    console.log('✅ Filtres initialisés');
}

// Appliquer le filtre par niveau
function applyLevelFilter() {
    try {
        console.log('🔧 Application du filtre par niveau:', currentFilter);
        
        if (!currentFilter || currentFilter === '') {
            // Afficher toutes les catégories
            filteredCategories = [...categories];
        } else {
            // Filtrer par niveau
            filteredCategories = categories.filter(category => {
                const categoryLevel = category.level || 'Expert';
                return categoryLevel === currentFilter;
            });
        }
        
        console.log('✅ Filtre appliqué:', filteredCategories.length, 'catégories trouvées');
        
        // Mettre à jour la variable globale
        window.filteredCategories = filteredCategories;
        
        // Vérifier s'il y a une recherche active
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        if (searchTerm && searchTerm.length >= 2) {
            // Appliquer aussi le filtre de recherche
            if (window.performSearch) {
                window.performSearch(searchTerm);
            }
        } else {
            // Réafficher les catégories normalement
            displayCategories();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'application du filtre:', error);
        showError('Erreur lors de l\'application du filtre: ' + error.message);
    }
}


// Mettre à jour les statistiques de filtrage
function updateFilterStats() {
    try {
        const filterStats = document.getElementById('filterStats');
        if (!filterStats) return;
        
        const totalCategories = categories.length;
        const filteredCount = filteredCategories.length;
        
        if (currentFilter && currentFilter !== '') {
            filterStats.textContent = `Affichage de ${filteredCount} catégorie(s) sur ${totalCategories} (filtre: ${currentFilter})`;
        } else {
            filterStats.textContent = `Affichage de ${totalCategories} catégorie(s)`;
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour des statistiques:', error);
    }
}

// Exposer les fonctions et variables globalement
window.loadCategoriesFromSupabase = loadCategoriesFromSupabase;
window.displayCategories = displayCategories;
window.createCategoryCard = createCategoryCard;
window.applyLevelFilter = applyLevelFilter;
window.categories = categories;
window.filteredCategories = filteredCategories;
