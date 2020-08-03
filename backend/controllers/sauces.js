const Sauce = require('../models/sauces'); // exporter le "Sauce" .
const fs    = require('fs'); // importer un package de node pour avoir access aux differentes opérations lier aux systéme de fichiers .


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// -------------------- function likes/dislikes -------------------------

exports.reactToSauce = (req, res, next) => {  // Fonction qui permet aux utilisateurs d'aimer / ne pas aimer / ne pas aimer / ne pas aimer les sauces
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
    switch (req.body.like) {  // Utilisation d'un interrupteur pour faciliter les 4 cas différents
        case 1 : // Si l'utilisateur a aimé la sauce
            if (!sauce.usersLiked.includes(req.body.userId)) {  // Et qu'il n'a pas encore aimé la sauce
              Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
              .catch((error) => {res.status(400).json({error: error});});
            } // Ajoutez un like à la sauce et poussez son userId dans le tableau usersLiked
          break;

        case -1 :  // Si l'utilisateur n'a pas aimé la sauce
            if (!sauce.usersDisliked.includes(req.body.userId)) {  // Et qu'il n'a pas encore détesté la sauce
              Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(201).json({ message: 'Dislike ajouté avec succès !' }))
          .catch(error => res.status(400).json({ error }));
            }  // Ajoutez une aversion à la sauce et poussez son userId dans le tableau usersDisliked
          break;

          case 0: // Deux options différentes ici, soit supprimer un j'aime, soit supprimer une aversion
           if (sauce.usersLiked.includes(req.body.userId)) { // Si l'identifiant des utilisateurs est déjà présent dans usersLiked
             Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id})
             .then(() => res.status(201).json({ message: 'Like annulé avec succès !' })) // En cliquant sur J'aime, supprimez un like de la sauce et supprimez son userId du tableau
             .catch(error => res.status(400).json({ error }));
           } else if (sauce.usersDisliked.includes(req.body.userId)) { // Si l'ID utilisateur est déjà présent dans les utilisateurs
             Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
             .then(() => res.status(201).json({ message: 'Dislike annulé avec succès !' })) // Fait le contraire
             .catch(error => res.status(400).json({ error }));
           }
         break;

       default: // Si aucune des 4 options précédentes n'est vraie, ce message d'erreur apparaîtra
         throw { error: "Impossible de modifier vos likes, réessayer ultérieurement" };
   }
 })
 .catch(error => res.status(400).json({ error }));
};
