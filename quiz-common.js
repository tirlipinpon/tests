// ===== FONCTIONS COMMUNES POUR LES QUIZ =====

/**
 * Mélange un tableau en utilisant l'algorithme Fisher-Yates
 * @param {Array} array - Le tableau à mélanger
 * @returns {Array} - Nouveau tableau mélangé
 */
function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Normalise une réponse d'input pour la comparaison
 * @param {string} input - La réponse de l'utilisateur
 * @returns {string} - Réponse normalisée
 */
function normalizeInputAnswer(input) {
    // Vérifier que input est une chaîne de caractères
    if (typeof input !== 'string') {
        return '';
    }
    
    return input.trim()
        .replace(/\s+/g, ' ')
        .replace(/"/g, "'")
        .toLowerCase();
}

/**
 * Normalise une réponse pour les quiz avec plusieurs valeurs
 * @param {string} input - La réponse de l'utilisateur
 * @returns {Array} - Tableau des réponses normalisées
 */
function normalizeMultiAnswer(input) {
    // Vérifier que input est une chaîne de caractères
    if (typeof input !== 'string') {
        return [];
    }
    
    return input.trim()
        .toLowerCase()
        .replace(/\s*,\s*/g, " ")
        .replace(/\s+/g, " ")
        .split(" ");
}

/**
 * Classe principale pour gérer les quiz
 */
class QuizManager {
    constructor(containerId, quizData, options = {}) {
        this.container = document.getElementById(containerId);
        this.quizData = quizData;
        this.options = {
            shuffleQuestions: true,
            shuffleOptions: true,
            showExplanations: true,
            ...options
        };
        
        if (!this.container) {
            console.error(`Conteneur avec l'ID '${containerId}' non trouvé`);
            return;
        }
        
        this.init();
    }

    init() {
        this.renderQuestions();
    }

    renderQuestions() {
        // Vider le conteneur
        this.container.innerHTML = '';
        
        // Mélanger les questions si demandé
        const questions = this.options.shuffleQuestions ? shuffle(this.quizData) : this.quizData;
        
        questions.forEach((question, index) => {
            const section = this.createQuestionSection(question, index);
            this.container.appendChild(section);
            this.attachEventListeners(question, index);
        });
    }

    createQuestionSection(question, index) {
        const section = document.createElement('section');
        
        if (question.type === 'qcm') {
            section.innerHTML = this.createQCMHTML(question, index);
        } else if (question.type === 'input') {
            section.innerHTML = this.createInputHTML(question, index);
        } else {
            // Type par défaut (compatible avec les anciens quiz)
            section.innerHTML = this.createDefaultHTML(question, index);
        }
        
        return section;
    }

    createQCMHTML(question, index) {
        const options = this.options.shuffleOptions ? shuffle(question.options) : question.options;
        const optionsHTML = options.map(opt => `
            <label>
                <input type="radio" name="q${index}" value="${opt}"> ${opt}
            </label>
        `).join('');
        
        return `
            <h2>${question.titre}</h2>
            <pre>${question.code || ''}</pre>
            ${optionsHTML}
            <button id="btn${index}" disabled>Valider</button>
            <span id="result${index}" aria-live="polite"></span>
        `;
    }

    createInputHTML(question, index) {
        return `
            <h2>${question.titre}</h2>
            <pre>${question.code || ''}</pre>
            <input type="text" id="input${index}" aria-label="Réponse">
            <button id="btn${index}" disabled>Valider</button>
            <span id="result${index}" aria-live="polite"></span>
        `;
    }

    createDefaultHTML(question, index) {
        // Pour les quiz qui n'ont pas de type défini (compatibilité)
        if (question.options) {
            return this.createQCMHTML(question, index);
        } else {
            return this.createInputHTML(question, index);
        }
    }

    attachEventListeners(question, index) {
        const button = document.getElementById(`btn${index}`);
        if (!button) return;

        button.addEventListener('click', () => {
            this.validateAnswer(question, index);
        });

        // Ajouter les événements pour activer/désactiver le bouton
        if (question.type === 'qcm') {
            this.attachQCMListeners(question, index);
        } else if (question.type === 'input') {
            this.attachInputListeners(question, index);
        } else {
            // Type par défaut
            if (question.options) {
                this.attachQCMListeners(question, index);
            } else {
                this.attachInputListeners(question, index);
            }
        }
    }

    attachQCMListeners(question, index) {
        const button = document.getElementById(`btn${index}`);
        const radioButtons = document.querySelectorAll(`input[name="q${index}"]`);
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                button.disabled = false;
            });
        });
    }

    attachInputListeners(question, index) {
        const button = document.getElementById(`btn${index}`);
        const input = document.getElementById(`input${index}`);
        
        if (input) {
            input.addEventListener('input', () => {
                button.disabled = input.value.trim() === '';
            });
        }
    }

    validateAnswer(question, index) {
        const resultEl = document.getElementById(`result${index}`);
        const button = document.getElementById(`btn${index}`);
        if (!resultEl || !button) return;

        resultEl.className = '';

        if (question.type === 'qcm') {
            this.validateQCMAnswer(question, index, resultEl);
        } else if (question.type === 'input') {
            this.validateInputAnswer(question, index, resultEl);
        } else {
            // Type par défaut
            if (question.options) {
                this.validateQCMAnswer(question, index, resultEl);
            } else {
                this.validateInputAnswer(question, index, resultEl);
            }
        }

        // Désactiver le bouton après validation
        button.disabled = true;
    }

    validateQCMAnswer(question, index, resultEl) {
        const checked = document.querySelector(`input[name="q${index}"]:checked`);
        
        if (!checked) {
            resultEl.textContent = "⚠️ Sélectionne une réponse.";
            resultEl.className = "wrong";
            return;
        }

        const isCorrect = checked.value === question.reponse;
        
        if (isCorrect) {
            resultEl.innerHTML = `✅ Correct !${this.options.showExplanations ? `<br><small class="meta">Explication : ${question.explication}</small>` : ''}`;
            resultEl.className = "correct";
        } else {
            resultEl.innerHTML = `❌ Faux<br><small>Ta réponse : ${checked.value}</small><br><small>Réponse correcte : ${question.reponse}</small>${this.options.showExplanations ? `<br><small class="meta">Explication : ${question.explication}</small>` : ''}`;
            resultEl.className = "wrong";
        }
    }

    validateInputAnswer(question, index, resultEl) {
        const input = document.getElementById(`input${index}`);
        if (!input) return;

        const userAnswer = input.value || '';
        const normalizedUser = normalizeInputAnswer(userAnswer);
        const normalizedCorrect = normalizeInputAnswer(question.reponse || '');
        
        const isCorrect = normalizedUser === normalizedCorrect;
        
        if (isCorrect) {
            resultEl.innerHTML = `✅ Correct !${this.options.showExplanations ? `<br><small class="meta">Explication : ${question.explication}</small>` : ''}`;
            resultEl.className = "correct";
        } else {
            resultEl.innerHTML = `❌ Faux<br><small>Ta réponse : ${userAnswer || '(vide)'}</small><br><small>Réponse correcte : ${question.reponse}</small>${this.options.showExplanations ? `<br><small class="meta">Explication : ${question.explication}</small>` : ''}`;
            resultEl.className = "wrong";
        }
    }

    // Méthode pour les quiz avec réponses multiples (comme les quiz JavaScript)
    validateMultiAnswer(question, index, resultEl) {
        const input = document.getElementById(`input${index}`);
        if (!input) return;

        const userAnswers = normalizeMultiAnswer(input.value || '');
        const correctAnswers = (question.reponse || []).map(s => s.toLowerCase());
        
        const isCorrect = correctAnswers.length === userAnswers.length && 
                         userAnswers.every(r => correctAnswers.includes(r));
        
        if (isCorrect) {
            resultEl.innerHTML = `✅ Correct !${this.options.showExplanations ? `<br><small class="meta">Explication : ${question.explication}</small>` : ''}`;
            resultEl.className = "correct";
        } else {
            resultEl.innerHTML = `❌ Faux<br><small>Ta réponse : ${input.value || '(vide)'}</small><br><small>Réponse correcte : ${(question.reponse || []).join(", ")}</small>${this.options.showExplanations ? `<br><small class="meta">Explication : ${question.explication}</small>` : ''}`;
            resultEl.className = "wrong";
        }
    }
}

/**
 * Fonction utilitaire pour créer rapidement un quiz
 * @param {string} containerId - ID du conteneur
 * @param {Array} quizData - Données du quiz
 * @param {Object} options - Options du quiz
 */
function createQuiz(containerId, quizData, options = {}) {
    return new QuizManager(containerId, quizData, options);
}

// Export pour utilisation en module (si supporté)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizManager, createQuiz, shuffle, normalizeInputAnswer, normalizeMultiAnswer };
}