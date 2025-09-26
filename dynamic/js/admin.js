// admin.js - Script d'administration du système de quiz
let categories = [];
let currentEditingCategory = null;
let validatedQuestions = [];
let currentQuestions = [];
let currentCategory = null;

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Vérifier que Supabase est initialisé
        if (!supabase) {
            showAlert('Erreur: Supabase non initialisé. Vérifiez votre configuration.', 'error');
            return;
        }
        
        // Charger les catégories
        await loadCategories();
        
        // Initialiser les événements
        initializeEvents();
        
        // Charger les statistiques
        await loadStats();
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showAlert('Erreur lors de l\'initialisation: ' + error.message, 'error');
    }
});

// Initialiser les événements
function initializeEvents() {
    // Formulaire de catégorie
    document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);
    
    // Upload de fichier
    const fileUpload = document.getElementById('file-upload-zone');
    const fileInput = document.getElementById('json-file');
    
    fileUpload.addEventListener('click', () => fileInput.click());
    fileUpload.addEventListener('dragover', handleDragOver);
    fileUpload.addEventListener('dragleave', handleDragLeave);
    fileUpload.addEventListener('drop', handleDrop);
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Validation JSON en temps réel
    document.getElementById('json-text').addEventListener('input', debounce(validateJson, 500));
}

// Charger les catégories
async function loadCategories() {
    try {
        const { data, error } = await supabase
            .from('quiz_categories')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        categories = data || [];
        renderCategories();
        updateCategorySelect();
        updateQuestionsCategorySelect();
        
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        showAlert('Erreur lors du chargement des catégories: ' + error.message, 'error');
    }
}

// Afficher les catégories
function renderCategories() {
    const container = document.getElementById('categories-list');
    
    if (categories.length === 0) {
        container.innerHTML = '<p>Aucune catégorie trouvée.</p>';
        return;
    }
    
    const html = `
        <div class="categories-grid">
            ${categories.map(category => `
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-icon">${category.icon || '🎯'}</div>
                        <div class="category-info">
                            <h3>${category.display_name}</h3>
                            <p style="color: #666; margin: 0;">${category.name}</p>
                        </div>
                    </div>
                    <p>${category.description || 'Aucune description'}</p>
                    <div class="category-stats">
                        <span>Niveau: ${category.level}</span>
                        <span>Questions: <span id="question-count-${category.name}">Chargement...</span></span>
                    </div>
                    <div class="category-actions">
                        <a href="quiz.html?category=${category.name}" class="btn btn-primary" target="_blank">🎯 Voir Quiz</a>
                        <button class="btn" onclick="editCategory('${category.name}')">Modifier</button>
                        <button class="btn btn-danger" onclick="deleteCategory('${category.name}')">Supprimer</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    
    // Charger le nombre de questions pour chaque catégorie
    loadQuestionCounts();
}

// Charger le nombre de questions par catégorie
async function loadQuestionCounts() {
    for (const category of categories) {
        try {
            const { count, error } = await supabase
                .from('quiz_questions')
                .select('*', { count: 'exact', head: true })
                .eq('category', category.name)
                .eq('deleted', false);
            
            if (error) throw error;
            
            const countEl = document.getElementById(`question-count-${category.name}`);
            if (countEl) countEl.textContent = count || 0;
            
        } catch (error) {
            console.error(`Erreur pour ${category.name}:`, error);
        }
    }
}

// Mettre à jour le select des catégories
function updateCategorySelect() {
    const select = document.getElementById('import-category');
    select.innerHTML = '<option value="">-- Sélectionner une catégorie --</option>' +
        categories.map(cat => `<option value="${cat.name}">${cat.display_name}</option>`).join('');
}

// Gérer la soumission du formulaire de catégorie
async function handleCategorySubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('category-name').value.toLowerCase().trim(),
        display_name: document.getElementById('category-display-name').value.trim(),
        description: document.getElementById('category-description').value.trim(),
        level: document.getElementById('category-level').value,
        color: document.getElementById('category-color').value,
        icon: document.getElementById('category-icon').value || '🎯',
        is_active: true
    };
    
    try {
        if (currentEditingCategory) {
            // Modification
            await updateCategory(currentEditingCategory, formData);
            showAlert('Catégorie modifiée avec succès!', 'success');
        } else {
            // Création
            await createCategory(formData);
            showAlert('Catégorie créée avec succès!', 'success');
        }
        
        resetCategoryForm();
        await loadCategories();
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showAlert('Erreur lors de la sauvegarde: ' + error.message, 'error');
    }
}

// Créer une catégorie
async function createCategory(categoryData) {
    const { error } = await supabase
        .from('quiz_categories')
        .insert([categoryData]);
    
    if (error) throw error;
}

// Modifier une catégorie
async function updateCategory(categoryName, categoryData) {
    const { error } = await supabase
        .from('quiz_categories')
        .update(categoryData)
        .eq('name', categoryName);
    
    if (error) throw error;
}

// Supprimer une catégorie
async function deleteCategory(categoryName) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`)) {
        return;
    }
    
    try {
        // Vérifier s'il y a des questions dans cette catégorie
        const { count, error: countError } = await supabase
            .from('quiz_questions')
            .select('*', { count: 'exact', head: true })
            .eq('category', categoryName)
            .eq('deleted', false);
        
        if (countError) throw countError;
        
        if (count > 0) {
            if (!confirm(`Cette catégorie contient ${count} questions. Voulez-vous vraiment la supprimer ?`)) {
                return;
            }
        }
        
        const { error } = await supabase
            .from('quiz_categories')
            .delete()
            .eq('name', categoryName);
        
        if (error) throw error;
        
        showAlert('Catégorie supprimée avec succès!', 'success');
        await loadCategories();
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showAlert('Erreur lors de la suppression: ' + error.message, 'error');
    }
}

// Modifier une catégorie
function editCategory(categoryName) {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return;
    
    currentEditingCategory = categoryName;
    
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-display-name').value = category.display_name;
    document.getElementById('category-description').value = category.description || '';
    document.getElementById('category-level').value = category.level;
    document.getElementById('category-color').value = category.color;
    document.getElementById('category-icon').value = category.icon;
    
    document.getElementById('category-form-title').textContent = 'Modifier la catégorie';
    document.getElementById('category-submit-btn').textContent = 'Modifier la catégorie';
    
    // Désactiver le champ nom (non modifiable)
    document.getElementById('category-name').disabled = true;
    
    // Scroll vers le formulaire
    document.getElementById('category-form').scrollIntoView({ behavior: 'smooth' });
}

// Réinitialiser le formulaire de catégorie
function resetCategoryForm() {
    currentEditingCategory = null;
    document.getElementById('category-form').reset();
    document.getElementById('category-form-title').textContent = 'Ajouter une nouvelle catégorie';
    document.getElementById('category-submit-btn').textContent = 'Ajouter la catégorie';
    document.getElementById('category-name').disabled = false;
}

// Gestion du drag & drop
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Traiter un fichier JSON
function handleFile(file) {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        showAlert('Veuillez sélectionner un fichier JSON valide.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('json-text').value = e.target.result;
        validateJson();
    };
    reader.readAsText(file);
}

// Valider le JSON
function validateJson() {
    const jsonText = document.getElementById('json-text').value.trim();
    const importBtn = document.getElementById('import-btn');
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    
    if (!jsonText) {
        importBtn.disabled = true;
        previewSection.style.display = 'none';
        return;
    }
    
    try {
        const questions = JSON.parse(jsonText);
        
        if (!Array.isArray(questions)) {
            throw new Error('Le JSON doit contenir un tableau de questions');
        }
        
        // Valider chaque question selon la vraie structure DB
        const validatedQuestions = questions.map((q, index) => {
            // L'id est auto-généré par la DB, donc pas obligatoire dans le JSON
            if (!q.title || !q.correct_answer) {
                throw new Error(`Question ${index + 1}: title et correct_answer sont obligatoires`);
            }
            
            return {
                // id sera généré automatiquement par Supabase
                question_id: q.question_id || `question-${index + 1}`,
                title: q.title,
                code: q.code || '',
                options: q.options || [],
                correct_answer: q.correct_answer,
                question_type: q.question_type || 'qcm',
                explanation: q.explanation || '',
                exemple: q.exemple || '',
                category: q.category || 'general',
                deleted: false
            };
        });
        
        // Afficher la prévisualisation
        showPreview(validatedQuestions);
        importBtn.disabled = false;
        
    } catch (error) {
        showAlert('JSON invalide: ' + error.message, 'error');
        importBtn.disabled = true;
        previewSection.style.display = 'none';
    }
}

// Afficher la prévisualisation
function showPreview(questions) {
    const previewContent = document.getElementById('preview-content');
    const previewSection = document.getElementById('preview-section');
    
    const html = questions.map((q, index) => `
        <div class="preview-item">
            <h4>Question ${index + 1}: ${q.title}</h4>
            <p><strong>Type:</strong> ${q.question_type}</p>
            <p><strong>Réponse:</strong> ${q.correct_answer}</p>
            ${q.options.length > 0 ? `<p><strong>Options:</strong> ${q.options.join(', ')}</p>` : ''}
            ${q.explanation ? `<p><strong>Explication:</strong> ${q.explanation}</p>` : ''}
        </div>
    `).join('');
    
    previewContent.innerHTML = html;
    previewSection.style.display = 'block';
}

// Importer les questions
async function importQuestions() {
    const category = document.getElementById('import-category').value;
    const jsonText = document.getElementById('json-text').value.trim();
    
    if (!category) {
        showAlert('Veuillez sélectionner une catégorie', 'error');
        return;
    }
    
    if (!jsonText) {
        showAlert('Veuillez fournir des questions à importer', 'error');
        return;
    }
    
    try {
        const questions = JSON.parse(jsonText);
        
        // Transformer les questions pour Supabase (utiliser les champs déjà validés)
        const transformedQuestions = questions.map(q => ({
            question_id: q.question_id || q.id,
            category: category,
            title: q.title,
            code: q.code || '',
            options: q.options || [],
            correct_answer: q.correct_answer,
            question_type: q.question_type || 'qcm',
            explanation: q.explanation || '',
            exemple: q.exemple || '',
            deleted: false
        }));
        
        // Importer en base
        const { error } = await supabase
            .from('quiz_questions')
            .insert(transformedQuestions);
        
        if (error) throw error;
        
        showAlert(`${questions.length} questions importées avec succès!`, 'success');
        clearImport();
        await loadCategories(); // Recharger pour mettre à jour les compteurs
        
    } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        showAlert('Erreur lors de l\'import: ' + error.message, 'error');
    }
}

// Effacer l'import
function clearImport() {
    document.getElementById('json-text').value = '';
    document.getElementById('import-category').value = '';
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('import-btn').disabled = true;
}

// Charger les statistiques
async function loadStats() {
    try {
        const statsContent = document.getElementById('stats-content');
        
        // Compter les catégories
        const { count: categoryCount, error: categoryError } = await supabase
            .from('quiz_categories')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);
        
        if (categoryError) throw categoryError;
        
        // Compter les questions
        const { count: questionCount, error: questionError } = await supabase
            .from('quiz_questions')
            .select('*', { count: 'exact', head: true })
            .eq('deleted', false);
        
        if (questionError) throw questionError;
        
        // Statistiques par catégorie
        const { data: categoryStats, error: statsError } = await supabase
            .from('quiz_questions')
            .select('category')
            .eq('deleted', false);
        
        if (statsError) throw statsError;
        
        const statsByCategory = {};
        categoryStats.forEach(q => {
            statsByCategory[q.category] = (statsByCategory[q.category] || 0) + 1;
        });
        
        const html = `
            <div class="categories-grid">
                <div class="category-card">
                    <h3>📊 Vue d'ensemble</h3>
                    <p><strong>Catégories actives:</strong> ${categoryCount || 0}</p>
                    <p><strong>Questions totales:</strong> ${questionCount || 0}</p>
                </div>
                ${Object.entries(statsByCategory).map(([category, count]) => `
                    <div class="category-card">
                        <h3>${category}</h3>
                        <p><strong>Questions:</strong> ${count}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        statsContent.innerHTML = html;
        
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        document.getElementById('stats-content').innerHTML = '<p>Erreur lors du chargement des statistiques</p>';
    }
}

// Afficher une alerte
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insérer au début de la section active
    const activeSection = document.querySelector('.admin-section.active');
    activeSection.insertBefore(alertDiv, activeSection.firstChild);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Afficher une section
function showSection(sectionName) {
    // Masquer toutes les sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    document.getElementById(`${sectionName}-section`).classList.add('active');
    event.target.classList.add('active');
    
    // Recharger les données si nécessaire
    if (sectionName === 'questions') {
        // La section des questions se charge automatiquement quand on sélectionne une catégorie
        console.log('Section des questions activée');
    } else if (sectionName === 'stats') {
        loadStats();
    }
}

// Fonction debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== GESTION DES QUESTIONS =====

// Charger les questions d'une catégorie
async function loadQuestionsForCategory() {
    const categorySelect = document.getElementById('questions-category');
    const categoryName = categorySelect.value;
    
    if (!categoryName) {
        document.getElementById('questions-list').innerHTML = '<div class="info-message">Sélectionnez une catégorie pour voir ses questions</div>';
        return;
    }
    
    try {
        console.log('🔧 Chargement des questions pour la catégorie:', categoryName);
        
        // Charger toutes les questions (actives et supprimées)
        const { data, error } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('category', categoryName)
            .order('created_at', { ascending: false });
        
        // Debug: Afficher la structure des données
        if (data && data.length > 0) {
            console.log('🔍 Première question brute de la DB:', data[0]);
            console.log('🔍 Tous les champs disponibles:', Object.keys(data[0]));
        }
        
        if (error) {
            throw error;
        }
        
        currentQuestions = data || [];
        currentCategory = categoryName;
        
        // Initialiser et mapper les champs pour chaque question selon la vraie structure DB
        currentQuestions.forEach(question => {
            // Mapper les champs selon la vraie structure de la table
            question.titre = question.title || ''; // title en DB
            question.question = question.code || ''; // code en DB (pas question)
            question.question_type = question.question_type || 'input'; // question_type en DB
            question.correct_answer = question.correct_answer || '';
            question.explanation = question.explanation || '';
            question.exemple = question.exemple || '';
            
            console.log('🔧 Question mappée selon la vraie structure DB:', {
                id: question.id,
                question_id: question.question_id,
                title: question.title,
                code: question.code,
                question_type: question.question_type,
                correct_answer: question.correct_answer,
                options: question.options
            });
        });
        
        console.log('✅ Questions chargées:', currentQuestions.length);
        
        // Afficher les questions
        displayQuestions();
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des questions:', error);
        showAlert('Erreur lors du chargement des questions: ' + error.message, 'error');
    }
}

// Afficher les questions
function displayQuestions() {
    const container = document.getElementById('questions-list');
    
    if (currentQuestions.length === 0) {
        container.innerHTML = '<div class="info-message">Aucune question trouvée pour cette catégorie</div>';
        return;
    }
    
    // Appliquer les filtres
    const filteredQuestions = filterQuestionsData(currentQuestions);
    
    const html = filteredQuestions.map(question => createQuestionCard(question)).join('');
    container.innerHTML = html;
}

// Créer une carte de question
function createQuestionCard(question) {
    const isDeleted = question.deleted;
    const statusClass = isDeleted ? 'deleted' : 'active';
    const statusText = isDeleted ? 'Supprimée' : 'Active';
    
    // Debug: Afficher les champs disponibles (optionnel)
    // console.log('🔍 Question:', question.id, { title: question.title, code: question.code, question_type: question.question_type });
    
    // Utiliser les vrais champs de la DB
    const questionText = question.code || 'Code vide'; // code en DB
    const titleText = question.title || ''; // title en DB
    
    // Déterminer le type de question
    const questionType = question.question_type || 'input';
    
    // Gérer les options pour QCM
    let optionsHtml = '';
    if (questionType === 'qcm') {
        let options = [];
        if (question.options) {
            try {
                options = Array.isArray(question.options) ? question.options : JSON.parse(question.options);
            } catch (e) {
                console.warn('Erreur parsing options:', e);
                options = [];
            }
        }
        
        // S'assurer qu'il y a au moins 2 options
        if (options.length < 2) {
            options = options.concat(['', '']);
        }
        
        optionsHtml = `
            <div class="question-options">
                <strong>Options QCM :</strong>
                <div class="options-list">
                    ${options.map((option, index) => `
                        <div class="option-item">
                            <input type="text" value="${option}" onchange="updateQuestionOption('${question.id}', ${index}, this.value)" 
                                   class="option-input" placeholder="Option ${index + 1}">
                        </div>
                    `).join('')}
                    <button type="button" class="btn btn-secondary" onclick="addQuestionOption('${question.id}')" style="margin-top: 0.5rem;">
                        + Ajouter une option
                    </button>
                </div>
            </div>
        `;
    }
    
    // Échapper l'ID pour éviter les problèmes avec les UUID
    const questionId = question.id;
    const questionIdStr = `'${questionId}'`;
    
    return `
        <div class="question-card ${statusClass}" data-question-id="${questionId}">
            <div class="question-header">
                <div class="question-meta">
                    <span class="question-id">ID: ${question.question_id || questionId}</span>
                    <span class="question-type">${questionType}</span>
                    <span class="question-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <div class="question-content">
                <div class="form-group">
                    <label>Titre :</label>
                    <input type="text" value="${titleText}" 
                           onchange="updateQuestionField(${questionIdStr}, 'title', this.value)"
                           class="title-input" placeholder="Titre de la question">
                    ${!titleText ? '<small style="color: #666; font-style: italic;">Champ vide - ajoutez un titre</small>' : ''}
                </div>
                
                <div class="form-group">
                    <label>Code :</label>
                    <textarea class="code-textarea" onchange="updateQuestionField(${questionIdStr}, 'code', this.value)" 
                              placeholder="Code de la question">${questionText}</textarea>
                    ${!questionText || questionText === 'Code vide' ? '<small style="color: #666; font-style: italic;">Champ vide - ajoutez le code de la question</small>' : ''}
                </div>
                
                <div class="form-group">
                    <label>Type de question :</label>
                    <select class="type-select" onchange="updateQuestionField(${questionIdStr}, 'question_type', this.value)">
                        <option value="qcm" ${questionType === 'qcm' ? 'selected' : ''}>QCM</option>
                        <option value="input" ${questionType === 'input' ? 'selected' : ''}>Réponse libre</option>
                    </select>
                </div>
                
                ${optionsHtml}
                
                <div class="form-group">
                    <label>Réponse correcte :</label>
                    <input type="text" value="${question.correct_answer || question.reponse || ''}" 
                           onchange="updateQuestionField(${questionIdStr}, 'correct_answer', this.value)"
                           class="answer-input" placeholder="Réponse correcte">
                </div>
                
                <div class="form-group">
                    <label>Explication :</label>
                    <textarea class="explanation-textarea" onchange="updateQuestionField(${questionIdStr}, 'explanation', this.value)" 
                              placeholder="Explication de la réponse">${question.explanation || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Exemple :</label>
                    <textarea class="example-textarea" onchange="updateQuestionField(${questionIdStr}, 'exemple', this.value)" 
                              placeholder="Exemple d'utilisation">${question.exemple || ''}</textarea>
                </div>
            </div>
            
            <div class="question-actions">
                <button class="btn btn-success" onclick="saveQuestion(${questionIdStr})">💾 Sauvegarder</button>
                ${isDeleted ? 
                    `<button class="btn btn-success" onclick="restoreQuestion(${questionIdStr})">↩️ Restaurer</button>` :
                    `<button class="btn btn-danger" onclick="deleteQuestion(${questionIdStr})">🗑️ Supprimer</button>`
                }
            </div>
        </div>
    `;
}

// Filtrer les questions
function filterQuestions() {
    displayQuestions();
}

// Appliquer les filtres aux données
function filterQuestionsData(questions) {
    const statusFilter = document.getElementById('question-status-filter')?.value || 'all';
    const typeFilter = document.getElementById('question-type-filter')?.value || 'all';
    
    console.log('🔍 Filtrage des questions:', { statusFilter, typeFilter, totalQuestions: questions.length });
    
    return questions.filter(question => {
        // Filtre par statut
        if (statusFilter === 'active' && question.deleted) {
            console.log('❌ Question filtrée (active):', question.id, question.deleted);
            return false;
        }
        if (statusFilter === 'deleted' && !question.deleted) {
            console.log('❌ Question filtrée (deleted):', question.id, question.deleted);
            return false;
        }
        
        // Filtre par type
        if (typeFilter !== 'all' && question.question_type !== typeFilter) {
            console.log('❌ Question filtrée (type):', question.id, question.question_type, 'vs', typeFilter);
            return false;
        }
        
        console.log('✅ Question conservée:', question.id, question.question_type, question.deleted);
        return true;
    });
}

// Modifier une question
function editQuestion(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // TODO: Implémenter l'édition de question
    showAlert('Fonction d\'édition de question à implémenter', 'info');
}

// Supprimer une question
async function deleteQuestion(questionId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;
    
    // Nettoyer l'ID si nécessaire (enlever les guillemets)
    const cleanId = questionId.replace(/'/g, '');
    
    try {
        const { error } = await supabase
            .from('quiz_questions')
            .update({ deleted: true })
            .eq('id', cleanId);
        
        if (error) throw error;
        
        showAlert('Question supprimée avec succès', 'success');
        await loadQuestionsForCategory();
        
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        showAlert('Erreur lors de la suppression: ' + error.message, 'error');
    }
}

// Restaurer une question
async function restoreQuestion(questionId) {
    // Nettoyer l'ID si nécessaire (enlever les guillemets)
    const cleanId = questionId.replace(/'/g, '');
    
    try {
        const { error } = await supabase
            .from('quiz_questions')
            .update({ deleted: false })
            .eq('id', cleanId);
        
        if (error) throw error;
        
        showAlert('Question restaurée avec succès', 'success');
        await loadQuestionsForCategory();
        
    } catch (error) {
        console.error('❌ Erreur lors de la restauration:', error);
        showAlert('Erreur lors de la restauration: ' + error.message, 'error');
    }
}

// Mettre à jour la liste des catégories pour le sélecteur de questions
function updateQuestionsCategorySelect() {
    const select = document.getElementById('questions-category');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Choisir une catégorie --</option>' +
        categories.map(category => 
            `<option value="${category.name}">${category.display_name || category.name}</option>`
        ).join('');
}

// Mettre à jour un champ de question
function updateQuestionField(questionId, field, value) {
    // Nettoyer l'ID si nécessaire (enlever les guillemets)
    const cleanId = questionId.replace(/'/g, '');
    const question = currentQuestions.find(q => q.id === cleanId);
    if (question) {
        question[field] = value;
        console.log(`Champ ${field} mis à jour pour la question ${cleanId}:`, value);
        
        // Si le type change, mettre à jour l'affichage
        if (field === 'question_type') {
            updateQuestionDisplay(cleanId);
        }
        
        // Mettre à jour les champs mappés
        if (field === 'title') {
            question.titre = value;
        } else if (field === 'code') {
            question.question = value;
        }
    }
}

// Mettre à jour l'affichage d'une question (pour le changement de type)
function updateQuestionDisplay(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Recharger l'affichage des questions pour mettre à jour les options
    displayQuestions();
}

// Mettre à jour une option de QCM
function updateQuestionOption(questionId, optionIndex, value) {
    // Nettoyer l'ID si nécessaire (enlever les guillemets)
    const cleanId = questionId.replace(/'/g, '');
    const question = currentQuestions.find(q => q.id === cleanId);
    if (question && question.question_type === 'qcm') {
        let options = [];
        try {
            options = Array.isArray(question.options) ? question.options : JSON.parse(question.options || '[]');
        } catch (e) {
            options = [];
        }
        
        options[optionIndex] = value;
        question.options = options;
        console.log(`Option ${optionIndex} mise à jour pour la question ${cleanId}:`, value);
    }
}

// Ajouter une option QCM
function addQuestionOption(questionId) {
    // Nettoyer l'ID si nécessaire (enlever les guillemets)
    const cleanId = questionId.replace(/'/g, '');
    const question = currentQuestions.find(q => q.id === cleanId);
    if (question && question.question_type === 'qcm') {
        let options = [];
        try {
            options = Array.isArray(question.options) ? question.options : JSON.parse(question.options || '[]');
        } catch (e) {
            options = [];
        }
        
        options.push('');
        question.options = options;
        
        // Recharger l'affichage pour montrer la nouvelle option
        displayQuestions();
    }
}

// Sauvegarder une question
async function saveQuestion(questionId) {
    // Nettoyer l'ID si nécessaire (enlever les guillemets)
    const cleanId = questionId.replace(/'/g, '');
    const question = currentQuestions.find(q => q.id === cleanId);
    if (!question) return;
    
    try {
        console.log('💾 Sauvegarde de la question:', cleanId);
        
        // Préparer les données à sauvegarder selon la vraie structure DB
        const updateData = {
            title: question.title, // title en DB
            code: question.code, // code en DB
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            exemple: question.exemple,
            question_type: question.question_type
        };
        
        // Ajouter les options si c'est un QCM
        if (question.question_type === 'qcm' && question.options) {
            updateData.options = JSON.stringify(question.options);
        }
        
        const { error } = await supabase
            .from('quiz_questions')
            .update(updateData)
            .eq('id', cleanId);
        
        if (error) throw error;
        
        showAlert('Question sauvegardée avec succès', 'success');
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        showAlert('Erreur lors de la sauvegarde: ' + error.message, 'error');
    }
}
