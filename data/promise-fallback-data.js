// promise-fallback-data.js - Données de fallback pour promise.html
function getFallbackQuizData() {
  console.log('⚠️ Utilisation des données de fallback pour promise');
  return [
  // ===== DÉBUTANT =====
  {
    id: "promise-1",
    titre: "1️⃣ Promise simple resolve",
    code: `const p = new Promise((resolve, reject) => { 
  resolve('OK'); 
});
p.then(console.log);`,
    reponse: ["ok"],
    explication: "Une promise résolue avec 'OK' : then récupère la valeur et l'affiche."
  },
  
  {
    id: "promise-2",
    titre: "2️⃣ Promise simple reject",
    code: `const p = new Promise((resolve, reject) => { 
  reject('Erreur'); 
});
p.catch(console.log);`,
    reponse: ["erreur"],
    explication: "Une promise rejetée : catch récupère l'erreur et l'affiche."
  },
  
  {
    id: "promise-3",
    titre: "3️⃣ Chaînage then",
    code: `Promise.resolve(1)
  .then(x => x + 1)
  .then(console.log);`,
    reponse: ["2"],
    explication: "La première then ajoute 1 à 1, la deuxième affiche 2."
  },
  
  {
    id: "promise-4",
    titre: "4️⃣ Chaînage then avec erreur",
    code: `Promise.resolve(1)
  .then(x => { 
    throw 'Erreur'; 
  })
  .then(x => x + 1)
  .catch(console.log);`,
    reponse: ["erreur"],
    explication: "L'erreur levée interrompt le chain, catch récupère 'Erreur'."
  },

  // ===== ASYNC / AWAIT =====
  {
    id: "promise-5",
    titre: "5️⃣ Async / await simple",
    code: `async function f() { 
  return 42; 
}
f().then(console.log);`,
    reponse: ["42"],
    explication: "Une fonction async retourne une promise résolue avec 42."
  },
  
  {
    id: "promise-6",
    titre: "6️⃣ Await valeur promise",
    code: `async function f() { 
  let x = await Promise.resolve(10); 
  console.log(x); 
}
f();`,
    reponse: ["10"],
    explication: "await attend la résolution de la promise et affiche 10."
  },
  
  {
    id: "promise-7",
    titre: "7️⃣ Async / await avec try/catch",
    code: `async function f() { 
  try { 
    await Promise.reject('Oops'); 
  } catch(e) { 
    console.log(e); 
  } 
}
f();`,
    reponse: ["oops"],
    explication: "La promise est rejetée, le catch récupère l'erreur et l'affiche."
  },

  // ===== SÉQUENTIEL VS PARALLÈLE =====
  {
    id: "promise-8",
    titre: "8️⃣ Exécution séquentielle",
    code: `async function f() { 
  let a = await Promise.resolve(1); 
  let b = await Promise.resolve(2); 
  console.log(a, b); 
}
f();`,
    reponse: ["1","2"],
    explication: "Les await successifs s'exécutent séquentiellement, affichant 1 puis 2."
  },
  
  {
    id: "promise-9",
    titre: "9️⃣ Exécution parallèle avec Promise.all",
    code: `Promise.all([
  Promise.resolve(1), 
  Promise.resolve(2)
]).then(console.log);`,
    reponse: ["1","2"],
    explication: "Promise.all résout toutes les promises en parallèle et retourne un tableau des résultats."
  },

  // ===== INTERACTIONS AVEC SETTIMEOUT =====
  {
    id: "promise-10",
    titre: "🔟 Promise + setTimeout",
    code: `new Promise(resolve => 
  setTimeout(() => resolve('ok'), 0)
).then(console.log);
console.log('done');`,
    reponse: ["done","ok"],
    explication: "setTimeout décalé, 'done' s'affiche avant la promise résolue."
  },
  
  {
    id: "promise-11",
    titre: "1️⃣1️⃣ Async / await + setTimeout",
    code: `async function f() { 
  let x = await new Promise(resolve => 
    setTimeout(() => resolve('ok'), 0)
  ); 
  console.log(x); 
}
console.log('start'); 
f();`,
    reponse: ["start","ok"],
    explication: "'start' s'affiche d'abord, await attend la resolution de la promise."
  },

  // ===== EXPERT =====
  {
    id: "promise-12",
    titre: "1️⃣2️⃣ Promise.race",
    code: `Promise.race([
  Promise.resolve('A'), 
  new Promise(resolve => 
    setTimeout(() => resolve('B'), 10)
  )
]).then(console.log);`,
    reponse: ["a"],
    explication: "Promise.race prend la première promise résolue : 'A'."
  },
  
  {
    id: "promise-13",
    titre: "1️⃣3️⃣ Promise.allSettled",
    code: `Promise.allSettled([
  Promise.resolve('ok'), 
  Promise.reject('erreur')
]).then(console.log);`,
    reponse: ["ok","erreur"],
    explication: "allSettled retourne le résultat de toutes les promises, même rejetées."
  },
  {
    id: "promise-14",
    titre: "1️⃣4️⃣ Async / await + erreur non catchée",
    code: `async function f() { 
  await Promise.reject('Oops'); 
}
f().catch(console.log);`,
    reponse: ["oops"],
    explication: "La promise rejetée est catchée par f().catch, affichant 'Oops'."
  },
  
  {
    id: "promise-15",
    titre: "1️⃣5️⃣ Chaînage complexe",
    code: `Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { 
    throw 'Erreur'; 
  })
  .catch(e => 'recup')
  .then(console.log);`,
    reponse: ["recup"],
    explication: "Erreur capturée par catch, valeur retournée 'recup' affichée ensuite."
  },

  // ===== EXERCICES COMPLÉMENTAIRES =====
  // ===== Microtasks vs Macrotasks =====
  {
    id: "promise-16",
    titre: "1️⃣6️⃣ Microtasks vs Macrotasks explicite",
    code: `console.log('start');
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
console.log('end');`,
    reponse: ["start","end","microtask","macrotask"],
    explication: "Les microtasks (Promises) s'exécutent avant les macrotasks (setTimeout), même avec 0 ms."
  },

  // ===== Async / await séquentiel =====
  {
    id: "promise-17",
    titre: "1️⃣7️⃣ Async/await avec plusieurs Promises",
    code: `async function f() {
  const a = Promise.resolve(1);
  const b = Promise.resolve(2);

  console.log(await a);
  console.log(await b);
}
f();`,
    reponse: ["1","2"],
    explication: "Les await successifs s'exécutent séquentiellement, donc 1 puis 2."
  },

  // ===== Promise.any =====
  {
    id: "promise-18",
    titre: "1️⃣8️⃣ Promise.any",
    code: `Promise.any([
  Promise.reject('erreur1'),
  Promise.resolve('ok'),
  Promise.reject('erreur2')
]).then(console.log);`,
    reponse: ["ok"],
    explication: "Promise.any renvoie la première promise réussie."
  },

  // ===== Promise.allSettled avec statut =====
  {
    id: "promise-19",
    titre: "1️⃣9️⃣ Promise.allSettled avec statut",
    code: `Promise.allSettled([
  Promise.resolve('A'),
  Promise.reject('B'),
  Promise.resolve('C')
]).then(results => results.map(r => r.status));`,
    reponse: ["fulfilled","rejected","fulfilled"],
    explication: "allSettled retourne un tableau d'objets avec le statut de chaque promise."
  },

  // ===== Erreur non catchée =====
  {
    id: "promise-20",
    titre: "2️⃣0️⃣ Erreur non catchée dans async",
    code: `async function f() {
  await Promise.reject('Oops');
}
f();
console.log('after');`,
    reponse: ["after"],
    explication: "L'erreur n'arrête pas le code synchrone, 'after' s'affiche, et un warning pour la promise rejetée est généré."
  },

  // ===== Combinaison microtask + macrotask =====
  {
    id: "promise-21",
    titre: "2️⃣1️⃣ Combinaison microtask + macrotask",
    code: `setTimeout(() => console.log('1'), 0);
Promise.resolve().then(() => console.log('2'));
setTimeout(() => console.log('3'), 0);
Promise.resolve().then(() => console.log('4'));`,
    reponse: ["2","4","1","3"],
    explication: "Les microtasks (Promises) s'exécutent avant toutes les macrotasks (setTimeout), même si plusieurs macrotasks sont en file."
  }
];
}