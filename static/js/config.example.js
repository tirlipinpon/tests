// config.example.js - Exemple de configuration (COMMITÉ)
// Copiez ce fichier vers config.local.js et remplissez vos vraies clés

const SUPABASE_URL = 'https://votre-projet.supabase.co';
const SUPABASE_KEY = 'votre-cle-publique-ici';

// Export pour utilisation dans les autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_KEY };
} else {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_KEY = SUPABASE_KEY;
}
