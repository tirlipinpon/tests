// get-quiz-data.js - Script pour récupérer les données de quiz depuis Supabase
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.key);

// Fonction pour récupérer les données par catégorie
async function getQuizDataByCategory(category, includeDeleted = false) {
  try {
    console.log(`🔍 Récupération des données pour la catégorie: ${category}`);
    
    let query = supabase
      .from('quiz_questions')
      .select('*')
      .eq('category', category)
      .order('question_id');
    
    if (!includeDeleted) {
      query = query.eq('deleted', false);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log(`✅ ${data.length} questions trouvées pour ${category}`);
    return data;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    return [];
  }
}

// Fonction pour récupérer toutes les données
async function getAllQuizData(includeDeleted = false) {
  try {
    console.log('🔍 Récupération de toutes les données de quiz...');
    
    let query = supabase
      .from('quiz_questions')
      .select('*')
      .order('category', { ascending: true })
      .order('question_id');
    
    if (!includeDeleted) {
      query = query.eq('deleted', false);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log(`✅ ${data.length} questions trouvées au total`);
    return data;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    return [];
  }
}

// Fonction pour afficher les statistiques par catégorie
async function getStatistics() {
  try {
    console.log('📊 Statistiques des données de quiz');
    console.log('===================================');
    
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('category, question_type')
      .order('category');

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }
    
    // Grouper par catégorie
    const stats = data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { total: 0, qcm: 0, input: 0 };
      }
      acc[item.category].total++;
      if (item.question_type === 'qcm') {
        acc[item.category].qcm++;
      } else if (item.question_type === 'input') {
        acc[item.category].input++;
      }
      return acc;
    }, {});
    
    // Afficher les statistiques
    Object.entries(stats).forEach(([category, stat]) => {
      console.log(`\n📁 ${category.toUpperCase()}:`);
      console.log(`   Total: ${stat.total} questions`);
      console.log(`   QCM: ${stat.qcm}`);
      console.log(`   Input: ${stat.input}`);
    });
    
    console.log(`\n📈 Total général: ${data.length} questions`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const category = args[1];
  
  switch (command) {
    case 'category':
      if (!category) {
        console.error('❌ Veuillez spécifier une catégorie');
        console.log('Usage: node get-quiz-data.js category <category_name>');
        return;
      }
      const categoryData = await getQuizDataByCategory(category);
      console.log('📋 Données récupérées:', categoryData);
      break;
      
    case 'all':
      const allData = await getAllQuizData();
      console.log('📋 Toutes les données:', allData);
      break;
      
    case 'stats':
      await getStatistics();
      break;
      
    default:
      console.log('🎯 Script de récupération des données de quiz');
      console.log('============================================');
      console.log('Usage:');
      console.log('  node get-quiz-data.js category <category_name>  - Récupérer par catégorie');
      console.log('  node get-quiz-data.js all                       - Récupérer toutes les données');
      console.log('  node get-quiz-data.js stats                     - Afficher les statistiques');
      console.log('\nCatégories disponibles:');
      Object.keys(config.categories).forEach(cat => {
        console.log(`  - ${cat}: ${config.categories[cat].name}`);
      });
      break;
  }
}

// Exécuter le script
main().catch(console.error);
