// manage-questions.js - Script pour gérer les questions (supprimer, restaurer, etc.)
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.key);

// Fonction pour supprimer une question (soft delete)
async function deleteQuestion(questionId) {
  try {
    console.log(`🗑️ Suppression de la question: ${questionId}`);
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .update({ deleted: true })
      .eq('question_id', questionId)
      .select();

    if (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return false;
    }
    
    if (data.length === 0) {
      console.log('⚠️ Aucune question trouvée avec cet ID');
      return false;
    }
    
    console.log(`✅ Question ${questionId} supprimée avec succès`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return false;
  }
}

// Fonction pour restaurer une question
async function restoreQuestion(questionId) {
  try {
    console.log(`🔄 Restauration de la question: ${questionId}`);
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .update({ deleted: false })
      .eq('question_id', questionId)
      .select();

    if (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      return false;
    }
    
    if (data.length === 0) {
      console.log('⚠️ Aucune question trouvée avec cet ID');
      return false;
    }
    
    console.log(`✅ Question ${questionId} restaurée avec succès`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
    return false;
  }
}

// Fonction pour supprimer définitivement une question
async function permanentDeleteQuestion(questionId) {
  try {
    console.log(`💀 Suppression définitive de la question: ${questionId}`);
    
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('question_id', questionId);

    if (error) {
      console.error('❌ Erreur lors de la suppression définitive:', error);
      return false;
    }
    
    console.log(`✅ Question ${questionId} supprimée définitivement`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression définitive:', error);
    return false;
  }
}

// Fonction pour lister toutes les questions (y compris supprimées)
async function listAllQuestions(includeDeleted = false) {
  try {
    console.log(`📋 Liste des questions (supprimées: ${includeDeleted ? 'incluses' : 'exclues'})`);
    
    let query = supabase
      .from('quiz_questions')
      .select('*')
      .order('question_id');
    
    if (!includeDeleted) {
      query = query.eq('deleted', false);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return [];
    }
    
    console.log(`✅ ${data.length} questions trouvées`);
    
    data.forEach((q, index) => {
      const status = q.deleted ? '🗑️ SUPPRIMÉE' : '✅ ACTIVE';
      console.log(`${index + 1}. ${q.question_id}: ${q.title} ${status}`);
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    return [];
  }
}

// Fonction pour vider la corbeille (supprimer définitivement toutes les questions supprimées)
async function emptyTrash() {
  try {
    console.log('🗑️ Vidage de la corbeille...');
    
    const { data: deletedQuestions, error: selectError } = await supabase
      .from('quiz_questions')
      .select('question_id')
      .eq('deleted', true);

    if (selectError) {
      console.error('❌ Erreur lors de la récupération des questions supprimées:', selectError);
      return false;
    }
    
    if (deletedQuestions.length === 0) {
      console.log('✅ Aucune question supprimée à supprimer définitivement');
      return true;
    }
    
    const { error: deleteError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('deleted', true);

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression définitive:', deleteError);
      return false;
    }
    
    console.log(`✅ ${deletedQuestions.length} questions supprimées définitivement`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors du vidage de la corbeille:', error);
    return false;
  }
}

// Fonction pour obtenir les statistiques
async function getStatistics() {
  try {
    console.log('📊 Statistiques des questions');
    console.log('=============================');
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('deleted, question_type, category');

    if (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      return;
    }
    
    const active = data.filter(q => !q.deleted);
    const deleted = data.filter(q => q.deleted);
    
    console.log(`📈 Total: ${data.length} questions`);
    console.log(`✅ Actives: ${active.length}`);
    console.log(`🗑️ Supprimées: ${deleted.length}`);
    
    // Statistiques par catégorie
    const categoryStats = data.reduce((acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = { active: 0, deleted: 0 };
      }
      if (q.deleted) {
        acc[q.category].deleted++;
      } else {
        acc[q.category].active++;
      }
      return acc;
    }, {});
    
    console.log('\n📁 Par catégorie:');
    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`   ${category}: ${stats.active} actives, ${stats.deleted} supprimées`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const questionId = args[1];
  
  switch (command) {
    case 'delete':
      if (!questionId) {
        console.error('❌ Veuillez spécifier un ID de question');
        console.log('Usage: node manage-questions.js delete <question_id>');
        return;
      }
      await deleteQuestion(questionId);
      break;
      
    case 'restore':
      if (!questionId) {
        console.error('❌ Veuillez spécifier un ID de question');
        console.log('Usage: node manage-questions.js restore <question_id>');
        return;
      }
      await restoreQuestion(questionId);
      break;
      
    case 'permanent-delete':
      if (!questionId) {
        console.error('❌ Veuillez spécifier un ID de question');
        console.log('Usage: node manage-questions.js permanent-delete <question_id>');
        return;
      }
      await permanentDeleteQuestion(questionId);
      break;
      
    case 'list':
      const includeDeleted = args[1] === '--include-deleted';
      await listAllQuestions(includeDeleted);
      break;
      
    case 'empty-trash':
      await emptyTrash();
      break;
      
    case 'stats':
      await getStatistics();
      break;
      
    default:
      console.log('🎯 Gestionnaire de questions');
      console.log('============================');
      console.log('Usage:');
      console.log('  node manage-questions.js delete <question_id>           - Supprimer une question');
      console.log('  node manage-questions.js restore <question_id>          - Restaurer une question');
      console.log('  node manage-questions.js permanent-delete <question_id> - Supprimer définitivement');
      console.log('  node manage-questions.js list [--include-deleted]       - Lister les questions');
      console.log('  node manage-questions.js empty-trash                    - Vider la corbeille');
      console.log('  node manage-questions.js stats                          - Afficher les statistiques');
      break;
  }
}

// Exécuter le script
main().catch(console.error);
