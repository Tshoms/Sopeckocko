const express    = require('express'); // pour importer "express" .
const bodyParser = require('body-parser'); // exportation du "bodyParser" .
const mongoose   = require('mongoose'); // importation de mongoos .
const path       = require('path'); // tres utile pour la sauvegarde des fichiers .

const sauceRoutes = require('./routes/sauces'); // emporter le fichier sauce.js .
const userRoutes  = require('./routes/user'); // importer nos routes .

const app        = express(); // ce qui permmet de faire un app express (notre app).
mongoose.connect('mongodb+srv://tshoms:Noirfier17@cluster0.3ezdf.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// --- middleware ---

app.use((req, res, next) => {  // CORS - Ces headers permettent d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json()); // pour transformer le corps de la requete eb objet JSON .

app.use('/images', express.static(path.join(__dirname, 'images'))); // pour faire des requetes et sauvegarde des fichiers images .

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes); // la racine de tous ce qui est routes lier à l'authentification .



module.exports = app; // pour pouvoir exporter notre app afin qu'il soit dispo dans d'autres fichier .
