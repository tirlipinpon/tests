// smart-char-counter.js - Compteur intelligent de caractères pour les questions input
class SmartCharCounter {
    constructor(question, inputElement, counterElement) {
        this.question = question;
        this.input = inputElement;
        this.counter = counterElement;
        this.correctAnswer = this.normalizeAnswer(question.correct_answer);
        this.remainingLetters = this.correctAnswer.length;
        this.userInput = '';
        this.correctPositions = new Set();
        
        this.init();
    }
    
    init() {
        // S'assurer que les valeurs initiales sont correctes
        this.remainingLetters = this.correctAnswer.length;
        this.correctPositions.clear();
        this.userInput = '';
        
        // Initialiser le compteur
        this.updateCounter();
        
        // Attacher les événements
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Styles initiaux
        this.counter.style.color = '#2ed573'; // Vert par défaut
        
        // console.log('SmartCharCounter initialisé:', {
        //     correctAnswer: this.correctAnswer,
        //     remainingLetters: this.remainingLetters,
        //     correctAnswerLength: this.correctAnswer.length
        // });
    }
    
    normalizeAnswer(answer) {
        if (!answer) return '';
        return answer.trim()
            .replace(/\s+/g, ' ')
            .replace(/"/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .toLowerCase();
    }
    
    handleInput(event) {
        const newInput = event.target.value.toLowerCase();
        const previousInput = this.userInput;
        
        // Détecter si c'est une nouvelle lettre ajoutée
        if (newInput.length > previousInput.length) {
            const newChar = newInput[newInput.length - 1];
            const position = newInput.length - 1;
            
            this.processNewCharacter(newChar, position);
        } 
        // Détecter si c'est une lettre supprimée
        else if (newInput.length < previousInput.length) {
            this.handleDeletion(previousInput, newInput);
        }
        
        this.userInput = newInput;
        this.updateCounter();
    }
    
    handleKeydown(event) {
        // Empêcher la suppression si on est au début
        if (event.key === 'Backspace' && this.input.selectionStart === 0) {
            event.preventDefault();
        }
    }
    
    processNewCharacter(char, position) {
        const correctChar = this.correctAnswer[position];
        
        if (correctChar && char === correctChar) {
            // Lettre correcte
            this.correctPositions.add(position);
            this.remainingLetters = Math.max(0, this.correctAnswer.length - this.correctPositions.size);
        }
        
        // Toujours mettre à jour le compteur après traitement
        this.updateCounter();
    }
    
    handleDeletion(previousInput, newInput) {
        // Recalculer les positions correctes après suppression
        this.correctPositions.clear();
        
        for (let i = 0; i < newInput.length; i++) {
            if (newInput[i] === this.correctAnswer[i]) {
                this.correctPositions.add(i);
            }
        }
        
        this.remainingLetters = Math.max(0, this.correctAnswer.length - this.correctPositions.size);
        
        // Mettre à jour le compteur
        this.updateCounter();
    }
    
    updateCounter() {
        // Toujours afficher le nombre de lettres restantes, sauf si toutes sont correctes
        if (this.remainingLetters === 0 && this.correctPositions.size === this.correctAnswer.length && this.correctAnswer.length > 0) {
            // Toutes les lettres sont correctes
            this.counter.innerHTML = `
                <span style="color: #2ed573;">✅ Toutes les lettres correctes !</span>
            `;
            this.counter.style.color = '#2ed573';
        } else {
            // Afficher le nombre de lettres restantes
            const percentage = this.correctAnswer.length > 0 ? (this.correctPositions.size / this.correctAnswer.length) * 100 : 0;
            
            let color = '#2ed573'; // Vert par défaut
            if (percentage >= 70 && this.correctPositions.size > 0) {
                color = '#ffa502'; // Orange
            }
            
            this.counter.innerHTML = `
                <span style="color: ${color};">${this.remainingLetters} lettres restantes</span>
            `;
            this.counter.style.color = color;
        }
    }
    
    showWarning() {
        // Animation d'avertissement
        this.counter.style.transform = 'scale(1.1)';
        this.counter.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            this.counter.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Méthode pour réinitialiser le compteur
    reset() {
        this.userInput = '';
        this.correctPositions.clear();
        this.remainingLetters = this.correctAnswer.length;
        this.input.value = '';
        this.updateCounter();
        this.counter.style.color = '#2ed573';
    }
    
    // Méthode pour obtenir le statut
    getStatus() {
        return {
            remainingLetters: this.remainingLetters,
            correctPositions: this.correctPositions.size,
            totalLetters: this.correctAnswer.length,
            isComplete: this.remainingLetters === 0
        };
    }
}

// Fonction utilitaire pour créer un compteur intelligent
function createSmartCounter(question, inputElement, counterElement) {
    if (!question || !inputElement || !counterElement) {
        console.error('Paramètres manquants pour createSmartCounter');
        return null;
    }
    
    return new SmartCharCounter(question, inputElement, counterElement);
}

// Exposer la classe et la fonction globalement
window.SmartCharCounter = SmartCharCounter;
window.createSmartCounter = createSmartCounter;
