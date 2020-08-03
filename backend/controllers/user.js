const bcrypt = require('bcrypt'); // importer notre package de scryptage "bcrypt" .
const jwt = require('jsonwebtoken'); // importer le plugin pour le "TOKEN" .

const User   = require('../models/User'); // immporter notre model "User" .

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // pour scypter le message .
   .then(hash => {
     const user = new User({ // pour prendre le mots de passe scrypter et créer un nouveau user .
       email: req.body.email,
       password: hash
     });
     user.save() // et il va enregistrer l'utilisateur dans la base de donnée .
       .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
       .catch(error => res.status(400).json({ error }));
   })
   .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res, next) => {
  console.log('test');
  User.findOne({ email: req.body.email }) // méthode "findOne" pour trouver un user de la base de donnée "méthode asynchrone".
   .then(user => {
     if (!user) { // si jamais il a pas trouver de user .
       return res.status(401).json({ error: 'Utilisateur non trouvé !' });
     }
     bcrypt.compare(req.body.password, user.password) // on compare le mots de passe entrée avec le hash dans la base de donnée .
       .then(valid => {
         if (!valid) { // si jamais le mots de passe est incorrect .
           return res.status(401).json({ error: 'Mot de passe incorrect !' });
         }
         res.status(200).json({
           userId: user._id,
           token:  jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
         });
       })
       .catch(error => res.status(500).json({ error })); // en cas d'erreur du server puisse qu'il est sur de trouver le compte .
   })
   .catch(error => res.status(500).json({ error }));

};
