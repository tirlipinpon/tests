// this-fallback-data.js - Données de fallback pour this.html
function getFallbackQuizData() {
  console.log('⚠️ Utilisation des données de fallback pour this');
  return [
  {
    id: "this-1",
    titre: "1️⃣ Fonction normale directe",
    code: `
const obj = {
  nom: "Akira",
  direNom: function() {
    console.log(this.nom);
  }
};
obj.direNom();
    `,
    reponse: ["akira"],
    explication: "Fonction normale : 'this' fait référence à l'objet appelant (obj), donc this.nom = 'Akira'."
  },
  {
    id: "this-2",
    titre: "2️⃣ Fonction fléchée directe",
    code: `
const obj = {
  nom: "Akira",
  direNom: () => {
    console.log(this.nom);
  }
};
obj.direNom();
    `,
    reponse: ["undefined"],
    explication: "Fonction fléchée : 'this' n'est pas lié à l'objet, mais au contexte de création (global), donc undefined."
  },
  {
    id: "this-3",
    titre: "3️⃣ Flèche à l'intérieur d'une fonction normale",
    code: `
const obj = {
  nom: "Akira",
  direNom: function() {
    const f = () => console.log(this.nom);
    f();
  }
};
obj.direNom();
    `,
    reponse: ["akira"],
    explication: "La flèche hérite de 'this' de la fonction normale (obj), donc affiche 'Akira'."
  },
  {
    id: "this-4",
    titre: "4️⃣ setTimeout classique",
    code: `
const obj = {
  nom: "Akira",
  direNom: function() {
    setTimeout(function() {
      console.log(this.nom);
    }, 0);
  }
};
obj.direNom();
    `,
    reponse: ["undefined"],
    explication: "Dans setTimeout classique, 'this' perd sa référence à l'objet et devient global ou undefined."
  },
  {
    id: "this-5",
    titre: "5️⃣ setTimeout avec flèche",
    code: `
const obj = {
  nom: "Akira",
  direNom: function() {
    setTimeout(() => console.log(this.nom), 0);
  }
};
obj.direNom();
    `,
    reponse: ["akira"],
    explication: "La flèche prend 'this' du contexte de la fonction normale, donc 'Akira'."
  },
  {
    id: "this-6",
    titre: "6️⃣ setTimeout avec bind",
    code: `
const obj = {
  nom: "Akira",
  direNom: function() {
    setTimeout(function() {
      console.log(this.nom);
    }.bind(this), 0);
  }
};
obj.direNom();
    `,
    reponse: ["akira"],
    explication: "bind(this) lie 'this' de la fonction à l'objet obj, donc affiche 'Akira'."
  },
  {
    id: "this-7",
    titre: "7️⃣ setTimeout avec variable self",
    code: `
const obj = {
  nom: "Akira",
  direNom: function() {
    const self = this;
    setTimeout(function() {
      console.log(self.nom);
    }, 0);
  }
};
obj.direNom();
    `,
    reponse: ["akira"],
    explication: "On capture 'this' dans self et on l'utilise dans setTimeout, donc affiche 'Akira'."
  },
  {
    id: "this-8",
    titre: "8️⃣ Closure simple",
    code: `
function creerPersonne() {
  let nom = "Akira";
  return {
    direNom: function() {
      console.log(nom);
    }
  };
}
const p = creerPersonne();
p.direNom();
    `,
    reponse: ["akira"],
    explication: "Variable 'nom' est privée dans la closure, accessible par la méthode direNom()."
  },
  {
    id: "this-9",
    titre: "9️⃣ Closure + propriété publique",
    code: `
function creerPersonne() {
  let nom = "Akira";
  return {
    nom: "Visible",
    direNom: function() {
      console.log(nom);
      console.log(this.nom);
    }
  };
}
const p = creerPersonne();
p.direNom();
    `,
    reponse: ["akira", "visible"],
    explication: "'nom' dans la closure est privé (Akira), this.nom est la propriété publique de l'objet (Visible)."
  },
  {
    id: "this-10",
    titre: "🔟 Closure + flèche à l'intérieur",
    code: `
function creerPersonne() {
  let nom = "Akira";
  return {
    nom: "Visible",
    direNom: function() {
      const f = () => {
        console.log(nom);
        console.log(this.nom);
      };
      f();
    }
  };
}
const p = creerPersonne();
p.direNom();
    `,
    reponse: ["akira", "visible"],
    explication: "La flèche hérite du 'this' de la méthode normale (obj) et peut accéder à la variable privée (closure)."
  },
  {
    id: "this-11",
    titre: "1️⃣1️⃣ Closure + setTimeout classique",
    code: `
function creerPersonne() {
  let nom = "Akira";
  return {
    nom: "Visible",
    direNom: function() {
      setTimeout(function() {
        console.log(nom);
        console.log(this.nom);
      }, 0);
    }
  };
}
const p = creerPersonne();
p.direNom();
    `,
    reponse: ["akira", "undefined"],
    explication: "setTimeout classique perd le 'this', mais la closure permet d'accéder à nom = Akira."
  },
  {
    id: "this-12",
    titre: "1️⃣2️⃣ Closure + setTimeout avec flèche",
    code: `
function creerPersonne() {
  let nom = "Akira";
  return {
    nom: "Visible",
    direNom: function() {
      setTimeout(() => {
        console.log(nom);
        console.log(this.nom);
      }, 0);
    }
  };
}
const p = creerPersonne();
p.direNom();
    `,
    reponse: ["akira", "visible"],
    explication: "Flèche dans setTimeout hérite de 'this' de la méthode normale et peut accéder à la closure."
  },
  {
    id: "this-13",
    titre: "1️⃣3️⃣ Closure + setTimeout + bind",
    code: `
function creerPersonne() {
  let nom = "Akira";
  return {
    nom: "Visible",
    direNom: function() {
      setTimeout(function() {
        console.log(nom);
        console.log(this.nom);
      }.bind(this), 0);
    }
  };
}
const p = creerPersonne();
p.direNom();
    `,
    reponse: ["akira", "visible"],
    explication: "Bind lie 'this' à l'objet et la closure permet d'accéder à nom privé."
  }
];
}