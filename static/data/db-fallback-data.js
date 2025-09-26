// db-fallback-data.js - Données de fallback pour db.html
function getFallbackQuizData() {
  console.log('⚠️ Utilisation des données de fallback pour db');
  return [
    {
      id: "db-1",
      titre: "1️⃣ Définition d'un SGBD",
      code: "Quel est le rôle principal d'un Système de Gestion de Base de Données (SGBD) ?",
      options: [
        "Système permettant l'exécution de programmes d'application.",
        "Logiciel spécialisé pour stocker, récupérer et manipuler des données.",
        "Langage de requête pour interroger des bases de données relationnelles."
      ],
      reponse: "Logiciel spécialisé pour stocker, récupérer et manipuler des données.",
      type: "qcm",
      explication: "Un **SGBD (Système de Gestion de Base de Données)** est un logiciel conçu pour stocker, récupérer et manipuler des données dans une base de données."
    },
    {
      id: "db-2",
      titre: "2️⃣ Langage pour définir les données",
      code: "Quel sigle est utilisé pour désigner le langage permettant de 'Décrire les données' dans un SGBD ?",
      options: [],
      reponse: "DDL",
      type: "input",
      explication: "Le **DDL (Data Definition Language)** est le langage de définition des données, utilisé pour décrire les données et les contraintes."
    },
    {
      id: "db-3",
      titre: "3️⃣ Langage de manipulation des données",
      code: "Quel sigle désigne le langage permettant de 'Manipuler les données' dans un SGBD ?",
      options: [],
      reponse: "DML",
      type: "input",
      explication: "Le **DML (Data Manipulation Language)** est le langage de manipulation des données, utilisé pour interroger, insérer, modifier et supprimer des données."
    }
  ];
}