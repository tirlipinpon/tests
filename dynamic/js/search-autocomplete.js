// search-autocomplete.js - Système de recherche autocomplete pour les catégories
let searchTimeout;
let currentSearchTerm = '';
let searchSuggestions = [];
let selectedSuggestionIndex = -1;
let isSearchActive = false;

// Initialiser le système de recherche
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

// Initialiser la recherche
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchInput || !clearButton || !suggestionsContainer) {
        console.warn('Éléments de recherche non trouvés');
        return;
    }
    
    // Événements de saisie
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleKeyDown);
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('blur', handleSearchBlur);
    
    // Bouton effacer
    clearButton.addEventListener('click', clearSearch);
    
    // Clic en dehors pour fermer les suggestions
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSuggestions();
        }
    });
    
    console.log('✅ Système de recherche initialisé');
}

// Gérer la saisie dans le champ de recherche
function handleSearchInput(e) {
    const searchTerm = e.target.value.trim();
    currentSearchTerm = searchTerm;
    
    // Afficher/masquer le bouton effacer
    const clearButton = document.getElementById('clearSearch');
    clearButton.style.display = searchTerm.length > 0 ? 'flex' : 'none';
    
    // Effacer le timeout précédent
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Si moins de 2 caractères, réinitialiser l'affichage
    if (searchTerm.length < 2) {
        hideSuggestions();
        // Réafficher toutes les catégories visibles (sans filtre de recherche)
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.classList.remove('hidden');
        });
        // Mettre à jour les statistiques
        const visibleCards = document.querySelectorAll('.category-card:not(.hidden)');
        updateSearchStats(visibleCards.length, visibleCards.length, '');
        console.log('🔄 Recherche réinitialisée, affichage de toutes les catégories');
        return;
    }
    
    // Debounce de 500ms
    searchTimeout = setTimeout(() => {
        performSearch(searchTerm);
    }, 500);
}

// Effectuer la recherche
function performSearch(searchTerm) {
    try {
        console.log('🔍 Recherche:', searchTerm);
        
        // Obtenir les catégories filtrées par niveau
        const levelFilter = document.getElementById('levelFilter');
        const selectedLevel = levelFilter ? levelFilter.value : '';
        
        // Utiliser les catégories filtrées par niveau depuis les variables globales
        let categoriesToSearch = [];
        
        if (selectedLevel && selectedLevel !== '') {
            // Si un niveau est sélectionné, utiliser les catégories filtrées (même si vides)
            categoriesToSearch = window.filteredCategories || [];
            console.log('🔍 Utilisation des catégories filtrées par niveau:', categoriesToSearch.length, 'pour le niveau:', selectedLevel);
        } else {
            // Si aucun niveau sélectionné, utiliser toutes les catégories
            categoriesToSearch = window.categories || [];
            console.log('🔍 Utilisation de toutes les catégories (pas de filtre):', categoriesToSearch.length);
        }
        
        if (categoriesToSearch.length === 0) {
            console.warn('Aucune catégorie trouvée pour la recherche');
            updateSuggestions([], searchTerm);
            return;
        }
        
        // Rechercher dans les noms des catégories (insensible à la casse)
        const searchResults = categoriesToSearch.filter(category => {
            const categoryName = (category.display_name || category.name || '').toLowerCase();
            return categoryName.includes(searchTerm.toLowerCase());
        });
        
        console.log('✅ Résultats trouvés:', searchResults.length);
        
        // Mettre à jour les suggestions
        updateSuggestions(searchResults, searchTerm);
        
        // Appliquer le filtre de recherche
        applySearchFilter(searchResults);
        
        // Mettre à jour les statistiques
        updateSearchStats(searchResults.length, categoriesToSearch.length, searchTerm);
        
    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
    }
}

// Mettre à jour les suggestions
function updateSuggestions(results, searchTerm) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    if (results.length === 0) {
        suggestionsContainer.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
    } else {
        const suggestionsHTML = results.map((category, index) => {
            const displayName = category.display_name || category.name;
            const highlightedName = highlightSearchTerm(displayName, searchTerm);
            
            return `
                <div class="suggestion-item" data-index="${index}" data-category="${category.name}">
                    <div class="suggestion-icon">${category.icon || '🎯'}</div>
                    <div class="suggestion-content">
                        <div class="suggestion-name">${highlightedName}</div>
                        <div class="suggestion-level">Niveau: ${window.getLevelLabel ? window.getLevelLabel(category.level) || 'Expert' : (category.level || 'Expert')}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        suggestionsContainer.innerHTML = suggestionsHTML;
        
        // Ajouter les événements de clic
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => selectSuggestion(index, results));
            item.addEventListener('mouseenter', () => highlightSuggestion(index));
        });
    }
    
    searchSuggestions = results;
    selectedSuggestionIndex = -1;
    showSuggestions();
}

// Surligner le terme recherché
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Échapper les caractères spéciaux pour regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Afficher les suggestions
function showSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('show');
        isSearchActive = true;
    }
}

// Masquer les suggestions
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('show');
        isSearchActive = false;
        selectedSuggestionIndex = -1;
    }
}

// Gérer les touches du clavier
function handleKeyDown(e) {
    if (!isSearchActive) return;
    
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
            updateSuggestionHighlight();
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSuggestionHighlight();
            break;
            
        case 'Enter':
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && searchSuggestions[selectedSuggestionIndex]) {
                selectSuggestion(selectedSuggestionIndex, searchSuggestions);
            }
            break;
            
        case 'Escape':
            e.preventDefault();
            hideSuggestions();
            break;
    }
}

// Mettre à jour la surbrillance des suggestions
function updateSuggestionHighlight() {
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach((item, index) => {
        item.classList.toggle('highlighted', index === selectedSuggestionIndex);
    });
}

// Sélectionner une suggestion
function selectSuggestion(index, results) {
    if (index >= 0 && index < results.length) {
        const category = results[index];
        const searchInput = document.getElementById('searchInput');
        
        // Mettre à jour le champ de recherche
        searchInput.value = category.display_name || category.name;
        currentSearchTerm = searchInput.value;
        
        // Masquer les suggestions
        hideSuggestions();
        
        // Appliquer le filtre avec cette catégorie spécifique
        applySearchFilter([category]);
        
        console.log('✅ Catégorie sélectionnée:', category.name);
    }
}

// Appliquer le filtre de recherche
function applySearchFilter(results) {
    // Marquer les catégories comme cachées/visibles
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (results.length === 0) {
        // Si aucun résultat, masquer toutes les catégories
        categoryCards.forEach(card => {
            card.classList.add('hidden');
        });
        console.log('🎯 Aucun résultat, toutes les catégories masquées');
    } else {
        // Si il y a des résultats, afficher seulement ceux qui correspondent
        categoryCards.forEach(card => {
            const categoryName = card.querySelector('.category-title')?.textContent?.trim();
            const cleanCardName = categoryName?.replace(/<[^>]*>/g, '') || '';
            
            const isVisible = results.some(cat => {
                const cleanCategoryName = (cat.display_name || cat.name || '').replace(/<[^>]*>/g, '');
                return cleanCategoryName.toLowerCase() === cleanCardName.toLowerCase();
            });
            
            if (isVisible) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        console.log('🎯 Filtre de recherche appliqué:', results.length, 'catégories visibles');
    }
}

// Mettre à jour les statistiques de recherche
function updateSearchStats(foundCount, totalCount, searchTerm) {
    const filterStats = document.getElementById('filterStats');
    if (!filterStats) return;
    
    let statsText = '';
    
    if (searchTerm && searchTerm.length >= 2) {
        if (foundCount === 0) {
            statsText = `Aucun résultat pour "${searchTerm}"`;
        } else {
            statsText = `Recherche "${searchTerm}": ${foundCount} catégorie(s) trouvée(s) sur ${totalCount}`;
        }
    } else {
        statsText = `Affichage de ${totalCount} catégorie(s)`;
    }
    
    filterStats.textContent = statsText;
}

// Gérer le focus sur le champ de recherche
function handleSearchFocus() {
    if (currentSearchTerm && currentSearchTerm.length >= 2) {
        showSuggestions();
    }
}

// Gérer la perte de focus
function handleSearchBlur() {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
        hideSuggestions();
    }, 200);
}

// Effacer la recherche
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
        currentSearchTerm = '';
    }
    
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    hideSuggestions();
    
    // Réappliquer le filtre par niveau seulement
    if (window.applyLevelFilter) {
        window.applyLevelFilter();
    }
    
    console.log('🧹 Recherche effacée');
}

// Fonction publique pour réinitialiser la recherche
function resetSearch() {
    clearSearch();
}

// Fonction pour reset complet de l'autocomplete (appelée lors du changement de niveau)
function resetSearchAutocomplete() {
    console.log('🔄 Reset complet de l\'autocomplete');
    
    // Vider le champ de recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        currentSearchTerm = '';
    }
    
    // Masquer le bouton effacer
    const clearButton = document.getElementById('clearSearch');
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    // Masquer les suggestions
    hideSuggestions();
    
    // Réinitialiser les variables
    searchSuggestions = [];
    selectedSuggestionIndex = -1;
    isSearchActive = false;
    
    // Réafficher les catégories selon le niveau sélectionné
    const levelFilter = document.getElementById('levelFilter');
    const selectedLevel = levelFilter ? levelFilter.value : '';
    
    if (selectedLevel) {
        // Si un niveau est sélectionné, afficher seulement les catégories de ce niveau
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const cardLevel = card.querySelector('.category-level')?.textContent?.trim();
            if (cardLevel === selectedLevel) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    } else {
        // Si aucun niveau sélectionné, afficher toutes les catégories
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.classList.remove('hidden');
        });
    }
    
    // Mettre à jour les statistiques
    const visibleCards = document.querySelectorAll('.category-card:not(.hidden)');
    updateSearchStats(visibleCards.length, visibleCards.length, '');
    
    console.log('✅ Autocomplete reseté');
}

// Exposer les fonctions globalement
window.resetSearch = resetSearch;
window.resetSearchAutocomplete = resetSearchAutocomplete;
window.performSearch = performSearch;
