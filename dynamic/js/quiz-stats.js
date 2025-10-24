// quiz-stats.js - Système de statistiques pour les quiz
// Affiche des informations détaillées sur les questions et les performances

class QuizStats {
  constructor() {
    console.log('🔧 QuizStats constructor appelé');
    this.statsContainer = null;
    this.quizData = null;
    this.category = null;
    this.cookieManager = null;
    this.stats = {
      totalQuestions: 0,
      qcmQuestions: 0,
      inputQuestions: 0,
      otherQuestions: 0,
      questionsWithCode: 0,
      questionsWithExplanation: 0,
      questionsWithExample: 0,
      averageOptionsPerQCM: 0,
      totalOptions: 0,
      hiddenQuestions: 0,      // Questions cachées par les cookies (score >5)
      deletedQuestions: 0,     // Questions supprimées en base
      remainingQuestions: 0    // Questions réellement disponibles
    };
    console.log('🔧 QuizStats constructor terminé, this.init:', typeof this.init);
  }

  // Initialiser les statistiques
  async init(category, quizData) {
    this.category = category;
    this.quizData = quizData;
    
    // Initialiser le cookie manager pour cette catégorie
    console.log('🔍 Vérification CookieManager:', { 
      exists: !!window.CookieManager, 
      type: typeof window.CookieManager,
      category: category 
    });
    
    if (window.CookieManager) {
      this.cookieManager = new window.CookieManager(category);
      console.log('✅ CookieManager initialisé:', this.cookieManager);
    } else {
      console.warn('⚠️ CookieManager non disponible');
    }
    
    // Recharger toutes les données (incluant les supprimées) pour des statistiques complètes
    if (window.loadAllQuizDataForStats) {
      console.log('🔄 Rechargement des données complètes pour les statistiques...');
      this.quizData = await window.loadAllQuizDataForStats(category);
      console.log('📊 Données complètes chargées:', this.quizData.length, 'questions');
    }
    
    this.calculateStats();
    this.createStatsContainer();
    this.displayStats();
  }

  // Calculer les statistiques
  calculateStats() {
    if (!this.quizData || this.quizData.length === 0) {
      console.log('⚠️ Aucune donnée de quiz disponible pour les statistiques');
      return;
    }

    this.stats.totalQuestions = this.quizData.length;
    this.stats.qcmQuestions = 0;
    this.stats.inputQuestions = 0;
    this.stats.otherQuestions = 0;
    this.stats.questionsWithCode = 0;
    this.stats.questionsWithExplanation = 0;
    this.stats.questionsWithExample = 0;
    this.stats.totalOptions = 0;
    this.stats.hiddenQuestions = 0;
    this.stats.deletedQuestions = 0;

    this.quizData.forEach((question, index) => {
      // Compter les questions supprimées
      if (question.deleted === true) {
        this.stats.deletedQuestions++;
      }

      // Compter les questions cachées par les cookies (score >5)
      if (this.cookieManager) {
        const isHidden = this.cookieManager.shouldHideQuestion(question.id);
        if (isHidden) {
          this.stats.hiddenQuestions++;
          console.log('🙈 Question cachée détectée:', question.id, 'Score:', this.cookieManager.getCorrectAnswers(question.id));
        }
      } else {
        console.warn('⚠️ CookieManager non disponible pour vérifier les questions cachées');
      }

      // Compter les types de questions (seulement pour les questions non supprimées)
      if (!question.deleted) {
        if (question.type === 'qcm') {
          this.stats.qcmQuestions++;
          if (question.options && Array.isArray(question.options)) {
            this.stats.totalOptions += question.options.length;
          }
        } else if (question.type === 'input') {
          this.stats.inputQuestions++;
        } else {
          this.stats.otherQuestions++;
        }

        // Compter les questions avec du code
        if (question.code && question.code.trim() !== '') {
          this.stats.questionsWithCode++;
        }

        // Compter les questions avec explication
        if (question.explication && question.explication.trim() !== '') {
          this.stats.questionsWithExplanation++;
        }

        // Compter les questions avec exemple
        if (question.exemple && question.exemple.trim() !== '') {
          this.stats.questionsWithExample++;
        }
      }
      
      // Debug: afficher les champs disponibles pour la première question
      if (index === 0) {
        console.log('🔍 Debug première question:', {
          id: question.id,
          explication: question.explanation,
          explication_fr: question.explication,
          exemple: question.exemple,
          hasExplanation: !!(question.explanation || question.explication),
          hasExample: !!(question.exemple && question.exemple.trim() !== ''),
          isDeleted: question.deleted,
          isHidden: this.cookieManager ? this.cookieManager.shouldHideQuestion(question.id) : false,
          allFields: Object.keys(question)
        });
      }
    });

    // Calculer le nombre de questions réellement disponibles
    this.stats.remainingQuestions = this.stats.totalQuestions - this.stats.deletedQuestions - this.stats.hiddenQuestions;

    // Calculer la moyenne d'options par QCM
    if (this.stats.qcmQuestions > 0) {
      this.stats.averageOptionsPerQCM = Math.round((this.stats.totalOptions / this.stats.qcmQuestions) * 10) / 10;
    }
  }

  // Créer le conteneur des statistiques
  createStatsContainer() {
    // Supprimer l'ancien conteneur s'il existe
    const existingStats = document.getElementById('quiz-stats-container');
    if (existingStats) {
      existingStats.remove();
    }

    // Créer le nouveau conteneur
    this.statsContainer = document.createElement('div');
    this.statsContainer.id = 'quiz-stats-container';
    this.statsContainer.className = 'quiz-stats';
    this.statsContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      max-width: 300px;
      z-index: 1000;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    // Ajouter les boutons de contrôle
    this.addControlButtons();

    // Ajouter au body
    document.body.appendChild(this.statsContainer);
  }

  // Créer un bouton de contrôle réutilisable
  createControlButton(innerHTML, onClick, rightPosition) {
    const button = document.createElement('button');
    button.innerHTML = innerHTML;
    button.style.cssText = `
      position: absolute;
      top: 5px;
      right: ${rightPosition}px;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    button.onclick = onClick;
    return button;
  }

  // Afficher les statistiques
  displayStats() {
    if (!this.statsContainer) return;

    const percentageQCM = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.qcmQuestions / this.stats.totalQuestions) * 100) : 0;
    const percentageInput = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.inputQuestions / this.stats.totalQuestions) * 100) : 0;
    const percentageCode = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.questionsWithCode / this.stats.totalQuestions) * 100) : 0;
    const percentageExplanation = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.questionsWithExplanation / this.stats.totalQuestions) * 100) : 0;
    const percentageExample = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.questionsWithExample / this.stats.totalQuestions) * 100) : 0;

    // Calculer les pourcentages pour les nouvelles statistiques
    const percentageHidden = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.hiddenQuestions / this.stats.totalQuestions) * 100) : 0;
    const percentageDeleted = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.deletedQuestions / this.stats.totalQuestions) * 100) : 0;
    const percentageRemaining = this.stats.totalQuestions > 0 ? 
      Math.round((this.stats.remainingQuestions / this.stats.totalQuestions) * 100) : 0;

    this.statsContainer.innerHTML = `
      <div class="stats-header" style="margin-bottom: 10px; font-weight: bold; font-size: 16px;">
        📊 Statistiques ${this.category.toUpperCase()}
      </div>
      <div class="stats-content">
        <div class="stat-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">
          <span style="color: #ffd700;">📝</span> <strong>Total:</strong> ${this.stats.totalQuestions} questions
        </div>
        
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #4CAF50;">✅</span> <strong>Disponibles:</strong> ${this.stats.remainingQuestions} (${percentageRemaining}%)
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #FF9800;">🙈</span> <strong>Cachées:</strong> ${this.stats.hiddenQuestions} (${percentageHidden}%)
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #f44336;">🗑️</span> <strong>Supprimées:</strong> ${this.stats.deletedQuestions} (${percentageDeleted}%)
        </div>
        
        <div class="stat-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px; margin-top: 10px;">
          <span style="color: #2196F3;">📋</span> <strong>Types disponibles:</strong>
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #4CAF50;">🔘</span> QCM: <strong>${this.stats.qcmQuestions}</strong> (${percentageQCM}%)
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #2196F3;">✏️</span> Input: <strong>${this.stats.inputQuestions}</strong> (${percentageInput}%)
        </div>
        ${this.stats.otherQuestions > 0 ? `
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #FF9800;">❓</span> Autres: <strong>${this.stats.otherQuestions}</strong>
        </div>
        ` : ''}
        
        <div class="stat-item" style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px; margin-top: 10px;">
          <span style="color: #9C27B0;">📚</span> <strong>Contenu:</strong>
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #9C27B0;">💻</span> Avec code: <strong>${this.stats.questionsWithCode}</strong> (${percentageCode}%)
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #607D8B;">📖</span> Avec explication: <strong>${this.stats.questionsWithExplanation}</strong> (${percentageExplanation}%)
        </div>
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #FF5722;">💡</span> Avec exemple: <strong>${this.stats.questionsWithExample}</strong> (${percentageExample}%)
        </div>
        ${this.stats.qcmQuestions > 0 ? `
        <div class="stat-item" style="margin-bottom: 8px;">
          <span style="color: #E91E63;">🎯</span> Moy. options/QCM: <strong>${this.stats.averageOptionsPerQCM}</strong>
        </div>
        ` : ''}
        
        <div class="stat-item" style="margin-bottom: 8px; font-size: 12px; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 5px; margin-top: 10px;">
          <span style="color: #00BCD4;">🕒</span> Mis à jour: ${new Date().toLocaleTimeString()}
        </div>
      </div>
    `;

    // Réajouter les boutons
    this.addControlButtons();
  }

  // Ajouter les boutons de contrôle
  addControlButtons() {
    const closeBtn = this.createControlButton('✕', () => this.hideStats(), 8);
    const minimizeBtn = this.createControlButton('−', () => this.toggleMinimize(), 35);

    this.statsContainer.appendChild(closeBtn);
    this.statsContainer.appendChild(minimizeBtn);
  }

  // Masquer les statistiques
  hideStats() {
    if (this.statsContainer) {
      this.statsContainer.style.display = 'none';
    }
  }

  // Afficher les statistiques
  showStats() {
    if (this.statsContainer) {
      this.statsContainer.style.display = 'block';
    }
  }

  // Basculer la minimisation
  toggleMinimize() {
    if (this.statsContainer) {
      const content = this.statsContainer.querySelector('.stats-content');
      if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
      }
    }
  }

  // Mettre à jour les statistiques
  updateStats() {
    this.calculateStats();
    this.displayStats();
  }

  // Obtenir les statistiques sous forme d'objet
  getStats() {
    return { ...this.stats };
  }
}

// Fonction globale pour initialiser les statistiques
async function initializeQuizStats(category, quizData) {
  console.log('🔧 Initialisation des statistiques pour:', category);
  console.log('🔧 Données du quiz:', quizData?.length, 'questions');
  
  try {
    // Créer une nouvelle instance à chaque fois
    const statsInstance = new QuizStats();
    
    console.log('🔧 QuizStats instance créée:', statsInstance);
    console.log('🔧 QuizStats.init method:', typeof statsInstance.init);
    
    if (typeof statsInstance.init === 'function') {
      await statsInstance.init(category, quizData);
      window.quizStats = statsInstance;
      console.log('✅ Statistiques initialisées avec succès');
    } else {
      console.error('❌ La méthode init n\'est pas disponible sur QuizStats');
      console.error('❌ Méthodes disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(statsInstance)));
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de QuizStats:', error);
  }
}

// Fonction pour mettre à jour les statistiques
async function updateQuizStats() {
  if (window.quizStats) {
    // Recharger les données complètes pour les statistiques
    if (window.loadAllQuizDataForStats && window.quizStats.category) {
      console.log('🔄 Mise à jour des statistiques avec données complètes...');
      window.quizStats.quizData = await window.loadAllQuizDataForStats(window.quizStats.category);
      console.log('📊 Nouvelles données chargées:', window.quizStats.quizData.length, 'questions');
    }
    window.quizStats.updateStats();
  }
}

// Fonction pour basculer l'affichage des statistiques
function toggleQuizStats() {
  if (window.quizStats) {
    if (window.quizStats.statsContainer.style.display === 'none') {
      window.quizStats.showStats();
    } else {
      window.quizStats.hideStats();
    }
  }
}

// Exposer les fonctions et classes globalement
window.QuizStats = QuizStats;
window.initializeQuizStats = initializeQuizStats;
window.updateQuizStats = updateQuizStats;
window.toggleQuizStats = toggleQuizStats;
