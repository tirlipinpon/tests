// ===== NAVIGATION DYNAMIQUE =====

// Configuration des pages disponibles
const NAVIGATION_ITEMS = [
    { href: 'index.html', text: '🏠 Accueil', id: 'home' },
    { href: 'html.html', text: '🌐 HTML5 & XHTML', id: 'html' },
    { href: 'css.html', text: '🎨 CSS3', id: 'css' },
    { href: 'promise.html', text: '⚡ Promises', id: 'promise' },
    { href: 'scope.html', text: '🔍 Scope & Hoisting', id: 'scope' },
    { href: 'this.html', text: '🎯 This & Closures', id: 'this' },
    { href: 'side.html', text: '🔄 Side Effects', id: 'side' },
    { href: 'wcag.html', text: '♿ Accessibilité', id: 'wcag' },
    { href: 'rxjs.html', text: '🔄 RxJS', id: 'rxjs' }
];

/**
 * Crée le menu de navigation dynamique
 * @param {string} currentPageId - ID de la page actuelle
 * @param {string} containerId - ID du conteneur où insérer le menu (optionnel)
 */
function createNavigation(currentPageId, containerId = 'navigation') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Conteneur avec l'ID '${containerId}' non trouvé`);
        return;
    }

    // Créer la structure HTML du menu
    const navHTML = `
        <nav class="nav-menu">
            <h3>📚 Navigation</h3>
            <div class="nav-links">
                ${NAVIGATION_ITEMS.map(item => {
                    const isCurrent = item.id === currentPageId;
                    return `<a href="${item.href}" ${isCurrent ? 'class="current"' : ''}>${item.text}</a>`;
                }).join('')}
            </div>
        </nav>
    `;

    container.innerHTML = navHTML;
}

/**
 * Initialise la navigation automatiquement en détectant la page actuelle
 * @param {string} containerId - ID du conteneur où insérer le menu
 */
function initNavigation(containerId = 'navigation') {
    // Détecter la page actuelle basée sur le nom du fichier
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Mapper les noms de fichiers vers les IDs
    const pageMapping = {
        'index.html': 'home',
        'html.html': 'html',
        'css.html': 'css',
        'promise.html': 'promise',
        'scope.html': 'scope',
        'this.html': 'this',
        'side.html': 'side',
        'wcag.html': 'wcag',
        'rxjs.html': 'rxjs'
    };

    const currentPageId = pageMapping[currentPage] || 'home';
    createNavigation(currentPageId, containerId);
}

// Auto-initialisation si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initNavigation());
} else {
    initNavigation();
}
