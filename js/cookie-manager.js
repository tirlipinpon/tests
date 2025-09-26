// ===== GESTIONNAIRE DE COOKIES POUR LES QUIZ =====

/**
 * Gestionnaire de cookies pour tracker les bonnes réponses des quiz
 * Utilise un seul cookie par page contenant un objet JSON
 */
class CookieManager {
    constructor(pageId) {
        this.pageId = pageId;
        this.cookieName = `quiz_${pageId}`;
        this.data = this.loadData();
    }

    /**
     * Charge les données depuis le cookie
     * @returns {Object} - Objet contenant les compteurs de bonnes réponses
     */
    loadData() {
        try {
            const cookieValue = this.getCookie(this.cookieName);
            if (cookieValue) {
                return JSON.parse(cookieValue);
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des données du cookie:', error);
        }
        return {};
    }

    /**
     * Sauvegarde les données dans le cookie
     */
    saveData() {
        try {
            const jsonData = JSON.stringify(this.data);
            this.setCookie(this.cookieName, jsonData, 365); // 1 an d'expiration
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données du cookie:', error);
        }
    }

    /**
     * Lit une valeur dans les cookies
     * @param {string} name - Nom du cookie
     * @returns {string|null} - Valeur du cookie ou null
     */
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    /**
     * Écrit une valeur dans les cookies
     * @param {string} name - Nom du cookie
     * @param {string} value - Valeur à écrire
     * @param {number} days - Nombre de jours avant expiration
     */
    setCookie(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    /**
     * Incrémente le compteur de bonnes réponses pour une question
     * @param {string} questionId - ID de la question
     * @returns {number} - Nouvelle valeur du compteur
     */
    incrementCorrectAnswers(questionId) {
        if (!this.data[questionId]) {
            this.data[questionId] = 0;
        }
        this.data[questionId]++;
        this.saveData();
        return this.data[questionId];
    }

    /**
     * Récupère le nombre de bonnes réponses pour une question
     * @param {string} questionId - ID de la question
     * @returns {number} - Nombre de bonnes réponses
     */
    getCorrectAnswers(questionId) {
        return this.data[questionId] || 0;
    }

    /**
     * Vérifie si une question doit être masquée (5+ bonnes réponses)
     * @param {string} questionId - ID de la question
     * @returns {boolean} - true si la question doit être masquée
     */
    shouldHideQuestion(questionId) {
        return this.getCorrectAnswers(questionId) >= 5;
    }

    /**
     * Récupère toutes les données de progression
     * @returns {Object} - Objet contenant tous les compteurs
     */
    getAllData() {
        return { ...this.data };
    }

    /**
     * Remet à zéro les données (utile pour les tests)
     */
    reset() {
        this.data = {};
        this.saveData();
    }

    /**
     * Supprime les données d'une question spécifique
     * @param {string} questionId - ID de la question
     */
    removeQuestion(questionId) {
        delete this.data[questionId];
        this.saveData();
    }
}

// Export pour utilisation en module (si supporté)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}
