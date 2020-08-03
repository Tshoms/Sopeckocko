const mongoose = require('mongoose'); // pour importer "mongoose" .
const uniqueValidator = require('mongoose-unique-validator'); // importer le plugin "mongoose-unique-validator" pour la sécurité des comptes des Users .

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // méthode pour un compte uniqie "unique: true" .
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
