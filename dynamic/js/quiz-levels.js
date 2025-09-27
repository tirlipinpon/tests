/**
 * Configuration centralisée des niveaux de quiz
 * Ce fichier définit les niveaux disponibles dans tout le système
 */

// Niveaux de quiz disponibles
const QUIZ_LEVELS = [
    {
        value: 'Intermédiaire',
        label: 'Intermédiaire',
        order: 1
    },
    {
        value: 'Avancé', 
        label: 'Avancé',
        order: 2
    },
    {
        value: 'Expert',
        label: 'Expert', 
        order: 3
    }
];

// Fonction pour obtenir tous les niveaux
function getAllLevels() {
    return QUIZ_LEVELS;
}

// Fonction pour obtenir les options HTML pour un select
function getLevelOptions(includeAll = false, selectedValue = '') {
    let options = '';
    
    if (includeAll) {
        options += '<option value="">Tous les niveaux</option>';
    }
    
    QUIZ_LEVELS.forEach(level => {
        const selected = level.value === selectedValue ? ' selected' : '';
        options += `<option value="${level.value}"${selected}>${level.label}</option>`;
    });
    
    return options;
}

// Fonction pour obtenir les options HTML pour un select avec placeholder
function getLevelOptionsWithPlaceholder(placeholder = '-- Choisir un niveau --', selectedValue = '') {
    let options = `<option value="">${placeholder}</option>`;
    
    QUIZ_LEVELS.forEach(level => {
        const selected = level.value === selectedValue ? ' selected' : '';
        options += `<option value="${level.value}"${selected}>${level.label}</option>`;
    });
    
    return options;
}

// Fonction pour vérifier si un niveau existe
function isValidLevel(level) {
    return QUIZ_LEVELS.some(l => l.value === level);
}

// Fonction pour obtenir le label d'un niveau
function getLevelLabel(levelValue) {
    const level = QUIZ_LEVELS.find(l => l.value === levelValue);
    return level ? level.label : levelValue;
}

// Exposer les fonctions globalement
window.QUIZ_LEVELS = QUIZ_LEVELS;
window.getAllLevels = getAllLevels;
window.getLevelOptions = getLevelOptions;
window.getLevelOptionsWithPlaceholder = getLevelOptionsWithPlaceholder;
window.isValidLevel = isValidLevel;
window.getLevelLabel = getLevelLabel;

console.log('✅ Configuration des niveaux de quiz chargée');
