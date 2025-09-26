// admin.js - Script d'administration du système de quiz
let categories = [];
let currentEditingCategory = null;
let validatedQuestions = [];

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
        
        // Valider chaque question
        const validatedQuestions = questions.map((q, index) => {
            if (!q.id || !q.titre || !q.reponse) {
                throw new Error(`Question ${index + 1}: id, titre et reponse sont obligatoires`);
            }
            
            return {
                id: q.id,
                titre: q.titre,
                code: q.code || '',
                options: q.options || [],
                reponse: q.reponse,
                type: q.type || 'qcm',
                explication: q.explication || '',
                exemple: q.exemple || ''
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
            <h4>Question ${index + 1}: ${q.titre}</h4>
            <p><strong>Type:</strong> ${q.type}</p>
            <p><strong>Réponse:</strong> ${q.reponse}</p>
            ${q.options.length > 0 ? `<p><strong>Options:</strong> ${q.options.join(', ')}</p>` : ''}
            ${q.explication ? `<p><strong>Explication:</strong> ${q.explication}</p>` : ''}
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
        
        // Transformer les questions pour Supabase
        const transformedQuestions = questions.map(q => ({
            question_id: q.id,
            category: category,
            title: q.titre,
            code: q.code || '',
            options: q.options || [],
            correct_answer: q.reponse,
            question_type: q.type || 'qcm',
            explanation: q.explication || '',
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
    if (sectionName === 'stats') {
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
