// side-fallback-data.js - Données de fallback pour side.html
function getFallbackQuizData() {
  console.log('⚠️ Utilisation des données de fallback pour side');
  return [
  // ===== Pure functions & Side Effects =====
  {
    id: "side-1",
    titre: "1️⃣ Pure function simple",
    code: `function add(a, b) { return a + b; }
console.log(add(2, 3));`,
    reponse: ["5"],
    explication: "La fonction ne modifie aucune variable externe et retourne toujours le même résultat pour les mêmes paramètres."
  },

  {
    id: "side-2",
    titre: "2️⃣ Fonction avec side effect",
    code: `let x = 1;
function increment() { x++; }
increment();
console.log(x);`,
    reponse: ["2"],
    explication: "La fonction modifie une variable externe → side effect."
  },

  {
    id: "side-3",
    titre: "3️⃣ Pure function vs side effect",
    code: `let y = 10;
function pureAdd(a, b) { return a + b; }
function impureAdd(a, b) { y += a + b; return y; }
console.log(pureAdd(2,3), impureAdd(2,3));`,
    reponse: ["5","15"],
    explication: "pureAdd est pure, impureAdd modifie y → side effect."
  },

  // ===== Destructuring & Spread/Rest =====
  {
    id: "side-4",
    titre: "4️⃣ Destructuring objet",
    code: `const user = {name: 'Alice', age: 25};
const {name, age} = user;
console.log(name, age);`,
    reponse: ["Alice","25"],
    explication: "Destructuring permet de créer des variables directement depuis les propriétés de l'objet."
  },

  {
    id: "side-5",
    titre: "5️⃣ Destructuring tableau",
    code: `const nums = [1,2,3];
const [a, b, c] = nums;
console.log(a, b, c);`,
    reponse: ["1","2","3"],
    explication: "Destructuring de tableau permet d'assigner les éléments à des variables."
  }
  ];
}