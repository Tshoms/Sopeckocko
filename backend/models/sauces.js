const mongoose = require('mongoose'); // pour importer "mongoose" .



const sauceSchema = mongoose.Schema({  // Générer un schéma de mongoose pour nos sauces .
    userId: { type: String, required: true },
    name: { type: String, required: true, },
    manufacturer: { type: String, required: true,},
    description: { type: String, required: true,},
    mainPepper: { type: String, required: true, },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, default : 0 },
    likes: { type: Number, required: false, default : 0 },
    dislikes: { type: Number, required: false, default : 0 },
    usersLiked: [{ type: String, required: false, default : [] }],
    usersDisliked: [{ type: String, required: false, default : [] }],
  });


module.exports = mongoose.model('Sauce', sauceSchema); // exporter le schéma "Sauce" .
