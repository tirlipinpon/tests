// quiz-supabase.js - Fonctions communes pour l'intégration Supabase
// Configuration Supabase (chargée depuis config.local.js)

let supabase;

// Initialiser Supabase
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Attendre que Supabase soit chargé
    let attempts = 0;
    while (!window.supabase && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.supabase) {
      console.error('❌ Supabase CDN non chargé');
      return;
    }
    
    // Vérifier que la configuration est disponible
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ Configuration Supabase manquante. Vérifiez que config.local.js est chargé.');
      return;
    }
    
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase initialisé');
    
    // Rendre supabase accessible globalement
    window.supabase = supabase;
  } catch (error) {
    console.error('❌ Erreur initialisation Supabase:', error);
  }
});

// Fonction pour charger les catégories
async function loadCategories() {
  try {
    if (!supabase) {
      console.error('❌ Supabase non initialisé');
      return [];
    }

    const { data, error } = await supabase
      .from('quiz_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('❌ Erreur lors du chargement des catégories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Erreur lors du chargement des catégories:', error);
    return [];
  }
}

// Fonction pour obtenir les statistiques d'une catégorie
async function getCategoryStats(categoryName) {
  try {
    if (!supabase) {
      console.error('❌ Supabase non initialisé');
      return 0;
    }

    const { count, error } = await supabase
      .from('quiz_questions')
      .select('*', { count: 'exact', head: true })
      .eq('category', categoryName)
      .eq('deleted', false);

    if (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('❌ Erreur lors du chargement des statistiques:', error);
    return 0;
  }
}

// Exposer les fonctions globalement
window.loadCategories = loadCategories;
window.getCategoryStats = getCategoryStats;

// Charger les données depuis Supabase
async function loadQuizDataFromSupabase(category) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!supabase) {
      console.error('❌ Supabase non initialisé');
      return [];
    }

    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('category', category)
      .eq('deleted', false);

    if (error) {
      console.error('❌ Erreur lors du chargement:', error);
      return [];
    }

    if (data && data.length > 0) {
      console.log(`✅ ${data.length} questions chargées depuis Supabase`);
      return data.map(q => ({
        id: q.question_id,
        titre: q.title,
        code: q.code,
        options: q.options || [],
        reponse: q.correct_answer,
        correct_answer: q.correct_answer, // Ajouter le mapping correct
        explication: q.explanation || q.explication,
        exemple: q.exemple || '',
        type: q.question_type,
        question_type: q.question_type, // Ajouter le mapping correct
        deleted: q.deleted || false
      }));
    } else {
      console.log('⚠️ Aucune donnée trouvée pour la catégorie:', category);
      return [];
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error);
    return [];
  }
}

// Supprimer une question
async function deleteQuestion(questionId) {
  try {
    if (!supabase) {
      console.error('❌ Supabase non initialisé');
      return;
    }

    console.log('🗑️ Tentative de suppression de la question avec question_id:', questionId);

    const { error } = await supabase
      .from('quiz_questions')
      .update({ deleted: true })
      .eq('question_id', questionId);  // Utiliser question_id pour la cohérence avec le système de quiz

    if (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la question');
    } else {
      console.log('✅ Question supprimée avec succès');
      alert('Question supprimée avec succès');
      location.reload();
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    alert('Erreur lors de la suppression de la question');
  }
}

// Restaurer une question
async function restoreQuestion(questionId) {
  try {
    if (!supabase) {
      console.error('❌ Supabase non initialisé');
      return;
    }

    console.log('↩️ Tentative de restauration de la question avec question_id:', questionId);

    const { error } = await supabase
      .from('quiz_questions')
      .update({ deleted: false })
      .eq('question_id', questionId);  // Utiliser question_id pour la cohérence avec le système de quiz

    if (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      alert('Erreur lors de la restauration de la question');
    } else {
      console.log('✅ Question restaurée avec succès');
      alert('Question restaurée avec succès');
      location.reload();
    }
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
    alert('Erreur lors de la restauration de la question');
  }
}

// Ajouter un bouton de suppression à une question spécifique
function addDeleteButtonToQuestion(section, questionId) {
  const h2 = section.querySelector('h2');
  if (h2 && questionId) {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️ Supprimer';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.cssText = 'background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px; font-size: 12px;';
    deleteBtn.onclick = () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
        deleteQuestion(questionId);
      }
    };
    h2.appendChild(deleteBtn);
    console.log(`✅ Bouton ajouté pour ${questionId}`);
  }
}

// Exposer la fonction globalement pour QuizManager
window.addDeleteButtonToQuestion = addDeleteButtonToQuestion;

// Ajouter les boutons de suppression (méthode de fallback)
function addDeleteButtons(category) {
  console.log(`🔧 Tentative d'ajout des boutons pour la catégorie: ${category}`);
  
  setTimeout(() => {
    const sections = document.querySelectorAll('section');
    console.log(`🔍 ${sections.length} sections trouvées`);
    
    sections.forEach((section, index) => {
      const h2 = section.querySelector('h2');
      if (h2) {
        // Regex générique pour extraire l'ID de la question
        const questionId = h2.textContent.match(new RegExp(`(${category}-\\d+)`))?.[1];
        if (questionId) {
          addDeleteButtonToQuestion(section, questionId);
        }
      }
    });
  }, 1000);
}

// Initialiser le quiz
async function initializeQuiz(category) {
  try {
    console.log(`🚀 Initialisation du quiz ${category}...`);
    const quizData = await loadQuizDataFromSupabase(category);
    window.quizData = quizData; // Rendre accessible globalement
    
    // Attendre que QuizManager soit disponible
    let attempts = 0;
    const maxAttempts = 50; // 5 secondes max
    
    while (!window.QuizManager && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (window.QuizManager) {
      window.quizManager = new window.QuizManager('quizContainer', quizData);
      console.log(`✅ Quiz ${category} initialisé avec succès`);
      console.log(`📊 ${quizData.length} questions chargées`);
      console.log(`🔧 Les boutons de suppression seront ajoutés automatiquement lors du rendu`);
      
      // Initialiser les statistiques
      if (window.initializeQuizStats) {
        window.initializeQuizStats(category, quizData);
      }
    } else {
      console.error('❌ QuizManager non disponible après 5 secondes d\'attente');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}
